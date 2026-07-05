"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { Pause } from "lucide-react";

type FocusRingOverlayProps = {
  minutes: number;
  taskName?: string;
  /**
   * 0–100 fill value, driven by the loop's progress.
   */
  value: MotionValue<number>;
  /**
   * 0–1 — fades in a fully-drawn `text-sage-deep` ring on top of the sky
   * bar.
   */
  completionOpacity?: MotionValue<number>;
  /** Drives the one-off settle-pulse (1 -> ~1.02 -> 1) on focus-complete. */
  pulseScale?: MotionValue<number>;
  size?: number;
  stroke?: number;
  barClassName?: string;
  className?: string;
};

export function FocusRingOverlay({
  minutes,
  taskName = "Deep Work",
  value,
  completionOpacity,
  pulseScale,
  size = 110,
  stroke = 8,
  barClassName = "text-sky",
  className,
}: FocusRingOverlayProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const timerRef = useRef<HTMLSpanElement>(null);

  const dashOffset = useTransform(
    value,
    (latest) => circumference - (Math.max(0, Math.min(100, latest)) / 100) * circumference
  );

  useMotionValueEvent(value, "change", (latest) => {
    if (timerRef.current) {
      const remainingFraction = 1 - Math.min(100, Math.max(0, latest)) / 100;
      const totalSeconds = minutes * 60;
      const remainingSeconds = Math.max(0, Math.floor(totalSeconds * remainingFraction));
      const displayMins = Math.floor(remainingSeconds / 60);
      const displaySecs = remainingSeconds % 60;
      const padSecs = displaySecs < 10 ? `0${displaySecs}` : displaySecs;
      const padMins = displayMins < 10 ? `0${displayMins}` : displayMins;
      timerRef.current.textContent = `${padMins}:${padSecs}`;
    }
  });

  return (
    <motion.div
      className={cn("flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm text-center items-center", className)}
      style={pulseScale ? { scale: pulseScale } : undefined}
    >
      <div className="w-full text-left border-b border-border/40 pb-2.5 mb-3">
        <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-sage-deep">Focus Session</h4>
        <p className="text-[10px] text-muted-foreground truncate">{taskName}</p>
      </div>

      <div
        className="relative inline-flex items-center justify-center my-2"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="text-border"
            stroke="currentColor"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashOffset }}
            className={barClassName}
            stroke="currentColor"
          />
          {completionOpacity ? (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={0}
              style={{ opacity: completionOpacity }}
              className="text-sage-deep"
              stroke="currentColor"
            />
          ) : null}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span ref={timerRef} className="text-sm font-bold tabular-nums text-foreground">
            {minutes < 10 ? `0${minutes}` : minutes}:00
          </span>
          <span className="text-[7px] uppercase tracking-wider text-muted-foreground">Focused</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1 text-[9px] font-semibold text-muted-foreground/80">
        <Pause className="size-2 text-muted-foreground/60 fill-muted-foreground/40" />
        Pause
      </div>
    </motion.div>
  );
}
