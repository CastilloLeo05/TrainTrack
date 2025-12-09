// app/page.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { askCoach } from "./src/api/traintrack";
import { STORAGE_KEYS } from "./src/constants/storageKeys";

type FitnessLevel = "beginner" | "intermediate" | "advanced";
type Goal = "5k" | "10k" | "half" | "marathon";

export default function DashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>("beginner");
  const [goal, setGoal] = useState<Goal>("5k");
  const [planMessage, setPlanMessage] = useState<string | null>(null);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (raw) {
        const user = JSON.parse(raw) as {
          fullname?: string;
          username?: string;
        };
        setUsername(user.fullname || user.username || null);
      }
    } catch {
      setUsername(null);
    } finally {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) return null;

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    router.replace("/login");
  }

  async function handleGeneratePlan(e: FormEvent) {
    e.preventDefault();
    setPlanMessage("Generating training plan…");

    try {
      const res = await askCoach(
        `Create a clear, structured training plan for a ${fitnessLevel} runner targeting a ${goal.toUpperCase()}. Use short headings and bullet points.`
      );
      if (res.reply) {
        setPlanMessage(res.reply);
      } else {
        setPlanMessage(res.error || "Could not generate plan.");
      }
    } catch (err: any) {
      setPlanMessage(err.message || "Could not generate plan.");
    }
  }

  async function handleChatSubmit(e: FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const question = chatInput.trim();

    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();
      if (data.reply) {
        setChatMessages((prev) => [
          ...prev,
          `You: ${question}`,
          `Coach: ${data.reply}`,
        ]);
      } else if (data.error) {
        setChatMessages((prev) => [
          ...prev,
          `You: ${question}`,
          `Coach: [error] ${data.error}`,
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        `You: ${question}`,
        "Coach: [error] Could not reach the AI coach.",
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-6 md:py-10">
      <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-400">
            Dashboard
          </p>
          <h1 className="text-2xl font-semibold">
            {username ? `Welcome back, ${username}` : "Welcome back"}
          </h1>
          <p className="max-w-xl text-sm text-white/70">
            TrainTrack builds progressive running plans and lets you chat with
            an AI coach about training, pacing, and race strategy.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="h-9 rounded-full border border-white/20 px-4 text-xs font-medium text-white/80 transition hover:border-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr,1.8fr]">
        <form
          onSubmit={handleGeneratePlan}
          className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm shadow-lg backdrop-blur-md"
        >
          <h2 className="text-sm font-semibold text-white">Training profile</h2>
          <p className="text-xs text-white/60">
            Choose your current level and goal distance to get a structured
            plan.
          </p>

          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-xs text-white/80">Fitness level</span>
              <select
                value={fitnessLevel}
                onChange={(e) =>
                  setFitnessLevel(e.target.value as FitnessLevel)
                }
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-xs text-white/80">Goal event</span>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60"
              >
                <option value="5k">5K</option>
                <option value="10k">10K</option>
                <option value="half">Half marathon</option>
                <option value="marathon">Marathon</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
          >
            Generate training plan
          </button>

          {planMessage && (
            <div className="mt-3 max-h-52 overflow-y-auto rounded-lg bg-black/30 p-3 text-xs text-white/80">
              {planMessage}
            </div>
          )}
        </form>

        <section className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 text-sm shadow-lg backdrop-blur-md">
          <header className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">AI Coach</h2>
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/50">
              Powered by Gemini
            </span>
          </header>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1 text-sm">
            {chatMessages.length === 0 && (
              <p className="text-xs text-white/60">
                Ask the coach anything about training. For example: “Build me an
                8‑week 10K plan for an intermediate runner.”
              </p>
            )}
            {chatMessages.map((m, i) => (
              <div
                key={i}
                className="rounded-lg bg-black/40 px-3 py-2 text-xs text-white/90"
              >
                {m}
              </div>
            ))}
            {chatLoading && (
              <p className="text-xs text-white/50">Coach is thinking…</p>
            )}
          </div>

          <form
            className="mt-3 flex flex-col gap-2 sm:flex-row"
            onSubmit={handleChatSubmit}
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60 sm:text-sm"
              placeholder="Ask the coach about your training…"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
