import { askCoach } from "../api/traintrack";

export async function generateTrainingPlan(
  level: string,
  goal: string
): Promise<string> {
  const res = await askCoach(
    `Create a clear, structured training plan for a ${level} runner targeting a ${goal.toUpperCase()}. Use short headings and bullet points.`
  );

  if (res.reply) return res.reply;
  throw new Error(res.error || "Could not generate plan.");
}
