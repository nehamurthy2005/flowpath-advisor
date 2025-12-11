import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, action, sectionName, sectionContent } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'analyze') {
      systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze resumes and provide detailed feedback.
      
You MUST respond with valid JSON in this exact format:
{
  "overall_score": <number 0-100>,
  "section_scores": {
    "formatting": <number>,
    "keywords": <number>,
    "experience": <number>,
    "skills": <number>,
    "grammar": <number>
  },
  "sections": {
    "summary": {"original": "<extracted text>", "score": <number>, "feedback": "<what's good and what's missing>"},
    "experience": {"original": "<extracted text>", "score": <number>, "feedback": "<feedback>"},
    "education": {"original": "<extracted text>", "score": <number>, "feedback": "<feedback>"},
    "skills": {"original": "<extracted text>", "score": <number>, "feedback": "<feedback>"},
    "projects": {"original": "<extracted text>", "score": <number>, "feedback": "<feedback>"}
  },
  "missing_keywords": ["<keyword1>", "<keyword2>"],
  "improvement_suggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>"]
}

Only include sections that exist in the resume. Be specific and actionable in feedback.`;

      userPrompt = `Analyze this resume and provide ATS score and detailed feedback:\n\n${resumeText}`;
    } else if (action === 'improve') {
      systemPrompt = `You are an expert resume writer. Improve resume sections to be more impactful, ATS-friendly, and professional.
      
Focus on:
- Adding quantifiable metrics and achievements
- Using strong action verbs
- Including relevant keywords
- Making content concise yet impactful
- Professional tone

Respond with JSON: {"improved": "<improved content>"}`;

      userPrompt = `Improve this "${sectionName}" section of a resume:\n\n${sectionContent}\n\nMake it more impactful with metrics, action verbs, and professional language.`;
    }

    console.log('Calling Lovable AI for:', action);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response received');

    // Parse JSON from the response
    let result;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1].trim();
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Try to extract JSON directly
      const startIdx = content.indexOf('{');
      const endIdx = content.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) {
        result = JSON.parse(content.substring(startIdx, endIdx + 1));
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-resume:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
