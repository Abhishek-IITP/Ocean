"use client";

import { cn } from "@/lib/utils";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

const SESSION = 25 * 60;

type TimerDemoProps = {
  running?: boolean;
  onRunningChange?: (running: boolean) => void;
};

export function TimerDemo({ running: controlledRunning, onRunningChange }: TimerDemoProps) {
  const [seconds, setSeconds] = useState(SESSION);
  const [localRunning, setLocalRunning] = useState(false);
  const running = controlledRunning !== undefined ? controlledRunning : localRunning;
  const setRunning = (r: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof r === "function" ? r(running) : r;
    if (onRunningChange) onRunningChange(nextVal);
    else setLocalRunning(nextVal);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          return SESSION;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = 1 - seconds / SESSION;

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-deep">
        Focus session
      </p>
      <div className="relative mt-6 grid size-40 place-items-center">
        <svg className="size-40 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" strokeWidth="6" className="text-border" stroke="currentColor" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-sage-deep transition-[stroke-dashoffset] duration-1000 ease-linear"
            stroke="currentColor"
            strokeDasharray={2 * Math.PI * 44}
            strokeDashoffset={(1 - progress) * 2 * Math.PI * 44}
          />
        </svg>
        <span className="absolute font-serif text-4xl font-bold tabular-nums">
          {mm}:{ss}
        </span>
      </div>
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-px"
        >
          {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {running ? "Pause" : "Start focus"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSeconds(SESSION);
          }}
          className={cn(
            "grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent/30"
          )}
          aria-label="Reset timer"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
