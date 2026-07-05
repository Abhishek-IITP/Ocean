"use client";

import { cn } from "@/lib/utils";
import { HERO_BEATS, HERO_FEED_BEAT_ORDER, HERO_FEED_LAG } from "@/lib/motion";
import type { WorkdayScenario } from "@/lib/hero-scenarios";
import { useHeroLoop } from "../HeroLoopContext";
import { FeedLine } from "./FeedLine";

type CommandFeedProps = {
  scenario: WorkdayScenario;
  className?: string;
};

/**
 * The workspace's own narration lane — quiet confirmation of what the
 * visitor already saw, not a play-by-play of every internal state change.
 * Each `FeedLine` computes its own entrance/hold/fade from the shared
 * `progress` value, so at most one line is ever visible at a time (a brief
 * overlap during the fade/enter crossfade aside). Every `FeedLine` is
 * absolutely positioned to the same bottom-anchored box (see its own doc
 * comment), so they all share one fixed-height clipped tile regardless of
 * DOM order — "enter from bottom, age upward" comes from each line's own
 * `y`/opacity transform, not from flex stacking order. Lives as its own
 * independent floating surface in `WorkspaceCanvas.tsx`, not a footer.
 */
export function CommandFeed({ scenario, className }: CommandFeedProps) {
  const { progress } = useHeroLoop();

  return (
    <div className={cn("relative h-40 overflow-hidden", className)} aria-hidden="true">
      {HERO_FEED_BEAT_ORDER.map((beatKey, index) => (
        <FeedLine
          key={beatKey}
          text={scenario.feed[index]}
          appearAt={HERO_BEATS[beatKey][0] + HERO_FEED_LAG}
          progress={progress}
        />
      ))}
    </div>
  );
}
