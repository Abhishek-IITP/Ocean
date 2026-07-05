"use client";

import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type CalendarBlockProps = {
  title: string;
  timeRange?: string;
  /** CSS `left`/`width` values (e.g. "42%"), plain or motion-driven for animated moves. */
  left: string | MotionValue<string>;
  width: string | MotionValue<string>;
  opacity?: number | MotionValue<number>;
  className?: string;
};

/** A single calendar event sitting directly on the timeline — no card wrapper. */
export function CalendarBlock({
  title,
  timeRange,
  left,
  width,
  opacity = 1,
  className,
}: CalendarBlockProps) {
  return (
    <motion.div
      className={cn(
        "absolute top-1/2 flex h-14 -translate-y-1/2 flex-col justify-center rounded-lg border border-sky/40 bg-sky/10 px-3",
        className
      )}
      style={{ left, width, opacity }}
    >
      <span className="truncate text-[10px] font-bold text-foreground leading-tight select-none">
        {title}
      </span>
      {timeRange && (
        <span className="truncate text-[8px] text-muted-foreground/80 font-medium leading-none mt-0.5 select-none">
          {timeRange}
        </span>
      )}
    </motion.div>
  );
}
