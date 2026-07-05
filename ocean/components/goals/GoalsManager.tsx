"use client";

import {
  createGoal,
  deleteGoal,
  updateGoalProgress,
} from "@/app/lib/actions/goals";
import { cn } from "@/lib/utils";
import { Check, Minus, Plus, Target, Trash2 } from "lucide-react";
import { OceanSelect } from "@/components/ui/ocean-select";
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
    <div className="space-y-10">
      {/* Add bar */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border/50 bg-card p-2.5 shadow-soft">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Name a goal for this week or month…"
          className="h-10 min-w-[200px] flex-1 rounded-xl bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/50"
        />
        {/* Period select */}
        <OceanSelect
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="h-10 w-28 shrink-0"
        >
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </OceanSelect>
        {/* Target count */}
        <input
          type="number"
          min={1}
          value={target}
          onChange={(e) => setTarget(Math.max(1, Number(e.target.value)))}
          className="h-10 w-16 shrink-0 rounded-xl border border-border/60 bg-background px-3 text-center text-sm outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
          aria-label="Target count"
          title="Target count"
        />
        <button
          onClick={add}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-sage-deep px-4 text-sm font-semibold text-sage-deep-foreground transition-all hover:-translate-y-px hover:bg-sage-deep/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer"
        >
          <Plus className="size-3.5" /> Add goal
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

  return (
    <div>
      <h2 className="mb-4 font-serif text-xl font-bold">{title}</h2>

      {goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/50 py-10 text-center">
          <Target className="mx-auto mb-2 size-6 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            No goals set for {title.toLowerCase()} yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-soft">
          <ul>
            {goals.map((g, i) => {
              const pct = Math.min(100, (g.progress / g.target) * 100);
              return (
                <li
                  key={g.id}
                  className={cn(
                    "group px-6 py-5 transition-colors hover:bg-muted/10",
                    i !== 0 && "border-t border-border/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Title + done badge */}
                    <div className="flex min-w-0 items-center gap-2">
                      {g.done && (
                        <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-sage-deep text-white">
                          <Check className="size-2.5" />
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-sm font-medium",
                          g.done && "text-muted-foreground line-through"
                        )}
                      >
                        {g.title}
                      </span>
                    </div>

                    {/* Controls */}
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {g.progress}
                        <span className="text-muted-foreground/50">/{g.target}</span>
                      </span>
                      <button
                        onClick={() =>
                          startTransition(async () => {
                            await updateGoalProgress(g.id, -1);
                            onChange();
                          })
                        }
                        aria-label="Decrease"
                        className="grid size-7 place-items-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-sage-deep/40 hover:bg-sage-deep/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer"
                      >
                        <Minus className="size-3" />
                      </button>
                      <button
                        onClick={() =>
                          startTransition(async () => {
                            await updateGoalProgress(g.id, 1);
                            onChange();
                          })
                        }
                        aria-label="Increase"
                        className="grid size-7 place-items-center rounded-full bg-sage-deep text-white transition-all hover:-translate-y-px hover:bg-sage-deep/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer"
                      >
                        <Plus className="size-3" />
                      </button>
                      <button
                        onClick={() =>
                          startTransition(async () => {
                            await deleteGoal(g.id);
                            onChange();
                          })
                        }
                        aria-label="Delete goal"
                        className="grid size-7 place-items-center rounded-full text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border/40">
                    <div
                      className="h-full rounded-full bg-sage-deep transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
