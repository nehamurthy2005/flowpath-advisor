import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { message, user_id, context_history } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are Flow Assistant — a friendly, helpful AI career coach and general assistant for students. 
You help with:
1. Career discovery and guidance
2. Study tips and learning plans
3. Resume and LinkedIn advice
4. Coding and technical help
5. General questions (math, science, writing, etc.)

Be concise, actionable, and encouraging. Use simple language. 
If a question relates to career tools, suggest relevant actions.

For career questions, mention these tools when relevant:
- Resume Scanner (/scanner) - for ATS analysis
- Resume Builder (/resume-builder) - to create resumes
- Career Quiz (/career-quiz) - to discover career paths
- LinkedIn Transformer (/linkedin-transformer) - to optimize profiles

Keep responses under 150 words unless detailed explanation is needed.
Format with markdown when helpful (bullet points, bold for emphasis).`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(context_history || []).slice(-4),
      { role: "user", content: message }
    ];

    // Use Lovable AI gateway with lightweight model
    const response = await fetch("https://api.lovable.dev/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantContent = data.choices?.[0]?.message?.content || "I'm here to help! What would you like to know?";

    // Detect relevant actions based on content
    const actions: Array<{type: string; label: string; target: string}> = [];
    const lowerContent = assistantContent.toLowerCase();
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("resume") || lowerContent.includes("resume scanner")) {
      actions.push({ type: "scan_resume", label: "Scan Resume", target: "/scanner" });
    }
    if (lowerMessage.includes("career") || lowerMessage.includes("job") || lowerContent.includes("career quiz")) {
      actions.push({ type: "run_quiz", label: "Take Career Quiz", target: "/career-quiz" });
    }
    if (lowerMessage.includes("linkedin") || lowerContent.includes("linkedin")) {
      actions.push({ type: "optimize_linkedin", label: "Optimize LinkedIn", target: "/linkedin-transformer" });
    }
    if (lowerMessage.includes("build resume") || lowerContent.includes("resume builder")) {
      actions.push({ type: "build_resume", label: "Build Resume", target: "/resume-builder" });
    }

    const result = {
      answer_text: assistantContent,
      categories: detectCategories(message),
      actions: actions.slice(0, 3),
      confidence: 0.85
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('AI Assistant error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        answer_text: "I'm having a moment! Please try again.",
        error: errorMessage 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function detectCategories(message: string): string[] {
  const categories: string[] = [];
  const lower = message.toLowerCase();
  
  if (lower.includes("career") || lower.includes("job") || lower.includes("work")) {
    categories.push("career");
  }
  if (lower.includes("resume") || lower.includes("cv")) {
    categories.push("resume");
  }
  if (lower.includes("code") || lower.includes("programming") || lower.includes("python") || lower.includes("javascript")) {
    categories.push("coding");
  }
  if (lower.includes("study") || lower.includes("learn") || lower.includes("course")) {
    categories.push("education");
  }
  if (lower.includes("math") || lower.includes("solve") || lower.includes("calculate")) {
    categories.push("math");
  }
  
  return categories.length > 0 ? categories : ["general"];
}
