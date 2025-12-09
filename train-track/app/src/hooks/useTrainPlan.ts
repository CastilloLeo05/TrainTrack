'use client';

import { useState } from 'react';
import { askCoach } from '../api/traintrack';

export function useTrainPlan() {
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generatePlan(level: string, goal: string) {
    setLoading(true);
    setPlan('Generating training plan…');
    try {
      const res = await askCoach(
        `Create a structured training plan for a ${level} runner targeting a ${goal.toUpperCase()}.`
      );
      if (res.reply) setPlan(res.reply);
      else setPlan(res.error || 'Could not generate plan.');
    } finally {
      setLoading(false);
    }
  }

  return { plan, loading, generatePlan };
}
