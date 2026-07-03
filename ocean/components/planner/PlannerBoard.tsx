"use client";

import {
  createTask,
  deleteTask,
  updateTask,
} from "@/app/lib/actions/tasks";
import { TaskCheck } from "@/components/dashboard/TaskCheck";
import { cn } from "@/lib/utils";
import { MoveRight, Plus, Trash2 } from "lucide-react";
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
  status: "TODO" | "IN_PROGRESS" | "DONE";
  quadrant: Quadrant;
  blockStart: string | null;
}

const QUADRANTS: {
  key: Quadrant;
  title: string;
  hint: string;
  accent: string;
}[] = [
  {
    key: "URGENT_IMPORTANT",
    title: "Do first",
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

export function PlannerBoard({ tasks }: { tasks: PlannerTask[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [quadrant, setQuadrant] = useState<Quadrant>("URGENT_IMPORTANT");
  const [, startTransition] = useTransition();

  function add() {
    const t = title.trim();
    if (!t) return;
    startTransition(async () => {
      const res = await createTask({ title: t, quadrant });
      if (res.ok) {
        setTitle("");
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
          className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          value={quadrant}
          onChange={(e) => setQuadrant(e.target.value as Quadrant)}
          className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {QUADRANTS.map((q) => (
            <option key={q.key} value={q.key}>
              {q.title}
            </option>
          ))}
          <option value="UNSORTED">Unsorted</option>
        </select>
        <button
          onClick={add}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-px"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>

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
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="relative">
          <select
            aria-label="Move task"
            value={task.quadrant}
            onChange={(e) => onMove(task.id, e.target.value as Quadrant)}
            className="h-7 cursor-pointer rounded-md border border-border bg-card pl-6 pr-1 text-xs outline-none"
          >
            {quadrants.map((q) => (
              <option key={q} value={q}>
                {labels[q]}
              </option>
            ))}
          </select>
          <MoveRight className="pointer-events-none absolute left-1.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
        <button
          onClick={() => onRemove(task.id)}
          aria-label="Delete task"
          className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  );
}
