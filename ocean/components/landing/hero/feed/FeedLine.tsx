"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { HERO_LOOP_DURATION, easeOutQuint } from "@/lib/motion";

type FeedLineProps = {
  text: string;
  /** 0-1 progress fraction at which this line first appears. */
  appearAt: number;
  progress: MotionValue<number>;
};

/** Quick rise-in — long enough to read as a soft entrance, not a snap. */
const ENTER_SECONDS = 0.3;
/**
 * Short hold before fading — quiet confirmation, not a running transcript.
 * Sized so the line is fully gone before the next one enters, leaving real
 * silence in between rather than a fade always in flight.
 */
const HOLD_SECONDS = 1.4;
const FADE_SECONDS = 1.0;

/**
 * A single Command Feed line. Computes its own opacity/rise entirely from
 * the shared loop `progress` — no mount/unmount timers, no manual reset:
 * because `progress` restarts at 0 each loop and `appearAt` is always > 0,
 * every line's motion values clamp back to invisible for free at loop start.
 *
 * Absolutely positioned (bottom-anchored) rather than a normal flex child:
 * all 8 lines share the exact same box regardless of which one is
 * currently opaque, so the parent can be a small fixed-height clipped tile
 * without most lines landing outside its visible window.
 */
export function FeedLine({ text, appearAt, progress }: FeedLineProps) {
  const enter = ENTER_SECONDS / HERO_LOOP_DURATION;
  const fadeStart = appearAt + (ENTER_SECONDS + HOLD_SECONDS) / HERO_LOOP_DURATION;
  const fadeEnd = fadeStart + FADE_SECONDS / HERO_LOOP_DURATION;

  const opacity = useTransform(
    progress,
    [appearAt, appearAt + enter, fadeStart, fadeEnd],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [appearAt, appearAt + enter], [8, 0], { ease: easeOutQuint });

  return (
    <motion.p
      className="absolute inset-x-0 bottom-0 text-lg leading-snug text-foreground/85 md:text-xl"
      style={{ opacity, y }}
    >
      {text}
    </motion.p>
  );
}
