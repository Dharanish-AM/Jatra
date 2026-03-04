const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request(path, query = {}) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const payload = await response.json();
  return payload.data ?? [];
}

export function fetchRoutes(query = {}) {
  return request('/routes', query);
}

export function fetchHotels(query = {}) {
  return request('/hotels', query);
}
