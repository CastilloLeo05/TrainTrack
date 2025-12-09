import { STORAGE_KEYS } from "../constants/storageKeys";
import { loginUser } from "../api/traintrack";

export async function signIn(email: string, password: string) {
  const data = await loginUser(email, password);

  if (data.success && typeof window !== "undefined") {
    if (data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    }
    if (data.userData) {
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(data.userData)
      );
    }
  }

  return data;
}

export function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}
