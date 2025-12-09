import { STORAGE_KEYS } from "../constants/storageKeys";

export async function postJson<TResponse>(
  url: string,
  body: unknown
): Promise<TResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add Authorization header if token exists
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    // Auth errors: clear and force login
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = "/login";
      }
    }

    throw new Error((data && (data.error || data.message)) || "Request failed");
  }

  return data as TResponse;
}
