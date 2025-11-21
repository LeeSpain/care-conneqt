import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, memberId, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Map language codes to full language names
    const languageMap: { [key: string]: string } = {
      'en': 'English',
      'es': 'Spanish',
      'nl': 'Dutch'
    };
    const languageName = languageMap[language] || 'English';

    const systemPrompt = `You are the AI Guardian, a compassionate and knowledgeable health companion for Care Conneqt users. Your role is to:

- Provide friendly daily check-ins and emotional support
- Answer health-related questions (but always advise consulting medical professionals for serious concerns)
- Help users understand their health metrics and device readings
- Remind users about medications and appointments (when data is available)
- Offer wellness tips and encouragement
- Escalate urgent concerns to nurses when necessary

Keep responses warm, concise, and easy to understand. Focus on empowering users to manage their health confidently while maintaining safety.

CRITICAL INSTRUCTION: You MUST respond in ${languageName}. The user's interface is in ${languageName}, so ALL your responses, health advice, medication reminders, and wellness tips must be in ${languageName}. Do not use any other language under any circumstances.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
