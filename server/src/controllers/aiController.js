import {
  getTravelRecommendationFromGroq,
  getActivitySuggestionsFromGroq,
} from "../services/groqService.js";

function ensureGroqKey() {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    const error = new Error("GROQ_API_KEY is missing on server.");
    error.statusCode = 500;
    throw error;
  }
  return key;
}

export async function getTravelRecommendation(req, res, next) {
  try {
    const { message, searchParams, routes, hotels } = req.body ?? {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, message: "message is required" });
    }

    const apiKey = ensureGroqKey();
    const result = await getTravelRecommendationFromGroq({
      apiKey,
      message,
      searchParams: searchParams ?? {},
      routes: Array.isArray(routes) ? routes : [],
      hotels: Array.isArray(hotels) ? hotels : [],
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getActivitySuggestions(req, res, next) {
  try {
    const { city, day, date, tripNotes, existingActivities, routeHint } = req.body ?? {};

    if (!city || typeof city !== "string") {
      return res.status(400).json({ success: false, message: "city is required" });
    }

    const apiKey = ensureGroqKey();
    const result = await getActivitySuggestionsFromGroq({
      apiKey,
      city,
      day: Number.isFinite(day) ? day : 1,
      date: date ?? null,
      tripNotes: typeof tripNotes === "string" ? tripNotes : "",
      existingActivities: Array.isArray(existingActivities) ? existingActivities : [],
      routeHint: routeHint ?? null,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
