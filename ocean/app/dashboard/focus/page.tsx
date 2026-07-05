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
    label: d.toLocaleDateString([], { weekday: "short" }).slice(0, 2),
    fullLabel: d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" }),
    minutes: perDay.get(toDayKey(d)) ?? 0,
  }));
  const maxMin = Math.max(60, ...bars.map((b) => b.minutes));

  const todayMin = todayAgg._sum.minutes ?? 0;
  const weekMin = weekAgg._sum.minutes ?? 0;

  return (
    <div className="mx-auto max-w-5xl animate-rise">
      <PageHeader
        title="Focus"
        description="Quiet, timed sessions of deep work. Every completed session is counted here."
      />

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Left: big timer */}
        <div className="space-y-4">
          <FocusTimer minutesToday={todayMin} sessionsToday={todayAgg._count} />

          {/* Inline stats — typographic, not cards */}
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/30">
            {[
              { label: "Today", value: `${Math.round(todayMin)}m` },
              { label: "This week", value: `${(weekMin / 60).toFixed(1)}h` },
              { label: "Sessions", value: `${todayAgg._count}` },
            ].map((s) => (
              <div key={s.label} className="bg-card px-4 py-4 text-center">
                <div className="font-serif text-2xl font-bold">{s.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: chart + history */}
        <div className="space-y-6">
          {/* Weekly bar chart */}
          <div className="rounded-2xl border border-border/50 bg-card px-6 py-5 shadow-soft">
            <h2 className="mb-6 font-serif text-lg font-bold">Last 7 days</h2>
            <div className="flex h-36 items-end gap-2">
              {bars.map((b, i) => {
                const heightPct = Math.max(4, (b.minutes / maxMin) * 100);
                const isToday = i === bars.length - 1;
                return (
                  <div
                    key={b.key}
                    className="group flex flex-1 flex-col items-center gap-2"
                    title={`${b.fullLabel}: ${b.minutes} min`}
                  >
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 cursor-default group-hover:opacity-80`}
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: isToday
                            ? "hsl(var(--sage-deep))"
                            : "hsl(var(--sage-deep) / 0.4)",
                        }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        isToday ? "text-sage-deep" : "text-muted-foreground/70"
                      }`}
                    >
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent sessions */}
          <div className="rounded-2xl border border-border/50 bg-card shadow-soft">
            <div className="border-b border-border/40 px-6 py-4">
              <h2 className="font-serif text-lg font-bold">Recent sessions</h2>
            </div>
            {sessions.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No sessions yet. Start the timer — the first one lands here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border/40">
                {sessions.slice(0, 10).map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between px-6 py-3.5"
                  >
                    <span className="text-sm font-medium">
                      {s.label || "Focus session"}
                    </span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{s.minutes}m</span>
                      <span>{format(s.startedAt, "EEE, HH:mm")}</span>
                    </div>
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
