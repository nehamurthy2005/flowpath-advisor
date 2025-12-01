import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { quizData } = await req.json();

    // Save quiz response
    const { data: quizResponse, error: quizError } = await supabase
      .from('career_quiz_responses')
      .insert({
        user_id: user.id,
        education_level: quizData.education_level,
        stream: quizData.stream,
        interests: quizData.interests,
        work_preference: quizData.work_preference,
        favorite_subjects: quizData.favorite_subjects,
        learning_style: quizData.learning_style,
        hardware_software: quizData.hardware_software,
        user_goal: quizData.user_goal
      })
      .select()
      .single();

    if (quizError) throw quizError;

    // Prepare AI prompt
    const prompt = `You are a Career Recommendation AI built for students.
Analyze the following details and recommend the best career domain and personalized roadmap.

User Input:
- Education Level: ${quizData.education_level}
- Stream: ${quizData.stream || 'Not specified'}
- Interests: ${quizData.interests.join(', ')}
- Work Preferences: ${quizData.work_preference}
- Favorite Subjects: ${quizData.favorite_subjects.join(', ')}
- Preferred Learning Type: ${quizData.learning_style}
- Hardware or Software Interest: ${quizData.hardware_software || 'Not specified'}
- Goals: ${quizData.user_goal}

Your Tasks:
1. Predict the THREE best-suited career domains with % fit (0-100)
2. Choose ONE most suitable field and generate a detailed roadmap

Return ONLY a valid JSON object with this exact structure (no markdown, no backticks):
{
  "primary_domain": {
    "name": "Domain name",
    "confidence": 92,
    "description": "Brief field overview"
  },
  "alternative_domains": [
    {
      "name": "Alternative domain 1",
      "confidence": 85,
      "description": "Brief description"
    },
    {
      "name": "Alternative domain 2",
      "confidence": 78,
      "description": "Brief description"
    }
  ],
  "roadmap": {
    "core_subjects": ["Subject 1", "Subject 2", "Subject 3"],
    "software_tools": ["Tool 1", "Tool 2", "Tool 3"],
    "hardware_components": ["Component 1", "Component 2"],
    "key_skills": ["Skill 1", "Skill 2", "Skill 3"],
    "job_roles": ["Role 1", "Role 2", "Role 3"],
    "companies": ["Company 1", "Company 2", "Company 3"],
    "certifications": ["Cert 1", "Cert 2", "Cert 3"],
    "learning_path": [
      {
        "phase": "Phase 1: Foundation",
        "duration": "6 months",
        "activities": ["Activity 1", "Activity 2"]
      },
      {
        "phase": "Phase 2: Intermediate",
        "duration": "1 year",
        "activities": ["Activity 1", "Activity 2"]
      },
      {
        "phase": "Phase 3: Advanced",
        "duration": "1 year",
        "activities": ["Activity 1", "Activity 2"]
      }
    ]
  }
}`;

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a career counseling AI that returns only valid JSON responses." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // Parse AI response
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      const cleanContent = aiContent.replace(/```json\n?|\n?```/g, '').trim();
      parsedResponse = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse AI response:", aiContent);
      throw new Error("Failed to parse AI response");
    }

    // Save recommendation
    const { data: recommendation, error: recError } = await supabase
      .from('career_recommendations')
      .insert({
        user_id: user.id,
        quiz_response_id: quizResponse.id,
        recommended_domain: parsedResponse.primary_domain.name,
        confidence_score: parsedResponse.primary_domain.confidence,
        alternative_domains: parsedResponse.alternative_domains,
        roadmap: parsedResponse.roadmap
      })
      .select()
      .single();

    if (recError) throw recError;

    return new Response(
      JSON.stringify({
        ...parsedResponse,
        recommendation_id: recommendation.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});