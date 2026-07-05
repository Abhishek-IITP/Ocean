"use client";

import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHeroLoop } from "../HeroLoopContext";

type LoopPauseButtonProps = {
  className?: string;
};

/**
 * Always-visible pause/play control — the WCAG 2.2.2-required alternative
 * to hover-only pausing (see `useHeroLoopController`'s doc comment).
 * Positioned next to `LoopScrubBar`, never hover-revealed.
 */
export function LoopPauseButton({ className }: LoopPauseButtonProps) {
  const { isPaused, togglePause } = useHeroLoop();

  return (
    <button
      type="button"
      onClick={togglePause}
      aria-label={isPaused ? "Play the workday demo" : "Pause the workday demo"}
      aria-pressed={isPaused}
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
    </button>
  );
}
