"use client";

import { createNote } from "@/app/lib/actions/notes";
import { createTask } from "@/app/lib/actions/tasks";
import { cn } from "@/lib/utils";
import { NotebookPen, Plus } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Mode = "task" | "note";

export function QuickCapture() {
  const [mode, setMode] = useState<Mode>("task");
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function submit() {
    const text = value.trim();
    if (!text) return;
    startTransition(async () => {
      const res =
        mode === "task"
          ? await createTask({ title: text })
          : await createNote({ content: text });
      if (res?.ok) {
        setValue("");
        toast.success(mode === "task" ? "Task captured" : "Note saved");
        router.refresh();
        inputRef.current?.focus();
      } else {
        toast.error(res?.error ?? "Something went wrong");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <NotebookPen className="size-4 text-sage-deep" />
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-sage-deep">
          Quick capture
        </span>
        <div className="ml-auto flex gap-1 rounded-full bg-accent/30 p-0.5">
          {(["task", "note"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                mode === m
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={
            mode === "task" ? "What needs doing?" : "Jot a thought…"
          }
          className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          onClick={submit}
          disabled={pending || !value.trim()}
          className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 hover:-translate-y-px disabled:opacity-40"
          aria-label="Add"
        >
          <Plus className="size-5" />
        </button>
      </div>
    </div>
  );
}
