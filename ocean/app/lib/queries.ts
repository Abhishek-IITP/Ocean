import prisma from "./db";
import {
  startOfDayUTC,
  startOfWeekUTC,
  startOfMonthUTC,
  lastNDaysUTC,
  toDayKey,
} from "./dates";

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

/**
 * One aggregated read for the Today dashboard. Kept to a small set of indexed
 * queries so the home screen stays fast.
 */
export async function getDashboardData(userId: string) {
  const todayStart = startOfDayUTC();
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);
  const weekStart = startOfWeekUTC();
  const monthStart = startOfMonthUTC();
  const now = new Date();
  const recentDays = lastNDaysUTC(14);

  const [
    user,
    todaysTasks,
    habits,
    habitLogs,
    dailyLog,
    goals,
    focusToday,
    focusWeek,
    recentNotes,
    upcomingBookings,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, userName: true, image: true },
    }),
    prisma.task.findMany({
      where: {
        userId,
        OR: [
          { blockStart: { gte: todayStart, lt: tomorrowStart } },
          { dueDate: { gte: todayStart, lt: tomorrowStart } },
          { status: { not: "DONE" }, blockStart: null, dueDate: null },
        ],
      },
      orderBy: [{ blockStart: "asc" }, { createdAt: "asc" }],
      take: 12,
    }),
    prisma.habit.findMany({
      where: { userId, archived: false },
      orderBy: { order: "asc" },
    }),
    prisma.habitLog.findMany({
      where: {
        habit: { userId },
        date: { gte: recentDays[0] },
      },
      select: { habitId: true, date: true },
    }),
    prisma.dailyLog.findUnique({
      where: { userId_date: { userId, date: todayStart } },
    }),
    prisma.goal.findMany({
      where: {
        userId,
        OR: [
          { period: "WEEKLY", periodKey: weekStart },
          { period: "MONTHLY", periodKey: monthStart },
        ],
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.focusSession.aggregate({
      where: { userId, startedAt: { gte: todayStart } },
      _sum: { minutes: true },
      _count: true,
    }),
    prisma.focusSession.aggregate({
      where: { userId, startedAt: { gte: weekStart } },
      _sum: { minutes: true },
    }),
    prisma.note.findMany({
      where: { userId, archived: false },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      take: 4,
    }),
    prisma.booking.findMany({
      where: { userId, startTime: { gte: now }, status: "CONFIRMED" },
      orderBy: { startTime: "asc" },
      take: 4,
      include: { EventType: { select: { title: true } } },
    }),
  ]);

  // ── derived: habit completion today + streak ──
  const todayKey = toDayKey(todayStart);
  const logsByDay = new Map<string, Set<string>>();
  for (const log of habitLogs) {
    const key = toDayKey(log.date);
    if (!logsByDay.has(key)) logsByDay.set(key, new Set());
    logsByDay.get(key)!.add(log.habitId);
  }
  const habitsDoneToday = logsByDay.get(todayKey)?.size ?? 0;
  const habitIdsDoneToday = logsByDay.get(todayKey) ?? new Set<string>();

  // consecutive days (ending today) with at least one habit logged
  let streak = 0;
  for (let i = recentDays.length - 1; i >= 0; i--) {
    const key = toDayKey(recentDays[i]);
    if ((logsByDay.get(key)?.size ?? 0) > 0) streak++;
    else if (key !== todayKey) break; // today with 0 doesn't break a prior streak
    else continue;
  }

  const focusMinutesToday = focusToday._sum.minutes ?? 0;
  const focusMinutesWeek = focusWeek._sum.minutes ?? 0;

  const tasksDone = todaysTasks.filter((t) => t.status === "DONE").length;
  const tasksPlanned = todaysTasks.length;

  // ── productivity score (0–100): average of the categories that exist today ──
  const parts: number[] = [];
  if (tasksPlanned > 0) parts.push((tasksDone / tasksPlanned) * 100);
  if (habits.length > 0) parts.push((habitsDoneToday / habits.length) * 100);
  parts.push(Math.min(focusMinutesToday / 120, 1) * 100); // 2h deep work = full
  const productivityScore = Math.round(
    parts.reduce((a, b) => a + b, 0) / parts.length
  );

  return {
    user,
    todaysTasks,
    habits,
    habitIdsDoneToday: Array.from(habitIdsDoneToday),
    habitsDoneToday,
    streak,
    dailyLog,
    goals,
    recentNotes,
    upcomingBookings,
    stats: {
      tasksDone,
      tasksPlanned,
      focusMinutesToday,
      focusMinutesWeek,
      focusSessionsToday: focusToday._count,
      habitsDoneToday,
      habitsTotal: habits.length,
      productivityScore,
    },
  };
}
