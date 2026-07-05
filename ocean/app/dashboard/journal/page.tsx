import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  JournalEditor,
  JournalEntryView,
} from "@/components/journal/JournalEditor";
import { startOfDayUTC, startOfWeekUTC, startOfMonthUTC } from "@/app/lib/dates";
import { format } from "date-fns";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function generateDailyPrompt(userId: string) {
  try {
    if (!process.env.GEMINI_API_KEY) return null;

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

    if (tasks.length === 0 && focus.length === 0) {
      return null; // Fallback to default subtext
    }

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
    return response.content.toString().trim();
  } catch (err) {
    console.error("Failed to generate dynamic prompt:", err);
    return null;
  }
}

export default async function JournalPage() {
  const session = await requireUser();
  const userId = session.user!.id as string;

  const [daily, weekly, monthly, recent, dynamicDailyPrompt] = await Promise.all([
    prisma.journalEntry.findUnique({
      where: { userId_kind_date: { userId, kind: "DAILY", date: startOfDayUTC() } },
    }),
    prisma.journalEntry.findUnique({
      where: { userId_kind_date: { userId, kind: "WEEKLY", date: startOfWeekUTC() } },
    }),
    prisma.journalEntry.findUnique({
      where: { userId_kind_date: { userId, kind: "MONTHLY", date: startOfMonthUTC() } },
    }),
    prisma.journalEntry.findMany({
      where: { userId, kind: "DAILY" },
      orderBy: { date: "desc" },
      take: 12,
    }),
    generateDailyPrompt(userId),
  ]);

  const toView = (e: typeof daily): JournalEntryView | null =>
    e ? { content: e.content, gratitude: e.gratitude, mood: e.mood } : null;

  return (
    <div className="mx-auto max-w-5xl animate-rise">
      <PageHeader
        title="Journal"
        description="Close the day, week or month with a short, honest reflection."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_240px]">
        {/* Editor */}
        <JournalEditor
          entries={{
            DAILY: toView(daily),
            WEEKLY: toView(weekly),
            MONTHLY: toView(monthly),
          }}
          dynamicDailyPrompt={dynamicDailyPrompt || undefined}
        />

        {/* Recent entries aside */}
        <aside>
          <h2 className="mb-4 font-serif text-lg font-bold">Past entries</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Past reflections will appear here.
            </p>
          ) : (
            <div className="space-y-2">
              {recent.map((e) => (
                <div
                  key={e.id}
                  className="rounded-xl border border-border/50 bg-card px-4 py-3"
                >
                  <div className="text-xs font-bold text-sage-deep/80">
                    {format(e.date, "EEE, d MMM")}
                  </div>
                  <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {stripHtml(e.content) || (
                      <span className="italic opacity-50">No content</span>
                    )}
                  </p>
                  {e.gratitude && (
                    <p className="mt-2 text-[10px] text-muted-foreground/60 italic">
                      ✦ {e.gratitude}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
