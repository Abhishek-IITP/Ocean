"use client";

import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type HabitTickProps = {
  name: string;
  streakDay: number;
  /** 0->1 — crossfades the next segment from unfilled to `bg-sage-deep`. */
  tickOpacity?: MotionValue<number>;
  /** 1->1.15->1 settle-pop, timed alongside `tickOpacity`. */
  tickScale?: MotionValue<number>;
  className?: string;
};

const SEGMENT_COUNT = 5;
/** Segments already filled at baseline, before the day's tick lands. */
const BASELINE_FILLED = SEGMENT_COUNT - 2;

/**
 * A streak rendered as discrete dots rather than a percentage ring — a habit
 * streak is a count of days, not a continuous quantity, so the tick marks
 * read more honestly than a ring would. One segment fills per focus
 * completion (`HERO_BEATS.focusCompletes`, alongside the focus ring's own
 * sage crossfade — same beat, same "one system" moment).
 */
export function HabitTick({ name, streakDay, tickOpacity, tickScale, className }: HabitTickProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div className="flex items-center gap-1">
        {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
          const isBaselineFilled = index < BASELINE_FILLED;
          const isTickingSegment = index === BASELINE_FILLED;

          if (isBaselineFilled) {
            return <span key={index} className="size-2 rounded-full bg-sage-deep" />;
          }

          if (isTickingSegment && tickOpacity) {
            return (
              <span key={index} className="relative inline-flex size-2">
                <span className="absolute inset-0 rounded-full border border-border bg-transparent" />
                <motion.span
                  className="absolute inset-0 rounded-full bg-sage-deep"
                  style={{ opacity: tickOpacity, scale: tickScale }}
                />
              </span>
            );
          }

          return (
            <span key={index} className="size-2 rounded-full border border-border bg-transparent" />
          );
        })}
      </div>
      <span className="text-[0.65rem] text-muted-foreground">
        {name} · day {streakDay}
      </span>
    </div>
  );
}
