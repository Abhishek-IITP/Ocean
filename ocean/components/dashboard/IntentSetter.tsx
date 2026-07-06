import prisma from "@/app/lib/db";
import { startOfDayUTC } from "@/app/lib/dates";
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

const DEEP_FOCUS_GUIDELINES = [
  "Deep focus is a quiet muscle. Protect your silent morning hours today.",
  "Yesterday's momentum belongs to the past. Approach today with a clean, slow mind.",
  "A strong focus rhythm yesterday. Remember to breathe, pause, and stretch today.",
  "You protect your focus with quiet strength. Keep the shoreline clean today."
];

const LOW_FOCUS_GUIDELINES = [
  "The tide recedes, then returns. Start today with a single, gentle 15-minute session.",
  "A quiet day behind you. Today, choose one small thing and do it with complete care.",
  "Every morning is a clean shoreline. No guilt, just a new opportunity.",
  "Start slowly, step lightly. One single page is a victory."
];

const COMPLETED_BOARD_GUIDELINES = [
  "A clear board is a peaceful space. Protect this lightness today.",
  "All paths completed yesterday. Today, choose your steps with deliberate slowness.",
  "Simplify and center. A fresh page welcomes your focused energy."
];

const DEFAULT_ZEN_GUIDELINES = [
  "Breathe slowly, plan gently, and focus only on what lies right in front of you.",
  "The ocean is patient. Let your work unfold at its own natural pace.",
  "Quiet consistency carries you further than any frantic sprint.",
  "Choose clarity over speed. One deliberate task is worth a dozen rushed ones.",
  "Protect your attention today. It is the most sacred space you own.",
  "Do less, but do it with your whole heart.",
  "Simplify your agenda until only the essential remains.",
  "Great work is built of small, quiet moments of presence."
];

export async function IntentSetter({ userId }: { userId: string }) {
  try {
    const stats = await fetchYesterdayStats(userId);
    let text = "";

    // Generate local rule-based context-sensitive advice
    const daySeed = new Date().getDate();

    if (stats.focusMin >= 45) {
      const idx = daySeed % DEEP_FOCUS_GUIDELINES.length;
      text = DEEP_FOCUS_GUIDELINES[idx];
    } else if (stats.focusMin === 0) {
      const idx = daySeed % LOW_FOCUS_GUIDELINES.length;
      text = LOW_FOCUS_GUIDELINES[idx];
    } else if (stats.totalTasks > 0 && stats.tasksDone === stats.totalTasks) {
      const idx = daySeed % COMPLETED_BOARD_GUIDELINES.length;
      text = COMPLETED_BOARD_GUIDELINES[idx];
    } else {
      const idx = daySeed % DEFAULT_ZEN_GUIDELINES.length;
      text = DEFAULT_ZEN_GUIDELINES[idx];
    }

    return (
      <div className="flex items-center gap-1.5 rounded-full bg-sage-deep/5 px-3.5 py-1 text-xs text-sage-deep w-fit animate-fade-in border border-sage-deep/10 select-all">
        <Sparkles className="size-3 shrink-0" />
        <span className="font-serif italic font-medium">
          &ldquo;{text}&rdquo;
        </span>
      </div>
    );
  } catch (error) {
    console.error("Failed to generate local intent setter:", error);
    // Safe hardcoded fallback text
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-sage-deep/5 px-3.5 py-1 text-xs text-sage-deep w-fit animate-fade-in border border-sage-deep/10 select-all">
        <Sparkles className="size-3 shrink-0" />
        <span className="font-serif italic font-medium">
          &ldquo;Breathe slowly, plan gently, and focus only on what lies right in front of you.&rdquo;
        </span>
      </div>
    );
  }
}
