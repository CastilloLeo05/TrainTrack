'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { askCoach } from '../src/api/traintrack';
import { STORAGE_KEYS } from '../src/constants/storageKeys';

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
type Goal = '5k' | '10k' | 'half' | 'marathon';

export default function HomePage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('beginner');
  const [goal, setGoal] = useState<Goal>('5k');
  const [planMessage, setPlanMessage] = useState<string | null>(null);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const [username, setUsername] = useState<string | null>(null);

  // auth guard + load username
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (raw) {
        const user = JSON.parse(raw) as { fullname?: string; username?: string };
        setUsername(user.fullname || user.username || null);
      }
    } catch {
      setUsername(null);
    } finally {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) return null;

  async function handleGeneratePlan(e: FormEvent) {
    e.preventDefault();
    setPlanMessage('Generating training plan…');

    try {
      const res = await askCoach(
        `Create a clear, structured training plan for a ${fitnessLevel} runner targeting a ${goal.toUpperCase()}. Use short headings and bullet points.`
      );
      if (res.reply) {
        setPlanMessage(res.reply);
      } else {
        setPlanMessage(res.error || 'Could not generate plan.');
      }
    } catch (err: any) {
      setPlanMessage(err.message || 'Could not generate plan.');
    }
  }

  async function handleChatSubmit(e: FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const question = chatInput.trim();

    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question })
      });

      const data = await res.json();
      if (data.reply) {
        setChatMessages(prev => [
          ...prev,
          `You: ${question}`,
          `Coach: ${data.reply}`
        ]);
      } else if (data.error) {
        setChatMessages(prev => [
          ...prev,
          `You: ${question}`,
          `Coach: [error] ${data.error}`
        ]);
      }
    } catch {
      setChatMessages(prev => [
        ...prev,
        `You: ${question}`,
        'Coach: [error] Could not reach the AI coach.'
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div id="dashboard" className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {username ? `Hello, ${username}` : 'Hello, runner'}
        </h1>
        <p className="max-w-xl text-sm text-slate-300">
          TrainTrack – AI-Powered Running Assistant. Enter your running profile
          and event goal. TrainTrack will build a progressive plan, predict race
          times, and let you chat with an AI coach.
        </p>
      </section>

      <section id="events" className="grid gap-6 md:grid-cols-[2fr,3fr]">
        <form
          onSubmit={handleGeneratePlan}
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
        >
          <h2 className="text-sm font-semibold text-slate-100">
            Your running profile
          </h2>
          <div className="space-y-3 text-sm">
            <label className="block space-y-1">
              <span className="text-slate-300">Fitness level</span>
              <select
                value={fitnessLevel}
                onChange={e =>
                  setFitnessLevel(e.target.value as FitnessLevel)
                }
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-slate-300">Goal event</span>
              <select
                value={goal}
                onChange={e => setGoal(e.target.value as Goal)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
              >
                <option value="5k">5K</option>
                <option value="10k">10K</option>
                <option value="half">Half marathon</option>
                <option value="marathon">Marathon</option>
              </select>
            </label>

            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Generate training plan
            </button>

            {planMessage && (
              <p className="mt-2 text-xs text-slate-300 whitespace-pre-wrap">
                {planMessage}
              </p>
            )}
          </div>
        </form>

        <section
          id="coach"
          className="flex h-64 flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            AI Coach (Gemini)
          </p>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1 text-sm">
            {chatMessages.length === 0 && (
              <p className="text-slate-400">
                Ask anything about training. For example: “Build me an 8‑week
                10K plan for an intermediate runner.”
              </p>
            )}
            {chatMessages.map((m, i) => (
              <div
                key={i}
                className="rounded-md bg-slate-800 px-3 py-2 text-xs sm:text-sm"
              >
                {m}
              </div>
            ))}
            {chatLoading && (
              <p className="text-xs text-slate-500">Coach is thinking…</p>
            )}
          </div>

          <form className="mt-3 flex gap-2" onSubmit={handleChatSubmit}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 sm:text-sm"
              placeholder="Ask the coach about your training…"
            />
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-50"
              disabled={chatLoading}
            >
              Send
            </button>
          </form>
        </section>
      </section>
    </div>
  );
}
