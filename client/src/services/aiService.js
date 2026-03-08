const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function postAI(path, body) {
  const token = localStorage.getItem('jatra_token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/ai${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.message ?? `AI request failed: ${response.status}`);
  }

  return payload?.data;
}

export async function getTravelRecommendation({ message, searchParams, routes, hotels }) {
  return postAI('/recommend', {
    message,
    searchParams,
    routes,
    hotels,
  });
}

export async function getActivitySuggestions({ city, day, date, tripNotes, existingActivities, routeHint }) {
  return postAI('/activities', {
    city,
    day,
    date,
    tripNotes,
    existingActivities,
    routeHint,
  });
}
