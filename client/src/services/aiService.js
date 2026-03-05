function buildSystemPrompt({ searchParams, routes, hotels }) {
  return `You are Jatra AI, an Indian travel planning assistant.
User trip: ${searchParams.from || 'origin'} to ${searchParams.to || 'destination'} on ${searchParams.date || 'date not set'} for ${searchParams.passengers} passengers.

Available routes: ${JSON.stringify(routes)}
Available hotels: ${JSON.stringify(hotels)}

You must provide:
1) cheapest travel strategy
2) best route + hotel combination
3) estimated trip budget range in ₹
4) alternate travel date suggestions near requested date
5) explain why the route is recommended

Always include a route identifier as [AI_PICK: routeId] when recommending a route.
Keep output concise, practical, and under 180 words.`;
}

export function parseAIPickTag(text) {
  const pickMatch = text.match(/\[AI_PICK:\s*([^\]]+)\]/i);
  if (!pickMatch) return { pickedRouteId: null, cleanText: text.trim() };
  return {
    pickedRouteId: pickMatch[1].trim(),
    cleanText: text.replace(/\[AI_PICK:\s*([^\]]+)\]/gi, '').trim(),
  };
}

export async function getTravelRecommendation(request) {
  const { apiKey, message, searchParams, routes, hotels } = request;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 800,
      messages: [
        { role: 'system', content: buildSystemPrompt({ searchParams, routes, hotels }) },
        { role: 'user', content: message },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq API Error Details:', errorText);
    let errorMessage = `Groq API Error: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error && errorJson.error.message) {
        errorMessage += ` - ${errorJson.error.message}`;
      }
    } catch {
      // Ignore parse error and keep default errorMessage
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content ?? '';
  const parsed = parseAIPickTag(text);

  return {
    answer: parsed.cleanText,
    pickedRouteId: parsed.pickedRouteId,
  };
}
