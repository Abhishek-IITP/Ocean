"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type AnalyticsSparklineProps = {
  label: string;
  deltaPercent: number;
  /** 0->1 pathLength — draws the sparkline in step with the beat. */
  draw: MotionValue<number>;
  /** 0->`deltaPercent` — the count-up value; rounded and written directly into the DOM so it updates without a jump-cut. */
  countUp: MotionValue<number>;
  className?: string;
};

const SPARK_PATH = "M0 22 L12 16 L24 18 L36 8 L48 10 L60 0";

/**
 * A small inline sparkline + count-up number — styled as a premium dashboard card.
 */
export function AnalyticsSparkline({ label, deltaPercent, draw, countUp, className }: AnalyticsSparklineProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(countUp, "change", (latest) => {
    const rounded = Math.min(Math.round(latest), deltaPercent);
    if (textRef.current) textRef.current.textContent = `+${rounded}%`;
  });

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <div className="flex items-baseline gap-2">
        <span ref={textRef} className="text-2xl font-bold tabular-nums text-foreground">
          +0%
        </span>
        <span className="text-[9px] font-semibold text-sage-deep/90">+12% vs yesterday</span>
      </div>
      <div className="flex items-center gap-3 w-full">
        <svg width={60} height={24} viewBox="0 0 60 24" className="overflow-visible text-sky" aria-hidden="true">
          <motion.path
            d={SPARK_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{ pathLength: draw }}
          />
        </svg>
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
