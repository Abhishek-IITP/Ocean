import prisma from "@/app/lib/db";
import { startOfDayUTC } from "@/app/lib/dates";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Sparkles } from "lucide-react";

async function fetchYesterdayStats(userId: string) {
  const today = startOfDayUTC();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [tasks, focus, log] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId,
        createdAt: { gte: yesterday, lt: today },
      },
      select: { status: true },
    }),
    prisma.focusSession.findMany({
      where: {
        userId,
        startedAt: { gte: yesterday, lt: today },
      },
      select: { minutes: true },
    }),
    prisma.dailyLog.findUnique({
      where: {
        userId_date: { userId, date: yesterday },
      },
      select: { mood: true },
    }),
  ]);

  const tasksDone = tasks.filter((t) => t.status === "DONE").length;
  const totalTasks = tasks.length;
  const focusMin = focus.reduce((acc, s) => acc + s.minutes, 0);

  return {
    tasksDone,
    totalTasks,
    focusMin,
    mood: log?.mood ?? "unknown",
  };
}

export async function IntentSetter({ userId }: { userId: string }) {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const stats = await fetchYesterdayStats(userId);

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.6,
    });

    const prompt = `
You are Ocean's quiet, wise productivity companion.
Yesterday's user activity:
- Focus time: ${stats.focusMin} minutes
- Tasks completed: ${stats.tasksDone}/${stats.totalTasks}
- Mood logged: ${stats.mood}

Write a single, short, grounding advice/thought for the user's morning intent today (maximum 16 words). 
Speak in a warm, print-editorial, poetic observer style. Do not use markdown headers, bullet points, or introductory phrases. Just output the advice sentence directly inside quotation marks.
`;

    const response = await model.invoke(prompt);
    const text = response.content.toString().trim().replace(/"/g, "");

    return (
      <div className="flex items-center gap-1.5 rounded-full bg-sage-deep/5 px-3.5 py-1 text-xs text-sage-deep w-fit animate-fade-in border border-sage-deep/10 select-all">
        <Sparkles className="size-3 shrink-0" />
        <span className="font-serif italic font-medium">
          &ldquo;{text}&rdquo;
        </span>
      </div>
    );
  } catch (error) {
    console.error("Failed to generate intent setter:", error);
    return null;
  }
}
