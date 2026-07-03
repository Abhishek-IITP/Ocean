import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { HabitsManager, HabitView } from "@/components/habits/HabitsManager";
import { lastNDaysUTC, toDayKey } from "@/app/lib/dates";

export default async function HabitsPage() {
  const session = await requireUser();
  const userId = session.user!.id as string;

  const window = lastNDaysUTC(60);
  const [habits, logs] = await Promise.all([
    prisma.habit.findMany({
      where: { userId, archived: false },
      orderBy: { order: "asc" },
    }),
    prisma.habitLog.findMany({
      where: { habit: { userId }, date: { gte: window[0] } },
      select: { habitId: true, date: true },
    }),
  ]);

  // habitId -> set of dayKeys
  const done = new Map<string, Set<string>>();
  for (const l of logs) {
    if (!done.has(l.habitId)) done.set(l.habitId, new Set());
    done.get(l.habitId)!.add(toDayKey(l.date));
  }

  const todayKey = toDayKey(window[window.length - 1]);

  const views: HabitView[] = habits.map((h) => {
    const set = done.get(h.id) ?? new Set<string>();
    // streak: consecutive days ending today
    let streak = 0;
    for (let i = window.length - 1; i >= 0; i--) {
      const key = toDayKey(window[i]);
      if (set.has(key)) streak++;
      else if (key !== todayKey) break;
    }
    return { id: h.id, name: h.name, doneDays: Array.from(set), streak };
  });

  const last7 = lastNDaysUTC(7).map((d) => ({
    key: toDayKey(d),
    label: d.toLocaleDateString([], { month: "short", day: "numeric" }),
    weekday: d.toLocaleDateString([], { weekday: "short" }).slice(0, 2),
    isToday: toDayKey(d) === todayKey,
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="Habits"
        description="Keep the small things going. Tap a day to mark it done — your streaks are real and remembered."
      />
      <HabitsManager habits={views} days={last7} />
    </div>
  );
}
