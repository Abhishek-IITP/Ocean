import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  JournalEditor,
  JournalEntryView,
} from "@/components/journal/JournalEditor";
import { startOfDayUTC, startOfWeekUTC, startOfMonthUTC } from "@/app/lib/dates";
import { format } from "date-fns";

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const CALM_PROMPTS = [
  "How did your energy ebb and flow today? When did you feel most in sync with your work?",
  "What is one quiet victory you achieved today that no one else witnessed?",
  "Did you encounter any moments of friction today? How did you respond to them?",
  "If today had a color or a climate, what would it be and why?",
  "What was the most peaceful moment of your day today?",
  "Is there a thought or a task that you carried through the day that you're ready to put down now?",
  "Whom did you connect with today? What did that interaction teach you?",
  "What is something you learned today—about your work, or about yourself?",
  "How did you care for your focus today? What distractions did you gently slide past?",
  "Look back at your calendar today. Which block of time felt most meaningful?",
  "What was a small detail today—a sound, a light, a phrase—that brought you a moment of clarity?",
  "How did your body feel during your focus sessions today? Did you breathe deeply?",
  "What is one thing you can forgive yourself for from today?",
  "What did you make space for today that you've been putting off?",
  "If you could summarize today in three calm verbs, what would they be?",
  "What habit felt easiest to maintain today? Which one required a bit of quiet resolve?",
  "What are you looking forward to letting go of when your head hits the pillow tonight?",
  "What is a task you decided not to do today, and how did that decision make you feel?",
  "What was a moment today where you felt completely present?",
  "What is one promise you want to keep to yourself tomorrow?"
];

async function generateDailyPrompt(userId: string) {
  try {
    const today = startOfDayUTC();
    const [tasks, focus] = await Promise.all([
      prisma.task.findMany({
        where: { userId, createdAt: { gte: today } },
        select: { status: true },
      }),
      prisma.focusSession.findMany({
        where: { userId, startedAt: { gte: today } },
        select: { minutes: true },
      }),
    ]);

    const totalFocus = focus.reduce((acc, s) => acc + s.minutes, 0);

    // If focus session took place, select focus prompt
    if (totalFocus > 0) {
      const focusPrompts = [
        "You dedicated time to quiet focus today. How does your mind feel after this immersion?",
        "After today's deep work focus, is there any concept or thought you are ready to rest now?",
        "Focus is a form of active meditation. What did you notice about your attention today?"
      ];
      return focusPrompts[new Date().getDate() % focusPrompts.length];
    }

    // If tasks were checked, select task prompt
    if (tasks.length > 0) {
      const taskPrompts = [
        "You completed tasks on your planner today. Did those efforts bring you closer to what matters?",
        "A productive list is finished. What are you most proud of letting go of today?",
        "As you check off your tasks, what is one promise you want to carry into tomorrow?"
      ];
      return taskPrompts[new Date().getDate() % taskPrompts.length];
    }

    // Fallback random zen prompts
    const dayIndex = new Date().getDate() % CALM_PROMPTS.length;
    return CALM_PROMPTS[dayIndex];
  } catch (err) {
    console.error("Failed to generate local daily prompt:", err);
    return CALM_PROMPTS[0];
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
