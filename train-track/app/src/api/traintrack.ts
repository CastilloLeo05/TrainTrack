// src/api/traintrack.ts
import { STORAGE_KEYS } from "../constants/storageKeys";
import { postJson } from "./http";

export async function askCoach(message: string) {
  return postJson<{ reply?: string; error?: string }>("/api/chat", { message });
}

type LoginResponse = {
  success: boolean;
  token?: string;
  userData?: { id: number; email: string; fullname: string };
  error?: string;
  message?: string;
};

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch("http://localhost:8001/login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      action: "login",
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Login failed");
  }

  return data as LoginResponse;
}

// Add authentication helper function
export function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.TOKEN)
      : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}
