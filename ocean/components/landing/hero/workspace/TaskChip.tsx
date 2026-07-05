"use client";

import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type TaskChipProps = {
  name: string;
  opacity?: number | MotionValue<number>;
  className?: string;
};

/** A task sitting in the backlog, waiting to be pulled onto the timeline. */
export function TaskChip({ name, opacity = 1, className }: TaskChipProps) {
  return (
    <motion.span
      className={cn(
        "inline-flex h-12 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground",
        className
      )}
      style={{ opacity }}
    >
      {name}
    </motion.span>
  );
}
