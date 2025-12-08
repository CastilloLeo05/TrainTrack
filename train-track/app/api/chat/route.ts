import { NextResponse } from 'next/server';
import { gemini } from '../../src/lib/gemini';

const SYSTEM_PROMPT = `
You are TrainTrack, an AI running coach.

Always format your answers clearly using markdown:
- Use short section headings like "Overview", "Weekly Plan", "Day-by-day", "Tips".
- Use bullet points or numbered lists instead of big paragraphs.
- For training plans, show each day on its own line, e.g. "Day 1 – Easy run: 20–30 min easy".
- Keep the answer concise (about 8–15 lines) unless the user asks for more detail.
- Do NOT add surrounding backticks or say "Here is your plan"—just output the formatted text.

Give concise, practical advice about running workouts, race prep, pacing, and basic nutrition.
If users ask for medical advice, tell them to consult a professional.
`;

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as { message?: string };

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    const result = await (gemini as any).models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'user', parts: [{ text: message }] }
      ]
    });

    const reply =
      (result as any)?.text ?? '[no text returned from Gemini]';

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('Gemini error:', err);
    return NextResponse.json(
      { error: String(err && err.message ? err.message : err) },
      { status: 500 }
    );
  }
}
