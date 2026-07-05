"use client";

import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type ConnectingLineProps = {
  /** SVG path data in the coordinate space of `viewBox`. */
  d: string;
  viewBox: string;
  progress: number | MotionValue<number>;
  className?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  /** Defaults to the SVG spec default (`xMidYMid meet`); pass "none" to stretch x/y independently when `d` uses an abstract (non-aspect-matched) coordinate space. */
  preserveAspectRatio?: string;
};

/**
 * Shared stroke-draw-on primitive — the only "line" vocabulary the hero uses
 * (task-slide connector, AI-suggestion trace). `pathLength` maps to
 * stroke-dasharray/-offset under the hood, so this stays a transform-only
 * animation with no layout cost.
 */
export function ConnectingLine({
  d,
  viewBox,
  progress,
  className,
  strokeWidth = 1.5,
  strokeDasharray,
  preserveAspectRatio,
}: ConnectingLineProps) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={cn("overflow-visible", className)}
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d={d}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        style={{ pathLength: progress }}
      />
    </svg>
  );
}
