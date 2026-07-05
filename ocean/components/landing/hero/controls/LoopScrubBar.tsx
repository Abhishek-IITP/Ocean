"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type LoopScrubBarProps = {
  progress: MotionValue<number>;
  className?: string;
};

/**
 * A thin hairline progress indicator showing loop position — not a
 * video-player control cluster, per docs/HERO_LIVING_WORKDAY.md §8.
 */
export function LoopScrubBar({ progress, className }: LoopScrubBarProps) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div
      className={cn("h-px w-full rounded-full bg-border", className)}
      aria-hidden="true"
    >
      <motion.div className="h-full rounded-full bg-foreground/30" style={{ width }} />
    </div>
  );
}
