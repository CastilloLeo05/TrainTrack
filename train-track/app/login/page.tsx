// app/login/page.tsx
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
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
        <header className="space-y-1 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-400">
            TrainTrack
          </p>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-xs text-white/60">
            Sign in to access your training dashboard.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-white/80">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="pt-2 text-center text-xs text-white/60">
          New here?{" "}
          <a
            href="/register"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
}
