import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { startOfDayUTC } from "@/app/lib/dates";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function POST() {
  try {
    const session = await requireUser();
    const userId = session.user!.id as string;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API Key not configured on server" },
        { status: 500 }
      );
    }

    const today = startOfDayUTC();
    const [tasks, focus] = await Promise.all([
      prisma.task.findMany({
        where: { userId, createdAt: { gte: today } },
        select: { title: true, status: true },
      }),
      prisma.focusSession.findMany({
        where: { userId, startedAt: { gte: today } },
        select: { minutes: true, label: true },
      }),
    ]);

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.6,
    });

    const promptText = `
You are Ocean's quiet, wise journaling companion.
Today, the user completed the following:
- Tasks: ${JSON.stringify(tasks)}
- Focus Sessions: ${JSON.stringify(focus)}

Write a single, gentle, short reflective journaling prompt (1 to 2 sentences) based on this activity. 
Be encouraging and personal, linking their effort to their state of mind. Keep it simple and calm. Don't say "Here is your prompt" or use formatting. Just return the prompt text directly.
`;

    const response = await model.invoke(promptText);
    const content = response.content.toString().trim();

    return NextResponse.json({ ok: true, prompt: content });
  } catch (err: any) {
    console.error("Failed to generate dynamic prompt:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate dynamic AI prompt" },
      { status: 500 }
    );
  }
}
