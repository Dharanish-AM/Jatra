function parseJsonFromText(text) {
  if (!text) return null;

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;

  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function normalizeActivities(payload) {
  const list = payload?.activities;
  if (!Array.isArray(list)) return [];

  return list
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeExistingActivities(existingActivities) {
  if (!Array.isArray(existingActivities)) return [];
  return existingActivities
    .map((item) => (typeof item === "string" ? item.trim().toLowerCase() : ""))
    .filter(Boolean);
}

const CITY_ACTIVITY_HINTS = {
  agra: [
    "Visit Taj Mahal at sunrise",
    "Explore Agra Fort",
    "Walk through Mehtab Bagh at sunset",
    "Try local petha and street snacks",
    "Shop handicrafts at Sadar Bazaar",
  ],
  varanasi: [
    "Sunrise boat ride on the ghats",
    "Attend evening Ganga Aarti",
    "Explore Kashi Vishwanath corridor",
    "Breakfast at a local kachori shop",
    "Walk old city lanes for culture and photos",
  ],
  chennai: [
    "Morning walk at Marina Beach",
    "Visit Kapaleeshwarar Temple",
    "Explore San Thome area",
    "Try authentic South Indian thali",
    "Evening at Elliot's Beach",
  ],
  pune: [
    "Explore Shaniwar Wada",
    "Breakfast at a local cafe",
    "Visit Aga Khan Palace",
    "Street food trail in FC Road area",
    "Sunset viewpoint near the hills",
  ],
  bhubaneswar: [
    "Visit Lingaraj Temple",
    "Explore Udayagiri and Khandagiri caves",
    "Local Odia lunch experience",
    "Walk around Ekamra Haat",
    "Relaxed evening at a city park",
  ],
  delhi: [
    "Morning visit to India Gate area",
    "Explore Humayun's Tomb",
    "Food walk in Old Delhi",
    "Visit a museum in central Delhi",
    "Sunset at Lodhi Garden",
  ],
};

function getFallbackActivities({ city, routeHint, existingActivities }) {
  const normalizedExisting = new Set(normalizeExistingActivities(existingActivities));
  const cityKey = String(city || routeHint?.to || "").trim().toLowerCase();
  const base = CITY_ACTIVITY_HINTS[cityKey] ?? [
    "City center orientation walk",
    "Local food tasting session",
    "Visit a popular landmark",
    "Relaxed market exploration",
    "Sunset viewpoint stop",
  ];

  return base
    .filter((item) => !normalizedExisting.has(item.toLowerCase()))
    .slice(0, 5);
}

function parseAIPickTag(text) {
  const pickMatch = text.match(/\[AI_PICK:\s*([^\]]+)\]/i);
  if (!pickMatch) return { pickedRouteId: null, cleanText: text.trim() };
  return {
    pickedRouteId: pickMatch[1].trim(),
    cleanText: text.replace(/\[AI_PICK:\s*([^\]]+)\]/gi, "").trim(),
  };
}

async function callGroq({ apiKey, model = "llama-3.3-70b-versatile", messages, maxTokens = 800 }) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`Groq API Error: ${response.status}`);
    error.statusCode = 502;
    error.meta = errorText;
    throw error;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

function buildTravelPrompt({ searchParams, routes, hotels, message }) {
  return [
    {
      role: "system",
      content: `You are Jatra AI, an Indian travel planning assistant.

Rules:
- Be practical, concise, and user-friendly.
- Use INR values where possible.
- When recommending a route, append [AI_PICK: routeId].
- Keep response under 180 words.

Trip context:
${JSON.stringify({ searchParams, routes, hotels })}`,
    },
    {
      role: "user",
      content: message,
    },
  ];
}

function buildActivityPrompt({ city, day, date, tripNotes, existingActivities, routeHint }) {
  return [
    {
      role: "system",
      content: `You suggest day plans for Indian travelers.
Return JSON only in this shape:
{"activities": ["activity 1", "activity 2", "activity 3", "activity 4", "activity 5"]}

Constraints:
- 4 to 6 short activities
- city-specific and realistic
- mix sightseeing, food, and practical pacing
- no markdown, no explanation outside JSON`,
    },
    {
      role: "user",
      content: JSON.stringify({
        city,
        day,
        date,
        tripNotes,
        routeHint,
        existingActivities,
      }),
    },
  ];
}

export async function getTravelRecommendationFromGroq({ apiKey, message, searchParams, routes, hotels }) {
  const text = await callGroq({
    apiKey,
    messages: buildTravelPrompt({ searchParams, routes, hotels, message }),
  });
  const parsed = parseAIPickTag(text);
  return {
    answer: parsed.cleanText,
    pickedRouteId: parsed.pickedRouteId,
  };
}

export async function getActivitySuggestionsFromGroq({
  apiKey,
  city,
  day,
  date,
  tripNotes,
  existingActivities,
  routeHint,
}) {
  const text = await callGroq({
    apiKey,
    messages: buildActivityPrompt({ city, day, date, tripNotes, existingActivities, routeHint }),
    maxTokens: 500,
  });

  const parsed = parseJsonFromText(text);
  const normalizedExisting = new Set(normalizeExistingActivities(existingActivities));
  let activities = normalizeActivities(parsed).filter(
    (item) => !normalizedExisting.has(item.toLowerCase()),
  );

  if (activities.length === 0) {
    activities = getFallbackActivities({ city, routeHint, existingActivities });
  }

  return { activities };
}
