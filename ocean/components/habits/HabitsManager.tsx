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
  doneDays: string[];
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
      {/* Add bar */}
      <div className="flex gap-2 rounded-2xl border border-border/50 bg-card p-2.5 shadow-soft">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Name a habit to keep — e.g. Read one page"
          className="h-10 flex-1 rounded-xl bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/50 focus-visible:outline-none"
        />
        <button
          onClick={add}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-sage-deep px-4 text-sm font-semibold text-sage-deep-foreground transition-all hover:-translate-y-px hover:bg-sage-deep/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer"
        >
          <Plus className="size-3.5" /> Add
        </button>
      </div>

      {/* Empty state */}
      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center">
          <Flame className="mb-3 size-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">Small habits, gently kept.</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Add your first above to begin tracking.</p>
        </div>
      ) : (
        /* Ledger table */
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-soft">
          {/* Column headers */}
          <div className="flex items-center border-b border-border/40 px-6 py-3">
            <div className="flex-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/60">
              Habit
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              {days.map((d) => (
                <div
                  key={d.key}
                  className={cn(
                    "w-9 text-center text-[10px] font-bold uppercase tracking-wider",
                    d.isToday ? "text-sage-deep" : "text-muted-foreground/50"
                  )}
                >
                  {d.weekday}
                </div>
              ))}
            </div>
            <div className="w-16 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
              Streak
            </div>
          </div>

          {/* Rows */}
          <ul>
            {habits.map((h, i) => {
              const done = new Set(h.doneDays);
              return (
                <li
                  key={h.id}
                  className={cn(
                    "group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/10",
                    i !== 0 && "border-t border-border/40"
                  )}
                >
                  {/* Habit name */}
                  <div className="flex-1 truncate text-sm font-medium text-foreground">
                    {h.name}
                  </div>

                  {/* Day circles */}
                  <div className="hidden items-center gap-2 sm:flex">
                    {days.map((d) => {
                      const isDone = done.has(d.key);
                      return (
                        <button
                          key={d.key}
                          onClick={() => toggle(h.id, d.key)}
                          aria-label={`${h.name} on ${d.label}`}
                          title={d.label}
                          className={cn(
                            "grid size-9 place-items-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer",
                            isDone
                              ? "border-sage-deep bg-sage-deep text-white"
                              : "border-border/50 hover:border-sage-deep/40 hover:bg-sage-deep/5",
                            d.isToday && !isDone && "border-sage-deep/40"
                          )}
                        >
                          {isDone && <Check className="size-3.5" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Streak */}
                  <div className="flex w-16 items-center justify-end gap-1 text-sm font-bold tabular-nums text-clay">
                    <Flame className="size-3.5 text-clay" />
                    {h.streak}
                  </div>

                  {/* Archive */}
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await archiveHabit(h.id);
                        router.refresh();
                      })
                    }
                    aria-label="Archive habit"
                    className="ml-1 grid size-7 place-items-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
                  >
                    <X className="size-3.5" />
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
