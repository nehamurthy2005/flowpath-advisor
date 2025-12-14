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
    const { profileContent, targetRole } = await req.json();

    if (!profileContent) {
      return new Response(
        JSON.stringify({ error: 'Profile content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert LinkedIn profile optimizer and career coach. Your task is to analyze LinkedIn profiles and provide comprehensive optimization suggestions.

When given a LinkedIn profile, you must:
1. Extract and identify all profile sections (Name, Headline, About, Experience, Education, Skills)
2. Score the current profile (0-100) based on completeness, keyword optimization, and professional appeal
3. Generate an optimized version of each section
4. Provide specific feedback for each section
5. Score the optimized profile

ALWAYS respond with valid JSON in this exact format:
{
  "profile_score_before": <number 0-100>,
  "profile_score_after": <number 0-100>,
  "score_improvement": <number>,
  "original": {
    "name": "<extracted name>",
    "headline": "<extracted headline>",
    "about": "<extracted about section>",
    "experience": "<extracted experience>",
    "education": "<extracted education>",
    "skills": "<extracted skills>"
  },
  "optimized": {
    "name": "<same name>",
    "headline": "<improved headline with keywords and value proposition>",
    "about": "<improved about section with achievements, metrics, and call to action>",
    "experience": "<improved experience with action verbs, metrics, and impact>",
    "education": "<cleaned education section>",
    "skills": "<prioritized and relevant skills>"
  },
  "section_feedback": {
    "headline": "<specific improvement feedback>",
    "about": "<specific improvement feedback>",
    "experience": "<specific improvement feedback>",
    "skills": "<specific improvement feedback>",
    "education": "<specific improvement feedback>"
  }
}`;

    const userPrompt = `Analyze and optimize this LinkedIn profile${targetRole ? ` for the target role: ${targetRole}` : ''}:

${profileContent}

Provide a complete analysis with extracted sections, scores, optimized content, and specific feedback. Respond ONLY with valid JSON.`;

    console.log('Calling Lovable AI for LinkedIn optimization...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
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
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI analysis failed. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response:', data);
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI response received, parsing...');

    // Parse the JSON response
    let result;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, content);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response', raw: content }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and fix scores
    result.profile_score_before = Math.min(100, Math.max(0, Number(result.profile_score_before) || 40));
    result.profile_score_after = Math.min(100, Math.max(0, Number(result.profile_score_after) || 85));
    result.score_improvement = result.profile_score_after - result.profile_score_before;

    console.log('LinkedIn optimization complete');

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in linkedin-optimizer:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
