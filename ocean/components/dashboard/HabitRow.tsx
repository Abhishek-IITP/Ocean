"use client";

import { toggleHabitLog } from "@/app/lib/actions/habits";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useOptimistic, useTransition } from "react";

export interface HabitItem {
  id: string;
  name: string;
}

export function HabitChecklist({
  habits,
  doneIds,
}: {
  habits: HabitItem[];
  doneIds: string[];
}) {
  const initial = new Set(doneIds);
  const [optimistic, setOptimistic] = useOptimistic(
    initial,
    (state: Set<string>, id: string) => {
      const next = new Set(state);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    }
  );
  const [, startTransition] = useTransition();

  if (habits.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No habits yet — add a few to start a streak.
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {habits.map((h) => {
        const done = optimistic.has(h.id);
        return (
          <li key={h.id}>
            <button
              onClick={() =>
                startTransition(async () => {
                  setOptimistic(h.id);
                  await toggleHabitLog(h.id);
                })
              }
              className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition-colors hover:bg-accent/25"
            >
              <span
                className={cn(
                  "text-sm",
                  done ? "text-muted-foreground line-through" : "text-foreground"
                )}
              >
                {h.name}
              </span>
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full border transition-all duration-300",
                  done ? "border-sage-deep bg-sage-deep text-white" : "border-border"
                )}
              >
                {done && <Check className="size-3" />}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
