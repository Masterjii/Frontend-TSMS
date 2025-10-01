// src/services/apiClient.ts

export function getAuthToken() {
  return localStorage.getItem('token');
}

export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    throw new Error(await response.text() || 'API request failed');
  }
  return response.json();
}
