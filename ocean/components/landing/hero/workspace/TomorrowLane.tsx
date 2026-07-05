"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { HERO_BEATS, easeOutQuint } from "@/lib/motion";
import { useHeroLoop } from "../HeroLoopContext";
import { AISuggestionMark } from "./AISuggestionMark";

type TomorrowLaneProps = {
  className?: string;
};

type Segment = { left: number; width: number };

const BEFORE: readonly Segment[] = [
  { left: 8, width: 18 },
  { left: 34, width: 12 },
  { left: 58, width: 22 },
];
const AFTER: readonly Segment[] = [
  { left: 8, width: 22 },
  { left: 38, width: 18 },
  { left: 64, width: 16 },
];

const [BEAT_START, BEAT_END] = HERO_BEATS.tomorrowOptimizes;
/** Resolves in the first half of the beat, then holds still. */
const RESOLVE_END = BEAT_START + (BEAT_END - BEAT_START) * 0.5;

function pct(value: number): string {
  return `${value}%`;
}

/**
 * The greyed preview lane — the lowest, most receded tile in the workspace
 * composition (own muted surface, no attachment to the timeline's border).
 * Baseline shows an unoptimized arrangement; the "tomorrow optimizes" beat
 * (`HERO_BEATS.tomorrowOptimizes`) quietly reorders these segments — content
 * stays abstract on purpose, this lane represents a shape, not a literal
 * second schedule. Also hosts the (deliberately understated) AI-notices
 * mark from the preceding beat.
 */
/** Hooks can't be called inside a loop, so each of the (fixed) 3 segments gets its own explicit pair of calls. */
function useSegmentMotion(progress: MotionValue<number>, index: number) {
  const before = BEFORE[index];
  const after = AFTER[index];
  const left = useTransform(progress, [BEAT_START, RESOLVE_END], [pct(before.left), pct(after.left)], {
    ease: easeOutQuint,
  });
  const width = useTransform(
    progress,
    [BEAT_START, RESOLVE_END],
    [pct(before.width), pct(after.width)],
    { ease: easeOutQuint }
  );
  return { left, width };
}

export function TomorrowLane({ className }: TomorrowLaneProps) {
  const { progress } = useHeroLoop();

  const segments = [
    useSegmentMotion(progress, 0),
    useSegmentMotion(progress, 1),
    useSegmentMotion(progress, 2),
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-border/50 bg-muted/20 px-5 py-4",
        className
      )}
    >
      <span className="shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground/80">
        Tomorrow
      </span>
      <div className="relative h-3 flex-1 rounded-full bg-muted/70" aria-hidden="true">
        {segments.map((segment, index) => (
          <motion.span
            key={index}
            className="absolute inset-y-0 rounded-full bg-border"
            style={{ left: segment.left, width: segment.width }}
          />
        ))}
      </div>
      <AISuggestionMark progress={progress} className="shrink-0" />
    </div>
  );
}
