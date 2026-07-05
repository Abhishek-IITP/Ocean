"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AuthModel } from "@/components/AuthModel";
import { EASE_OUT_QUINT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type HeroCTAProps = {
  loopCount: number;
  className?: string;
};

/**
 * Gated on the loop completing its first full pass — `loopCount` flips to 1
 * right as the scene crossfades back into its calmest beat (cold open), so
 * the fade below carries a short delay rather than firing on the instant:
 * it lands inside that already-still moment instead of interrupting the
 * crossfade. Reads as the story's natural conclusion, not a timer.
 */
export function HeroCTA({ loopCount, className }: HeroCTAProps) {
  const show = loopCount >= 1;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.6, ease: EASE_OUT_QUINT }}
          className={cn(className)}
        >
          <AuthModel label="Create your space" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
