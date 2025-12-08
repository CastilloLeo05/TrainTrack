'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  if (password !== confirm) {
    setError('Passwords do not match.');
    return;
  }

  setLoading(true);
  try {
    const res = await fetch('http://localhost:8001/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        email,
        password
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setSuccess(data.message || 'Account created. Redirecting to login…');
      setTimeout(() => router.push('/login'), 1200);
    } else {
      setError(data.message || 'Registration failed.');
    }
  } catch {
    setError('Could not reach the registration service.');
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
          Create an account to save your training data.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-background/80 px-3 py-2 text-sm text-text placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/60"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text/80">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-background/80 px-3 py-2 text-sm text-text placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/60"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text/80">
              Confirm password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-background/80 px-3 py-2 text-sm text-text placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/60"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          {success && (
            <p className="text-xs text-emerald-400">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-secondary disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-text/70">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-medium text-secondary hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
