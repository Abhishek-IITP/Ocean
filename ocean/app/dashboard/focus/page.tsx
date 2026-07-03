import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FocusTimer } from "@/components/dashboard/FocusTimer";
import { lastNDaysUTC, startOfDayUTC, startOfWeekUTC, toDayKey } from "@/app/lib/dates";
import { format } from "date-fns";

export default async function FocusPage() {
  const session = await requireUser();
  const userId = session.user!.id as string;

  const week = lastNDaysUTC(7);
  const [sessions, todayAgg, weekAgg] = await Promise.all([
    prisma.focusSession.findMany({
      where: { userId, startedAt: { gte: week[0] } },
      orderBy: { startedAt: "desc" },
    }),
    prisma.focusSession.aggregate({
      where: { userId, startedAt: { gte: startOfDayUTC() } },
      _sum: { minutes: true },
      _count: true,
    }),
    prisma.focusSession.aggregate({
      where: { userId, startedAt: { gte: startOfWeekUTC() } },
      _sum: { minutes: true },
    }),
  ]);

  const perDay = new Map<string, number>();
  for (const s of sessions) {
    const key = toDayKey(startOfDayUTC(s.startedAt));
    perDay.set(key, (perDay.get(key) ?? 0) + s.minutes);
  }
  const bars = week.map((d) => ({
    key: toDayKey(d),
    label: d.toLocaleDateString([], { weekday: "short" }).slice(0, 1),
    minutes: perDay.get(toDayKey(d)) ?? 0,
  }));
  const maxMin = Math.max(60, ...bars.map((b) => b.minutes));

  const todayMin = todayAgg._sum.minutes ?? 0;
  const weekMin = weekAgg._sum.minutes ?? 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Focus"
        description="Quiet, timed sessions of deep work. Every completed session is counted — this is where your focus hours come from."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <FocusTimer minutesToday={todayMin} sessionsToday={todayAgg._count} />

        <div className="space-y-6">
          {/* stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Today", value: `${Math.round(todayMin)}m` },
              { label: "This week", value: `${(weekMin / 60).toFixed(1)}h` },
              { label: "Sessions today", value: `${todayAgg._count}` },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft"
              >
                <div className="font-serif text-2xl font-bold">{s.value}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* weekly bar chart */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
            <h2 className="mb-5 font-serif text-lg font-bold">Last 7 days</h2>
            <div className="flex h-40 items-end justify-between gap-3">
              {bars.map((b) => (
                <div key={b.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-lg bg-sage-deep/80 transition-all duration-700"
                      style={{ height: `${Math.max(4, (b.minutes / maxMin) * 100)}%` }}
                      title={`${b.minutes} min`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* recent sessions */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
            <h2 className="mb-4 font-serif text-lg font-bold">Recent sessions</h2>
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sessions yet. Start the timer and the first one will land here.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {sessions.slice(0, 8).map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span>{s.label || "Focus session"}</span>
                    <span className="text-muted-foreground">
                      {s.minutes}m · {format(s.startedAt, "EEE HH:mm")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
