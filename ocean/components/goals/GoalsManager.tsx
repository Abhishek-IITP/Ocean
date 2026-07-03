"use client";

import {
  createGoal,
  deleteGoal,
  updateGoalProgress,
} from "@/app/lib/actions/goals";
import { cn } from "@/lib/utils";
import { Check, Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Period = "WEEKLY" | "MONTHLY";

export interface GoalView {
  id: string;
  title: string;
  period: Period | "YEARLY";
  target: number;
  progress: number;
  done: boolean;
}

export function GoalsManager({ goals }: { goals: GoalView[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState<Period>("WEEKLY");
  const [target, setTarget] = useState(1);
  const [, startTransition] = useTransition();

  function add() {
    if (!title.trim()) return;
    startTransition(async () => {
      const res = await createGoal({ title, period, target });
      if (res.ok) {
        setTitle("");
        setTarget(1);
        router.refresh();
      } else toast.error(res.error ?? "Could not add goal");
    });
  }

  const weekly = goals.filter((g) => g.period === "WEEKLY");
  const monthly = goals.filter((g) => g.period === "MONTHLY");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-card p-3 shadow-soft sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="A goal for this week or month…"
          className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </select>
        <input
          type="number"
          min={1}
          value={target}
          onChange={(e) => setTarget(Math.max(1, Number(e.target.value)))}
          className="h-11 w-20 rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Target"
        />
        <button
          onClick={add}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-px"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>

      <GoalGroup title="This week" goals={weekly} onChange={() => router.refresh()} />
      <GoalGroup title="This month" goals={monthly} onChange={() => router.refresh()} />
    </div>
  );
}

function GoalGroup({
  title,
  goals,
  onChange,
}: {
  title: string;
  goals: GoalView[];
  onChange: () => void;
}) {
  const [, startTransition] = useTransition();
  if (goals.length === 0)
    return (
      <div>
        <h2 className="mb-3 font-serif text-lg font-bold">{title}</h2>
        <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          No goals set for {title.toLowerCase()} yet.
        </div>
      </div>
    );

  return (
    <div>
      <h2 className="mb-3 font-serif text-lg font-bold">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {goals.map((g) => {
          const pct = Math.min(100, (g.progress / g.target) * 100);
          return (
            <div
              key={g.id}
              className="group rounded-2xl border border-border/70 bg-card p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {g.done && (
                    <span className="grid size-5 place-items-center rounded-full bg-sage-deep text-white">
                      <Check className="size-3" />
                    </span>
                  )}
                  <h3
                    className={cn(
                      "text-sm font-semibold",
                      g.done && "text-muted-foreground line-through"
                    )}
                  >
                    {g.title}
                  </h3>
                </div>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      await deleteGoal(g.id);
                      onChange();
                    })
                  }
                  aria-label="Delete goal"
                  className="grid size-7 place-items-center rounded-md text-muted-foreground opacity-0 transition-colors hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-accent/30">
                <div
                  className="h-full rounded-full bg-sage-deep transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {g.progress} / {g.target}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await updateGoalProgress(g.id, -1);
                        onChange();
                      })
                    }
                    aria-label="Decrease"
                    className="grid size-8 place-items-center rounded-full border border-border transition-colors hover:bg-accent/30"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await updateGoalProgress(g.id, 1);
                        onChange();
                      })
                    }
                    aria-label="Increase"
                    className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:-translate-y-px"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
