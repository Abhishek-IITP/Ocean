import { requireUser } from "../lib/hook";
import { getDashboardData } from "../lib/queries";
import { Greeting, LiveClock } from "@/components/dashboard/Greeting";
import { Weather } from "@/components/dashboard/Weather";
import { FocusTimer } from "@/components/dashboard/FocusTimer";
import { HabitChecklist } from "@/components/dashboard/HabitRow";
import { WaterMood } from "@/components/dashboard/WaterMood";
import { QuickCapture } from "@/components/dashboard/QuickCapture";
import { TaskCheck } from "@/components/dashboard/TaskCheck";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Flame,
  ListTodo,
  Target,
  Timer,
  Video,
} from "lucide-react";
import { format } from "date-fns";

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/60 p-4">
      <Icon className="size-4 text-sage-deep" />
      <div className="mt-2 font-serif text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export default async function DashboardHome() {
  const session = await requireUser();
  const data = await getDashboardData(session.user!.id as string);
  const { stats } = data;

  const firstName =
    data.user?.name?.split(" ")[0] ?? data.user?.userName ?? "friend";

  // Merge tasks (with a time block) and bookings into one gentle timeline.
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
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Greeting name={firstName} />
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/planner">
            Open day planner <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]">
        {/* ── Center workspace ── */}
        <div className="space-y-6">
          {/* Productivity band */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="flex items-center gap-5">
                <ProgressRing value={stats.productivityScore} size={104}>
                  <span className="font-serif text-3xl font-bold">
                    {stats.productivityScore}
                  </span>
                  <span className="text-[10px] text-muted-foreground">of 100</span>
                </ProgressRing>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-sage-deep">
                    Today&apos;s rhythm
                  </p>
                  <p className="mt-1 max-w-[15rem] text-sm text-muted-foreground">
                    A gentle blend of your tasks, focus and habits so far today.
                  </p>
                </div>
              </div>
              <div className="grid flex-1 grid-cols-3 gap-3">
                <StatTile
                  icon={ListTodo}
                  label="Tasks"
                  value={`${stats.tasksDone}/${stats.tasksPlanned}`}
                />
                <StatTile
                  icon={Timer}
                  label="Focus min"
                  value={`${Math.round(stats.focusMinutesToday)}`}
                />
                <StatTile
                  icon={Flame}
                  label="Day streak"
                  value={`${data.streak}`}
                />
              </div>
            </div>
          </div>

          <QuickCapture />

          {/* Today's schedule */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold">Today</h2>
                <p className="text-xs text-muted-foreground">
                  Tasks and meetings, side by side.
                </p>
              </div>
              <CalendarDays className="size-5 text-muted-foreground" />
            </div>

            {slots.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Nothing scheduled yet. Capture a task above to begin.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {slots.map((s) => (
                  <li
                    key={s.key}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/50 p-3.5"
                  >
                    <span className="w-12 shrink-0 text-xs font-bold tabular-nums text-muted-foreground">
                      {s.time ? format(s.time, "HH:mm") : "—"}
                    </span>
                    <span className="h-8 w-px bg-border" />
                    {s.kind === "task" && s.id ? (
                      <TaskCheck id={s.id} done={!!s.done} size="sm" />
                    ) : (
                      <span className="grid size-5 shrink-0 place-items-center rounded-md bg-accent/50 text-sage-deep">
                        <Video className="size-3" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div
                        className={`truncate text-sm ${
                          s.done ? "text-muted-foreground line-through" : "font-medium"
                        }`}
                      >
                        {s.title}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {s.meta}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Goals + recent notes */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold">Goals</h2>
                <Target className="size-5 text-muted-foreground" />
              </div>
              {data.goals.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Set a weekly goal to give the week a shape.{" "}
                  <Link href="/dashboard/goals" className="text-sage-deep underline">
                    Add one
                  </Link>
                  .
                </p>
              ) : (
                <ul className="space-y-3">
                  {data.goals.slice(0, 4).map((g) => (
                    <li key={g.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate">{g.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {g.progress}/{g.target}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-accent/30">
                        <div
                          className="h-full rounded-full bg-sage-deep transition-all duration-700"
                          style={{
                            width: `${Math.min(100, (g.progress / g.target) * 100)}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold">Recent notes</h2>
                <Link
                  href="/dashboard/notes"
                  className="text-xs text-sage-deep hover:underline"
                >
                  All notes
                </Link>
              </div>
              {data.recentNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Your quick captures will collect here.
                </p>
              ) : (
                <ul className="space-y-2">
                  {data.recentNotes.map((n) => (
                    <li
                      key={n.id}
                      className="rounded-xl border border-border/70 bg-background/50 p-3"
                    >
                      <div className="truncate text-sm font-medium">
                        {n.title || n.content.slice(0, 40) || "Untitled"}
                      </div>
                      {n.title && (
                        <div className="truncate text-xs text-muted-foreground">
                          {n.content}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ── Right context column ── */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <LiveClock />
          </div>
          <Weather />
          <FocusTimer
            minutesToday={stats.focusMinutesToday}
            sessionsToday={stats.focusSessionsToday}
          />
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-sage-deep">
                Habits
              </span>
              <Link
                href="/dashboard/habits"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Edit
              </Link>
            </div>
            <HabitChecklist habits={data.habits} doneIds={data.habitIdsDoneToday} />
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
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
