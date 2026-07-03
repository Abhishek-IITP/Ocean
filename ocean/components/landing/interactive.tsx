"use client";

import { cn } from "@/lib/utils";
import {
  Check,
  Droplet,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Sprout,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────
   TiltCard — a very subtle pointer-follow tilt. Calm, not flashy:
   max ~5deg, scale 1.02, springy but slow. Disabled for touch and
   reduced-motion users.
   ──────────────────────────────────────────────────────────── */
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) scale(1.02)`,
    });
  };

  const reset = () => setStyle({ transform: "perspective(900px) rotateX(0) rotateY(0) scale(1)" });

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={style}
      className={cn(
        "transition-transform duration-500 ease-out will-change-transform motion-reduce:!transform-none",
        className
      )}
    >
      {children}
    </div>
  );
}

const cardBase =
  "rounded-2xl border border-border/70 bg-card p-5 shadow-soft";

/* ── Interactive: Today's tasks (check them off) ── */
export function TasksDemoCard() {
  const [tasks, setTasks] = useState([
    { id: 1, label: "Morning pages — 3 paragraphs", done: true },
    { id: 2, label: "Deep work: redesign the hero", done: false },
    { id: 3, label: "Walk by the shore", done: false },
    { id: 4, label: "Review tomorrow's calendar", done: false },
  ]);
  const done = tasks.filter((t) => t.done).length;

  return (
    <div className={cardBase}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-deep">
            Today&apos;s plan
          </p>
          <p className="mt-0.5 font-serif text-lg font-bold">
            {done} of {tasks.length} done
          </p>
        </div>
        <div className="flex h-9 items-center gap-1 rounded-full bg-accent/40 px-3 text-xs font-medium text-accent-foreground">
          <Sprout className="size-3.5 text-sage-deep" /> calm
        </div>
      </div>
      <ul className="space-y-1.5">
        {tasks.map((t) => (
          <li key={t.id}>
            <button
              onClick={() =>
                setTasks((prev) =>
                  prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x))
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-accent/25"
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-md border transition-all duration-300",
                  t.done
                    ? "border-sage-deep bg-sage-deep text-white"
                    : "border-border bg-card"
                )}
              >
                {t.done && <Check className="size-3.5" />}
              </span>
              <span
                className={cn(
                  "text-sm transition-colors",
                  t.done ? "text-muted-foreground line-through" : "text-foreground"
                )}
              >
                {t.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Interactive: Focus timer (real ticking pomodoro preview) ── */
export function FocusDemoCard() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          return 25 * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = 1 - seconds / (25 * 60);

  return (
    <div className={cn(cardBase, "text-center")}>
      <div className="mb-3 flex items-center justify-between text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-deep">
          Focus session
        </p>
        <span className="text-xs text-muted-foreground">25 min</span>
      </div>
      <div className="relative mx-auto grid size-32 place-items-center">
        <svg className="size-32 -rotate-90" viewBox="0 0 100 100">
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
        <span className="absolute font-serif text-3xl font-bold tabular-nums">
          {mm}:{ss}
        </span>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-px"
        >
          {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {running ? "Pause" : "Start focus"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSeconds(25 * 60);
          }}
          className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent/30"
          aria-label="Reset timer"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── Interactive: Habit + hydration trackers ── */
export function HabitsDemoCard() {
  const [days, setDays] = useState([true, true, true, false, true, false, false]);
  const [water, setWater] = useState(4);
  const streak = (() => {
    let s = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i]) s++;
      else break;
    }
    return s;
  })();

  return (
    <div className={cn(cardBase, "space-y-4")}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-deep">
          Habits
        </p>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-clay">
          <Flame className="size-3.5" /> {streak}-day streak
        </span>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Read a physical page</p>
        <div className="flex gap-1.5">
          {days.map((on, i) => (
            <button
              key={i}
              onClick={() =>
                setDays((prev) => prev.map((x, j) => (j === i ? !x : x)))
              }
              aria-label={`Toggle day ${i + 1}`}
              className={cn(
                "h-9 flex-1 rounded-lg border transition-all duration-300",
                on
                  ? "border-sage-deep bg-sage-deep/85"
                  : "border-border bg-accent/20 hover:bg-accent/40"
              )}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-border/70 pt-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 font-medium">
            <Droplet className="size-4 text-sky" /> Water
          </span>
          <span className="text-muted-foreground">{water} / 8 glasses</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setWater(i + 1 === water ? i : i + 1)}
              aria-label={`Set water to ${i + 1}`}
              className={cn(
                "h-6 flex-1 rounded-md transition-all duration-300",
                i < water ? "bg-sky/70" : "bg-accent/25 hover:bg-accent/40"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
