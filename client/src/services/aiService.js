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
    cleanText: text.replace(/\[AI_PICK:\s*([^\]]+)\]/i, '').trim(),
  };
}

export async function getTravelRecommendation(request) {
  const { apiKey, message, searchParams, routes, hotels } = request;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerously-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 420,
      system: buildSystemPrompt({ searchParams, routes, hotels }),
      messages: [{ role: 'user', content: message }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API Error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text ?? '';
  const parsed = parseAIPickTag(text);

  return {
    answer: parsed.cleanText,
    pickedRouteId: parsed.pickedRouteId,
  };
}
