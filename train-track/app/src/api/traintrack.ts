// src/api/traintrack.ts
import { postJson } from "./http";

type LoginResponse = {
  success: boolean;
  token?: string;
  userData?: { id: number; email: string; fullname: string };
  error?: string;
  message?: string;
};

export async function askCoach(message: string) {
  return postJson<{ reply?: string; error?: string }>("/api/chat", { message });
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch("https://star-panda-literally.ngrok-free.app/login.php", {
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
