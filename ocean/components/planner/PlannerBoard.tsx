"use client";

import {
  createTask,
  deleteTask,
  updateTask,
} from "@/app/lib/actions/tasks";
import { TaskCheck } from "@/components/dashboard/TaskCheck";
import { cn } from "@/lib/utils";
import { MoveRight, Plus, Trash2, ChevronDown, Sparkles, X } from "lucide-react";
import { OceanSelect } from "@/components/ui/ocean-select";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Quadrant =
  | "URGENT_IMPORTANT"
  | "NOT_URGENT_IMPORTANT"
  | "URGENT_NOT_IMPORTANT"
  | "NOT_URGENT_NOT_IMPORTANT"
  | "UNSORTED";

export interface PlannerTask {
  id: string;
  title: string;
  quadrant: Quadrant;
  status: "TODO" | "DONE";
}

const QUADRANTS: {
  key: Quadrant;
  title: string;
  hint: string;
  accent: string;
}[] = [
  {
    key: "URGENT_IMPORTANT",
    title: "Do First",
    hint: "Urgent & important",
    accent: "border-l-clay",
  },
  {
    key: "NOT_URGENT_IMPORTANT",
    title: "Schedule",
    hint: "Important, not urgent",
    accent: "border-l-sage-deep",
  },
  {
    key: "URGENT_NOT_IMPORTANT",
    title: "Delegate",
    hint: "Urgent, not important",
    accent: "border-l-sky",
  },
  {
    key: "NOT_URGENT_NOT_IMPORTANT",
    title: "Later",
    hint: "Neither urgent nor important",
    accent: "border-l-border",
  },
];

const ORDER: Quadrant[] = [
  "URGENT_IMPORTANT",
  "NOT_URGENT_IMPORTANT",
  "URGENT_NOT_IMPORTANT",
  "NOT_URGENT_NOT_IMPORTANT",
  "UNSORTED",
];

const QUADRANT_MAP: Record<string, Quadrant> = {
  Q1: "URGENT_IMPORTANT",
  Q2: "NOT_URGENT_IMPORTANT",
  Q3: "URGENT_NOT_IMPORTANT",
  Q4: "NOT_URGENT_NOT_IMPORTANT",
  UNSORTED: "UNSORTED",
};

export function PlannerBoard({ tasks }: { tasks: PlannerTask[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [quadrant, setQuadrant] = useState<Quadrant>("URGENT_IMPORTANT");
  const [, startTransition] = useTransition();

  // AI Refinement states
  const [refineLoading, setRefineLoading] = useState(false);
  const [refineData, setRefineData] = useState<{
    quadrant: string;
    refinedTitle: string;
    subtasks: string[];
  } | null>(null);

  async function handleRefine() {
    const t = title.trim();
    if (!t) return;
    setRefineLoading(true);
    setRefineData(null);
    try {
      const res = await fetch("/api/planner/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t }),
      });
      const data = await res.json();
      if (data.ok && data.data) {
        setRefineData(data.data);
      } else {
        toast.error(data.error ?? "Failed to refine task");
      }
    } catch (e) {
      console.error(e);
      toast.error("Refinement connection failed.");
    } finally {
      setRefineLoading(false);
    }
  }

  function applySuggestions() {
    if (!refineData) return;
    const targetQ = QUADRANT_MAP[refineData.quadrant] ?? "UNSORTED";

    startTransition(async () => {
      // 1. Create main refined task
      const mainRes = await createTask({ title: refineData.refinedTitle, quadrant: targetQ });
      if (mainRes.ok) {
        // 2. Create subtasks in order
        for (const st of refineData.subtasks) {
          await createTask({ title: st, quadrant: targetQ });
        }
        setTitle("");
        setRefineData(null);
        toast.success("AI suggestions applied and tasks added.");
        router.refresh();
      } else {
        toast.error(mainRes.error ?? "Failed to add task");
      }
    });
  }

  function add() {
    const t = title.trim();
    if (!t) return;
    startTransition(async () => {
      const res = await createTask({ title: t, quadrant });
      if (res.ok) {
        setTitle("");
        setRefineData(null);
        router.refresh();
      } else toast.error(res.error ?? "Could not add task");
    });
  }

  function move(id: string, q: Quadrant) {
    startTransition(async () => {
      await updateTask(id, { quadrant: q });
      router.refresh();
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      await deleteTask(id);
      router.refresh();
    });
  }

  const byQuadrant = (q: Quadrant) => tasks.filter((t) => t.quadrant === q);
  const unsorted = byQuadrant("UNSORTED");

  return (
    <div className="space-y-6">
      {/* Add bar */}
      <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-card p-3 shadow-soft sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task…"
          className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
        />
        <OceanSelect
          value={quadrant}
          onChange={(e) => setQuadrant(e.target.value as Quadrant)}
          className="h-11 shrink-0 sm:w-40"
        >
          {QUADRANTS.map((q) => (
            <option key={q.key} value={q.key}>
              {q.title}
            </option>
          ))}
          <option value="UNSORTED">Unsorted</option>
        </OceanSelect>
        
        {/* Refine Button */}
        <button
          onClick={handleRefine}
          disabled={refineLoading || !title.trim()}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-sage-deep/40 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          title="Refine task details with AI"
        >
          <Sparkles className={cn("size-4 text-sage-deep", refineLoading && "animate-spin")} />
          {refineLoading ? "Refining..." : "Refine"}
        </button>

        <button
          onClick={add}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-px cursor-pointer"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>

      {/* AI Suggestion Box */}
      {refineData && (
        <div className="rounded-2xl border border-sage-deep/20 bg-sage-deep/[0.02] p-5 text-left text-sm space-y-4 animate-rise shadow-soft">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sage-deep/80 flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Ocean AI Scheduler Suggestion
            </span>
            <button
              onClick={() => setRefineData(null)}
              className="rounded p-0.5 text-muted-foreground/60 hover:bg-accent/40 hover:text-foreground cursor-pointer focus-visible:outline-none"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 text-xs">
            <div>
              <p className="font-semibold text-muted-foreground mb-1">Refined Title</p>
              <p className="text-sm font-medium text-foreground italic">"{refineData.refinedTitle}"</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground mb-1">Suggested Quadrant</p>
              <p className="text-sm font-semibold text-sage-deep capitalize">
                {QUADRANTS.find(q => q.key === QUADRANT_MAP[refineData.quadrant])?.title ?? "Unsorted"}
              </p>
            </div>
          </div>

          {refineData.subtasks.length > 0 && (
            <div className="text-xs">
              <p className="font-semibold text-muted-foreground mb-1.5">Suggested Actionable Subtasks</p>
              <ul className="list-disc pl-4 space-y-1 text-foreground/80">
                {refineData.subtasks.map((st, idx) => (
                  <li key={idx} className="select-all">{st}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2 border-t border-border/40">
            <button
              onClick={applySuggestions}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-sage-deep px-4 text-xs font-semibold text-sage-deep-foreground transition-all hover:bg-sage-deep/95 cursor-pointer"
            >
              Apply Suggestions
            </button>
          </div>
        </div>
      )}

      {/* Eisenhower matrix */}
      <div className="grid gap-4 md:grid-cols-2">
        {QUADRANTS.map((q) => {
          const items = byQuadrant(q.key);
          return (
            <div
              key={q.key}
              className={cn(
                "rounded-2xl border border-l-4 border-border/70 bg-card p-5 shadow-soft",
                q.accent
              )}
            >
              <div className="mb-3">
                <h3 className="font-serif text-lg font-bold">{q.title}</h3>
                <p className="text-xs text-muted-foreground">{q.hint}</p>
              </div>
              {items.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  Nothing here yet.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {items.map((t) => (
                    <TaskRow
                      key={t.id}
                      task={t}
                      quadrants={ORDER}
                      onMove={move}
                      onRemove={remove}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Unsorted */}
      {unsorted.length > 0 && (
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
          <h3 className="mb-3 font-serif text-lg font-bold">Unsorted</h3>
          <ul className="space-y-1.5">
            {unsorted.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                quadrants={ORDER}
                onMove={move}
                onRemove={remove}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  quadrants,
  onMove,
  onRemove,
}: {
  task: PlannerTask;
  quadrants: Quadrant[];
  onMove: (id: string, q: Quadrant) => void;
  onRemove: (id: string) => void;
}) {
  const labels: Record<Quadrant, string> = {
    URGENT_IMPORTANT: "Do first",
    NOT_URGENT_IMPORTANT: "Schedule",
    URGENT_NOT_IMPORTANT: "Delegate",
    NOT_URGENT_NOT_IMPORTANT: "Later",
    UNSORTED: "Unsorted",
  };
  return (
    <li className="group flex items-center gap-2.5 rounded-xl border border-border/70 bg-background/50 p-2.5">
      <TaskCheck id={task.id} done={task.status === "DONE"} size="sm" />
      <span
        className={cn(
          "flex-1 truncate text-sm",
          task.status === "DONE" && "text-muted-foreground line-through"
        )}
      >
        {task.title}
      </span>
      <div className="flex items-center gap-1.5 opacity-55 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-200">
        <div className="relative">
          <select
            aria-label="Move task"
            value={task.quadrant}
            onChange={(e) => onMove(task.id, e.target.value as Quadrant)}
            className="h-7 cursor-pointer appearance-none rounded-lg border border-border/60 bg-card pl-6 pr-5.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 transition-all duration-150"
          >
            {quadrants.map((q) => (
              <option key={q} value={q}>
                {labels[q]}
              </option>
            ))}
          </select>
          <MoveRight className="pointer-events-none absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground/80" />
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-2.5 -translate-y-1/2 text-muted-foreground/60" />
        </div>
        <button
          onClick={() => onRemove(task.id)}
          aria-label="Delete task"
          className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  );
}
