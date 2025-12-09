"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../src/api/traintrack";
import { STORAGE_KEYS } from "../src/constants/storageKeys";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);

      if (data.success) {
        if (typeof window !== "undefined") {
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
        router.push("/");
      } else {
        setError(data.error || data.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "Could not reach the login service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07101d] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          TrainTrack
        </h1>
        <p className="mb-6 text-center text-sm text-white/60">
          Sign in to access your training dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/80">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && <p className="text-xs text-red-400">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-white/60">
          New here?{" "}
          <a href="/register" className="font-medium text-blue-400 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
}
