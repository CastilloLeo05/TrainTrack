// app/register/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://star-panda-literally.ngrok-free.app/register.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "register",
            username,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(data.message || "Account created. Redirecting to login…");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("Could not reach the registration service.");
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
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-xs text-white/60">
            Save your training data and AI plans.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/80">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60"
              placeholder="yourusername"
            />
          </div>

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

          <div className="space-y-1">
            <label className="text-xs font-medium text-white/80">
              Confirm password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-emerald-400" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="pt-2 text-center text-xs text-white/60">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
