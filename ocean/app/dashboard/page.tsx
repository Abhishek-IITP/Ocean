import { requireUser } from "../lib/hook";
import { getDashboardData } from "../lib/queries";
import { Greeting, LiveClock } from "@/components/dashboard/Greeting";
import { cn } from "@/lib/utils";
import { Weather } from "@/components/dashboard/Weather";
import { FocusTimer } from "@/components/dashboard/FocusTimer";
import { HabitChecklist } from "@/components/dashboard/HabitRow";
import { WaterMood } from "@/components/dashboard/WaterMood";
import { QuickCapture } from "@/components/dashboard/QuickCapture";
import { TaskCheck } from "@/components/dashboard/TaskCheck";
import { ProgressRing } from "@/components/ui/progress-ring";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  Flame,
  ListTodo,
  Sparkles,
  Target,
  Timer,
  Video,
} from "lucide-react";
import { format } from "date-fns";
import { Suspense } from "react";
import { IntentSetter } from "@/components/dashboard/IntentSetter";

export default async function DashboardHome() {
  const session = await requireUser();
  const data = await getDashboardData(session.user!.id as string);
  const { stats } = data;

  const firstName =
    data.user?.name?.split(" ")[0] ?? data.user?.userName ?? "friend";

  type Slot = {
    key: string;
    time: Date | null;
    title: string;
    meta: string;
    kind: "task" | "meeting";
    id?: string;
    done?: boolean;
    url?: string | null;
  };
  const slots: Slot[] = [];
  for (const t of data.todaysTasks) {
    slots.push({
      key: `t-${t.id}`,
      time: t.blockStart ?? null,
      title: t.title,
      meta: t.blockStart ? "Time block" : "Task",
      kind: "task",
      id: t.id,
      done: t.status === "DONE",
    });
  }
  for (const b of data.upcomingBookings) {
    slots.push({
      key: `b-${b.id}`,
      time: b.startTime,
      title: b.EventType?.title ?? "Meeting",
      meta: `with ${b.guestName}`,
      kind: "meeting",
    });
  }
  slots.sort((a, b) => {
    if (a.time && b.time) return a.time.getTime() - b.time.getTime();
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl animate-rise">
      {/* ── Page top: Greeting + inline stats ── */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-border/50 pb-8">
        <div className="space-y-3">
          <Greeting name={firstName} />
          <Suspense fallback={<div className="h-6 w-48 rounded bg-sage-deep/5 animate-pulse" />}>
            <IntentSetter userId={session.user!.id as string} />
          </Suspense>
        </div>

        {/* Inline stat strip */}
        <div className="flex items-center gap-6 text-right">
          <div>
            <div className="font-serif text-2xl font-bold tabular-nums">
              {stats.tasksDone}
              <span className="text-base font-normal text-muted-foreground">
                /{stats.tasksPlanned}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <ListTodo className="size-3" />
              tasks
            </div>
          </div>
          <div className="h-8 w-px bg-border/60" />
          <div>
            <div className="font-serif text-2xl font-bold tabular-nums">
              {Math.round(stats.focusMinutesToday)}
              <span className="text-base font-normal text-muted-foreground">m</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Timer className="size-3" />
              focus
            </div>
          </div>
          <div className="h-8 w-px bg-border/60" />
          <div>
            <div className="font-serif text-2xl font-bold tabular-nums text-clay">
              {data.streak}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="size-3 text-clay" />
              streak
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">

        {/* ── Left: Main content ── */}
        <div className="space-y-8">

          {/* Quick capture */}
          <QuickCapture />

          {/* Today's timeline */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold">Today</h2>
                <p className="text-xs text-muted-foreground">Your schedule, laid out.</p>
              </div>
              <Link
                href="/dashboard/planner"
                className="flex items-center gap-1 text-xs font-medium text-sage-deep hover:text-sage-deep/80 transition-colors"
              >
                Open planner <ArrowRight className="size-3" />
              </Link>
            </div>

            {slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-16 text-center">
                <CalendarDays className="mb-3 size-8 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">Nothing scheduled yet.</p>
                <p className="mt-1 text-xs text-muted-foreground/70">Capture a task above to begin.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Vertical dashed timeline spine */}
                <div className="absolute left-[52px] top-3 bottom-3 w-px border-l border-dashed border-border/50" />

                <div className="space-y-3">
                  {slots.map((s, i) => (
                    <div
                      key={s.key}
                      className="animate-rise flex items-start gap-0"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      {/* Time label */}
                      <span className="w-[52px] shrink-0 pt-2 text-right text-[11px] font-semibold tabular-nums text-muted-foreground/70 pr-3">
                        {s.time ? format(s.time, "HH:mm") : "—"}
                      </span>

                      {/* Timeline dot */}
                      <div className="relative z-10 mt-2.5 mr-4 flex-shrink-0">
                        <div
                          className={cn(
                            "size-2.5 rounded-full border-2",
                            s.done
                              ? "border-muted-foreground/30 bg-muted-foreground/20"
                              : s.kind === "meeting"
                              ? "border-sky bg-sky"
                              : "border-sage-deep bg-sage-deep"
                          )}
                        />
                      </div>

                      {/* Event card */}
                      <div
                        className={cn(
                          "flex flex-1 items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                          s.done
                            ? "border-border/30 bg-muted/20"
                            : "border-border/50 bg-card hover:bg-card/80"
                        )}
                      >
                        {s.kind === "task" && s.id ? (
                          <TaskCheck id={s.id} done={!!s.done} size="sm" />
                        ) : (
                          <span className="grid size-5 shrink-0 place-items-center rounded-md bg-sky/15 text-sky">
                            <Video className="size-3" />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div
                            className={cn(
                              "truncate text-sm font-medium",
                              s.done && "text-muted-foreground line-through"
                            )}
                          >
                            {s.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground/70">
                            {s.meta}
                          </div>
                        </div>
                        {s.kind === "meeting" && s.url && (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Goals + Notes two-up */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Goals snapshot */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold">Goals</h2>
                <Link
                  href="/dashboard/goals"
                  className="text-xs text-sage-deep hover:text-sage-deep/80"
                >
                  All goals →
                </Link>
              </div>
              {data.goals.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Give the week a shape.{" "}
                  <Link href="/dashboard/goals" className="text-sage-deep underline underline-offset-2">
                    Add a goal
                  </Link>
                </p>
              ) : (
                <div className="space-y-4">
                  {data.goals.slice(0, 4).map((g) => {
                    const pct = Math.min(100, (g.progress / g.target) * 100);
                    return (
                      <div key={g.id}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{g.title}</span>
                          <span className="ml-2 shrink-0 text-xs tabular-nums text-muted-foreground">
                            {g.progress}/{g.target}
                          </span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-border/50">
                          <div
                            className="h-full rounded-full bg-sage-deep transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recent notes */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold">Notes</h2>
                <Link
                  href="/dashboard/notes"
                  className="text-xs text-sage-deep hover:text-sage-deep/80"
                >
                  All notes →
                </Link>
              </div>
              {data.recentNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Quick captures collect here.
                </p>
              ) : (
                <div className="space-y-2">
                  {data.recentNotes.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      className="rounded-lg border border-border/50 bg-card px-3.5 py-2.5"
                    >
                      <div className="truncate text-sm font-medium">
                        {n.title || n.content.slice(0, 45) || "Untitled"}
                      </div>
                      {n.title && (
                        <div className="mt-0.5 truncate text-xs text-muted-foreground">
                          {n.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* ── Right rail ── */}
        <aside className="space-y-5">
          {/* Clock */}
          <div className="rounded-2xl border border-border/50 bg-card px-5 py-4 shadow-soft">
            <LiveClock />
          </div>

          {/* Productivity ring */}
          <div className="rounded-2xl border border-border/50 bg-card px-5 py-5 shadow-soft">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep/80">
              Today&apos;s rhythm
            </p>
            <div className="flex items-center gap-4">
              <ProgressRing value={stats.productivityScore} size={80}>
                <span className="font-serif text-2xl font-bold">
                  {stats.productivityScore}
                </span>
              </ProgressRing>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Score based on tasks, focus and habits completed today.
              </div>
            </div>
          </div>

          {/* Weather */}
          <Weather />

          {/* Focus timer */}
          <FocusTimer
            minutesToday={stats.focusMinutesToday}
            sessionsToday={stats.focusSessionsToday}
          />

          {/* Habits checklist */}
          <div className="rounded-2xl border border-border/50 bg-card px-5 py-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep/80">
                Habits
              </span>
              <Link
                href="/dashboard/habits"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Manage →
              </Link>
            </div>
            <HabitChecklist habits={data.habits} doneIds={data.habitIdsDoneToday} />
          </div>

          {/* Water & Mood */}
          <div className="rounded-2xl border border-border/50 bg-card px-5 py-4 shadow-soft">
            <WaterMood
              initialWater={data.dailyLog?.water ?? 0}
              initialMood={data.dailyLog?.mood ?? null}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
