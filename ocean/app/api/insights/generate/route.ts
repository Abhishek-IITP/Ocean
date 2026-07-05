import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { startOfWeekUTC, toDayKey } from "@/app/lib/dates";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const responseSchema = z.object({
  theme: z.string().describe("A poetic 1-sentence theme for the user's past week (e.g. 'Quiet progress through architectural sprints')"),
  trajectory: z.string().describe("A warm, print-style typographic summary paragraph assessing their focus hours and habits"),
  frictionPoint: z.string().describe("One specific bottleneck, friction spot, or scheduling bottleneck found in their planner or logs"),
  suggestedAdjustment: z.string().describe("A calm, highly actionable tip to adjust their calendar or daily habits for next week"),
  reflectionsSummary: z.string().describe("A summary of emotional and thought trends synthesized from their private journals and notes"),
});

export async function POST() {
  try {
    const session = await requireUser();
    const userId = session.user!.id as string;

    const startOfWeek = startOfWeekUTC();
    const periodKey = `weekly-${toDayKey(startOfWeek)}`;

    // 1. Fetch user data from database (past 7 days)
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);

    // Fetch notes and journals cutoff (past 14 days for broader reflections)
    const reflectionsCutoff = new Date();
    reflectionsCutoff.setDate(reflectionsCutoff.getDate() - 14);

    const [tasks, focus, habits, logs, notes, journals] = await Promise.all([
      prisma.task.findMany({
        where: { userId, createdAt: { gte: cutoff } },
        select: { title: true, status: true, quadrant: true },
      }),
      prisma.focusSession.findMany({
        where: { userId, startedAt: { gte: cutoff } },
        select: { minutes: true, label: true, startedAt: true },
      }),
      prisma.habit.findMany({
        where: { userId, archived: false },
        select: {
          name: true,
          logs: {
            where: { date: { gte: cutoff } },
            select: { date: true },
          },
        },
      }),
      prisma.dailyLog.findMany({
        where: { userId, date: { gte: cutoff } },
        select: { date: true, water: true, mood: true },
      }),
      prisma.note.findMany({
        where: { userId, archived: false, updatedAt: { gte: reflectionsCutoff } },
        select: { title: true, content: true, updatedAt: true },
        take: 15,
      }),
      prisma.journalEntry.findMany({
        where: { userId, date: { gte: reflectionsCutoff } },
        select: { content: true, gratitude: true, date: true, kind: true },
        take: 15,
      }),
    ]);

    // 2. Format reflections content for the context window
    const formattedNotes = notes
      .map(n => `- [Note: ${n.title}] ${n.content}`)
      .join("\n");
      
    const formattedJournals = journals
      .map(j => `- [Journal ${j.kind} - ${j.date.toISOString().slice(0, 10)}] ${j.content} (Grateful: ${j.gratitude || "none"})`)
      .join("\n");

    const reflectionsContext = `
--- User Reflections (Journals) ---
${formattedJournals || "No recent journals recorded."}

--- User Notes ---
${formattedNotes || "No recent notes captured."}
`;

    // 3. Invoke Google Gemini model (Gemini 2.5 Flash as requested) via LangChain with structured output
    let model;
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not defined or is empty in .env.");
      }
      // Note: `@langchain/google-genai` version 2.x uses 'model' instead of 'modelName'.
      // If 'modelName' is passed, it internally crashes trying to run `.replace()` on an undefined model property.
      model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY,
        temperature: 0.2,
      });
    } catch (modelErr: any) {
      console.error("CRITICAL: Failed to construct ChatGoogleGenerativeAI:", modelErr);
      return NextResponse.json(
        { ok: false, error: `Model creation failed: ${modelErr.message}`, details: modelErr.stack },
        { status: 500 }
      );
    }

    const structuredModel = model.withStructuredOutput(responseSchema);

    const habitsSummary = habits.map(h => ({
      name: h.name,
      completionsCount: h.logs.length
    }));

    const prompt = `
You are Ocean's quiet, wise productivity chief-of-staff. Your goal is to review the user's workflow data and reflections from the past week, and compile a calm, beautifully structured, print-editorial review.

Here is the user's data from the past week:
- Completed & Pending Tasks: ${JSON.stringify(tasks)}
- Completed Focus Sessions: ${JSON.stringify(focus)}
- Habit Checklist Completions: ${JSON.stringify(habitsSummary)}
- Daily Logs (Mood & Water tracking): ${JSON.stringify(logs)}

Here is the context of their recent journals and notes:
${reflectionsContext}

Analyze this data and draft a deep, encouraging review. Enforce high-level insights. Avoid raw bulleted lists or dry statements. Ensure the output strictly follows the schema.
`;

    const insight = await structuredModel.invoke(prompt);

    // 4. Save to the database
    const saved = await prisma.aiInsight.upsert({
      where: { userId_periodKey: { userId, periodKey } },
      create: {
        userId,
        periodKey,
        content: JSON.stringify(insight),
      },
      update: {
        content: JSON.stringify(insight),
      },
    });

    return NextResponse.json({ ok: true, data: insight });
  } catch (error: any) {
    console.error("AI Insights generator error:", error);
    return NextResponse.json(
      { ok: false, error: error.message ?? "Generation failed", details: error.stack },
      { status: 500 }
    );
  }
}
