import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const agendaResponseSchema = z.object({
  contextConnection: z.string().describe("A 1-sentence connection linking this meeting to the user's recent notes/journals (e.g. 'This connects to your notes on database migration from Wednesday')"),
  talkingPoints: z.array(z.string()).describe("Exactly 3 concise talking points or prep questions for the meeting."),
});

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const userId = session.user!.id as string;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ ok: false, error: "AI configuration missing." }, { status: 500 });
    }

    const { title, guestName } = await req.json();
    if (!title) {
      return NextResponse.json({ ok: false, error: "Meeting title is required." }, { status: 400 });
    }

    // Fetch user's recent notes & journals from the past 14 days for context
    const reflectionsCutoff = new Date();
    reflectionsCutoff.setDate(reflectionsCutoff.getDate() - 14);

    const [notes, journals] = await Promise.all([
      prisma.note.findMany({
        where: { userId, archived: false, updatedAt: { gte: reflectionsCutoff } },
        select: { title: true, content: true },
        take: 10,
      }),
      prisma.journalEntry.findMany({
        where: { userId, date: { gte: reflectionsCutoff } },
        select: { content: true, gratitude: true },
        take: 10,
      }),
    ]);

    const formattedNotes = notes.map(n => `- [Note: ${n.title}] ${n.content}`).join("\n");
    const formattedJournals = journals.map(j => `- [Journal] ${j.content}`).join("\n");
    const reflectionsContext = `
--- Recent User Notes ---
${formattedNotes || "No recent notes found."}

--- Recent User Journals ---
${formattedJournals || "No recent journals found."}
`;

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.3,
    });

    const structuredModel = model.withStructuredOutput(agendaResponseSchema);

    const prompt = `
You are Ocean's quiet, wise Chief-of-Staff. 
The user has an upcoming meeting:
- Title: "${title}"
- Guest: "${guestName || "a guest"}"

Here is context from their recent notes and reflections:
${reflectionsContext}

Create a calm, structured meeting prep agenda. Identify one logical connection to their recent notes/journals. Provide exactly 3 concise, high-value talking points or talking prompts. Avoid bullet headers or intro filler.
`;

    const agenda = await structuredModel.invoke(prompt);
    return NextResponse.json({ ok: true, data: agenda });
  } catch (error: any) {
    console.error("AI Meeting prep error:", error);
    return NextResponse.json(
      { ok: false, error: error.message ?? "Prep failed" },
      { status: 500 }
    );
  }
}
