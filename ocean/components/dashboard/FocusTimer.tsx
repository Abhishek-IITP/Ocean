"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { logFocusSession } from "@/app/lib/actions/focus";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESETS = [25, 45, 15];

export function FocusTimer({
  minutesToday = 0,
  sessionsToday = 0,
  compact = false,
}: {
  minutesToday?: number;
  sessionsToday?: number;
  compact?: boolean;
}) {
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const startedLabel = useRef<string>("");

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          setRunning(false);
          startTransition(async () => {
            await logFocusSession({ minutes: duration, label: startedLabel.current });
            toast.success("Focus session complete", {
              description: "Well done. Take a slow breath.",
            });
            router.refresh();
          });
          return duration * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, duration]);

  function pick(mins: number) {
    setDuration(mins);
    setRemaining(mins * 60);
    setRunning(false);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = 1 - remaining / (duration * 60);
  const r = 44;
  const c = 2 * Math.PI * r;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-sage-deep">
          Focus
        </span>
        <span className="text-xs text-muted-foreground">
          {Math.round(minutesToday)}m · {sessionsToday} today
        </span>
      </div>

      <div className="flex flex-col items-center pt-4">
        <div className="relative grid size-32 place-items-center">
          <svg className="size-32 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" strokeWidth="6" className="text-border" stroke="currentColor" />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className="text-sage-deep transition-[stroke-dashoffset] duration-1000 ease-linear"
              stroke="currentColor"
              strokeDasharray={c}
              strokeDashoffset={(1 - progress) * c}
            />
          </svg>
          <span className="absolute font-serif text-3xl font-bold tabular-nums">
            {mm}:{ss}
          </span>
        </div>

        {!compact && (
          <div className="mt-4 flex gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => pick(p)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  duration === p
                    ? "bg-accent/60 text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/30"
                )}
              >
                {p}m
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setRunning((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-px"
          >
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => pick(duration)}
            className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent/30"
            aria-label="Reset"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
