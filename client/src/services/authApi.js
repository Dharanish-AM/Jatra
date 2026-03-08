const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function authRequest(path, { headers: extraHeaders, ...rest } = {}) {
  const url = `${API_BASE_URL}/auth${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    ...rest,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? 'Request failed');
  }
  return data.data;
}

export function registerUser(name, email, password) {
  return authRequest('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser(email, password) {
  return authRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe(token) {
  return authRequest('/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
