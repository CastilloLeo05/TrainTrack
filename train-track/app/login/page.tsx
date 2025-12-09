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
        // ensure values are in localStorage (in case you skip it in service)
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

        router.push("/"); // go to dashboard
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
    <main className="flex min-h-screen items-center justify-center bg-background text-text">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md">
        <h1 className="mb-1 text-xl font-extrabold tracking-tight">
          TrainTrack
        </h1>
        <p className="mb-6 text-xs text-text/70">
          Sign in to access your training dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-background/80 px-3 py-2 text-sm text-text placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/60"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text/80">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-background/80 px-3 py-2 text-sm text-text placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/60"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-secondary disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-text/70">
          New here?{" "}
          <a
            href="/register"
            className="font-medium text-secondary hover:underline"
          >
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
}
