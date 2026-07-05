"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { HERO_BEATS, easeOutQuint } from "@/lib/motion";

type AISuggestionMarkProps = {
  progress: MotionValue<number>;
  className?: string;
};

const [BEAT_START, BEAT_END] = HERO_BEATS.aiNotices;
/** Resolves in the first half of the beat, then holds — no lingering motion. */
const RESOLVE_END = BEAT_START + (BEAT_END - BEAT_START) * 0.5;
/** Capped well under full strength — the quietest entrance in the loop, never a callout. */
const MAX_OPACITY = 0.7;

/**
 * A small clay dot + underline beside the Tomorrow lane — the one on-canvas
 * trace of the "AI notices a pattern" beat. Deliberately minimal: no
 * connecting line, no scale pop, opacity capped short of full strength. This
 * should read as an invisible continuation of the workday, not a feature
 * reveal — the narration for what was noticed lives only in the Command
 * Feed, never duplicated here.
 */
export function AISuggestionMark({ progress, className }: AISuggestionMarkProps) {
  const opacity = useTransform(progress, [BEAT_START, RESOLVE_END], [0, MAX_OPACITY], {
    ease: easeOutQuint,
  });

  return (
    <motion.div
      aria-hidden="true"
      className={cn("flex items-center gap-1.5", className)}
      style={{ opacity }}
    >
      <span className="size-1.5 rounded-full bg-clay" />
      <span className="h-px w-4 bg-clay" />
    </motion.div>
  );
}
