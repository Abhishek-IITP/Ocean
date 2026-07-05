"use client";

import { motion } from "framer-motion";
import { HeroStaticCopy } from "./HeroStaticCopy";
import { HeroCTA } from "./HeroCTA";
import { WorkspaceCanvas } from "./workspace/WorkspaceCanvas";
import { HeroLoopProvider } from "./HeroLoopContext";
import { useHeroLoopController } from "./useHeroLoopController";
import { describeScenario } from "@/lib/hero-scenarios";

/**
 * Mounts the single loop controller and shares it via `HeroLoopContext` so
 * `WorkspaceCanvas` (which now owns the whole staged composition — timeline,
 * launch strip, Focus/Habit/Analytics tiles, Feed lane, Tomorrow lane, loop
 * controls) can derive beat-by-beat transforms from the live `progress`
 * value (beats 1-8 wired as of Phase 4; seamless loop reset + scrub bar as
 * of Phase 5; reduced-motion crossfade as of Phase 6; CTA + accessibility
 * pass as of Phase 7; workspace-as-hero visual recomposition after that).
 * See docs/HERO_LIVING_WORKDAY.md for the frozen spec and phase plan.
 *
 * The section fills the viewport (`min-h-[100svh]`) — safe because the
 * navbar is `fixed`/floating (`NavbarChrome.tsx`) and costs no layout
 * space. A compact top zone (headline + CTA, ~20-25% of the height) is
 * followed by the workspace, which claims the rest — the product, not the
 * headline, is the thing a visitor sees first.
 */
export function HeroLivingWorkday() {
  const controller = useHeroLoopController();

  return (
    <section id="workspace" className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden px-4 pt-24 pb-12 sm:px-6 md:pt-28 md:pb-16 bg-background">
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-between">
        {/* Headline + Introduction zone: small and elegant, supporting the product */}
        <div className="max-w-xl self-start px-2 mb-2 sm:mb-4 lg:mb-0">
          <HeroStaticCopy />
        </div>

        {/* Visual hidden summary for screen readers */}
        <p className="sr-only" aria-live="off">
          {describeScenario(controller.scenario)}
        </p>

        {/* Workspace Canvas (Occupies the bulk of the height/viewport) */}
        <HeroLoopProvider value={controller}>
          <motion.div
            className="flex-1 w-full mt-4 sm:mt-6"
            style={{
              opacity: controller.prefersReducedMotion
                ? controller.reducedCrossfadeOpacity
                : controller.sceneVeilOpacity,
            }}
          >
            <WorkspaceCanvas scenario={controller.scenario} />
          </motion.div>
        </HeroLoopProvider>

        {/* Footer Loop Caption and CTA: Centered at the bottom */}
        <div className="mt-12 flex flex-col items-center justify-center text-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/80">
            The loop continues. Ocean makes every part of your day work better together.
          </p>
          <HeroCTA loopCount={controller.loopCount} className="mt-1" />
        </div>
      </div>
    </section>
  );
}
