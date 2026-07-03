"use client";

import {
  archiveHabit,
  createHabit,
  toggleHabitLog,
} from "@/app/lib/actions/habits";
import { cn } from "@/lib/utils";
import { Check, Flame, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export interface HabitView {
  id: string;
  name: string;
  doneDays: string[]; // yyyy-mm-dd keys
  streak: number;
}

export function HabitsManager({
  habits,
  days,
}: {
  habits: HabitView[];
  days: { key: string; label: string; weekday: string; isToday: boolean }[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [, startTransition] = useTransition();

  function add() {
    const n = name.trim();
    if (!n) return;
    startTransition(async () => {
      const res = await createHabit({ name: n });
      if (res.ok) {
        setName("");
        router.refresh();
      } else toast.error(res.error ?? "Could not add habit");
    });
  }

  function toggle(habitId: string, dayKey: string) {
    startTransition(async () => {
      await toggleHabitLog(habitId, dayKey);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-card p-3 shadow-soft sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a habit — e.g. Read a physical page"
          className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          onClick={add}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-px"
        >
          <Plus className="size-4" /> Add habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-14 text-center">
          <p className="text-sm text-muted-foreground">
            Small habits, gently kept. Add your first above.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
          {/* header */}
          <div className="flex items-center gap-3 border-b border-border/60 px-5 py-3">
            <div className="flex-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Habit
            </div>
            <div className="hidden gap-1.5 sm:flex">
              {days.map((d) => (
                <div
                  key={d.key}
                  className={cn(
                    "w-9 text-center text-[10px] font-semibold uppercase",
                    d.isToday ? "text-sage-deep" : "text-muted-foreground"
                  )}
                >
                  {d.weekday}
                </div>
              ))}
            </div>
            <div className="w-16 text-right text-[10px] font-semibold uppercase text-muted-foreground">
              Streak
            </div>
          </div>

          <ul className="divide-y divide-border/60">
            {habits.map((h) => {
              const done = new Set(h.doneDays);
              return (
                <li key={h.id} className="group flex items-center gap-3 px-5 py-3.5">
                  <div className="flex-1 truncate text-sm font-medium">{h.name}</div>
                  <div className="flex gap-1.5">
                    {days.map((d) => {
                      const isDone = done.has(d.key);
                      return (
                        <button
                          key={d.key}
                          onClick={() => toggle(h.id, d.key)}
                          aria-label={`${h.name} on ${d.label}`}
                          className={cn(
                            "grid size-9 place-items-center rounded-lg border transition-all duration-300",
                            isDone
                              ? "border-sage-deep bg-sage-deep text-white"
                              : "border-border bg-accent/20 hover:bg-accent/40",
                            d.isToday && !isDone && "ring-1 ring-sage-deep/40"
                          )}
                        >
                          {isDone && <Check className="size-4" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex w-16 items-center justify-end gap-1 text-sm font-semibold text-clay">
                    <Flame className="size-3.5" /> {h.streak}
                  </div>
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await archiveHabit(h.id);
                        router.refresh();
                      })
                    }
                    aria-label="Archive habit"
                    className="grid size-7 place-items-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
