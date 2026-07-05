"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";
import {
  HERO_LOOP_DURATION,
  HERO_REDUCED_MOTION_CROSSFADE_SECONDS,
  HERO_REDUCED_MOTION_HOLD_MS,
  HERO_REDUCED_MOTION_KEYFRAMES,
} from "@/lib/motion";
import { HERO_SCENARIOS, getScenario } from "@/lib/hero-scenarios";

/**
 * The loop's `progress` value snaps from ~1 back to 0 every lap — an
 * unavoidable property of a repeating value that every clamped beat
 * transform reads. That exact instant is masked by dipping opacity in the
 * seconds just before it and recovering in the seconds just after, so the
 * dip's lowest point coincides with the snap itself rather than exposing it.
 */
const VEIL_LEAD_SECONDS = 0.3;
const VEIL_RECOVER_SECONDS = 0.3;
const VEIL_LEAD = VEIL_LEAD_SECONDS / HERO_LOOP_DURATION;
const VEIL_RECOVER = VEIL_RECOVER_SECONDS / HERO_LOOP_DURATION;
const VEIL_LOW = 0.88;

/**
 * Single source of truth for the "Living Workday" hero loop.
 *
 * Every visual beat and every Command Feed line derives its own local state
 * from the one `progress` motion value this hook owns (0→1 across the full
 * loop) via `useTransform`. That's what keeps the causal chain in sync and
 * makes pause/resume trivial: pausing this one value pauses everything
 * downstream instead of coordinating N independent animations.
 *
 * Per docs/HERO_LIVING_WORKDAY.md §8, pause must be reachable by more than
 * hover alone (WCAG 2.2.2) — callers wire `pause`/`resume`/`togglePause` to
 * pointer, focus, AND a visible control.
 */
export function useHeroLoopController() {
  const progress = useMotionValue(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const lastValueRef = useRef(0);

  // A repeating animate() wraps 1 -> 0 internally; that wrap is the loop
  // boundary, and — because the veil below is shaped to be lowest at exactly
  // that instant — also the correct, already-masked moment to rotate the
  // scenario. Watching for a large drop is cheaper and more version-stable
  // than depending on an animate() onRepeat callback.
  useMotionValueEvent(progress, "change", (latest) => {
    if (latest < lastValueRef.current - 0.5) {
      setLoopCount((count) => count + 1);
      setScenarioIndex((index) => (index + 1) % HERO_SCENARIOS.length);
    }
    lastValueRef.current = latest;
  });

  /**
   * A single, shallow veil spanning the wrap — the only moving part in the
   * reset mechanism. Dips approaching the snap and recovers just after it,
   * so opacity is continuous across the instant `progress` jumps from ~1
   * back to 0 (no pop in the veil itself), and the scenario swap above lands
   * right at the dip's lowest point rather than as a visible cut.
   */
  const sceneVeilOpacity = useTransform(progress, (latest) => {
    if (latest >= 1 - VEIL_LEAD) {
      const t = (latest - (1 - VEIL_LEAD)) / VEIL_LEAD;
      return 1 - (1 - VEIL_LOW) * t;
    }
    if (latest <= VEIL_RECOVER) {
      const t = latest / VEIL_RECOVER;
      return VEIL_LOW + (1 - VEIL_LOW) * t;
    }
    return 1;
  });

  useEffect(() => {
    if (prefersReducedMotion || isPaused) {
      controlsRef.current?.stop();
      return;
    }

    // Resume from wherever progress currently sits (never snap back to 0),
    // then hand off to an infinite loop once the first pass completes.
    const remaining = HERO_LOOP_DURATION * (1 - progress.get());
    controlsRef.current = animate(progress, [progress.get(), 1], {
      duration: remaining,
      ease: "linear",
      onComplete: () => {
        progress.set(0);
        controlsRef.current = animate(progress, [0, 1], {
          duration: HERO_LOOP_DURATION,
          ease: "linear",
          repeat: Infinity,
        });
      },
    });

    return () => controlsRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- progress is a stable MotionValue identity
  }, [isPaused, prefersReducedMotion]);

  /**
   * Reduced-motion fallback: instead of a continuous 19.6s sweep, hold on
   * one of four fixed, deliberately-composed `progress` values (see
   * `HERO_REDUCED_MOTION_KEYFRAMES`) and crossfade to the next — the same
   * "one system, same data" story told through composition, not continuous
   * motion. Reuses the exact same component tree as the animated path
   * (nothing here renders separate markup), only `progress` moves in jumps.
   */
  const reducedCrossfadeOpacity = useMotionValue(1);

  useEffect(() => {
    if (!prefersReducedMotion) return;

    let cancelled = false;
    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    progress.set(HERO_REDUCED_MOTION_KEYFRAMES[0]);
    reducedCrossfadeOpacity.set(1);

    const advance = () => {
      animate(reducedCrossfadeOpacity, 0, {
        duration: HERO_REDUCED_MOTION_CROSSFADE_SECONDS,
        onComplete: () => {
          if (cancelled) return;
          index = (index + 1) % HERO_REDUCED_MOTION_KEYFRAMES.length;
          progress.set(HERO_REDUCED_MOTION_KEYFRAMES[index]);
          if (index === 0) {
            setLoopCount((count) => count + 1);
            setScenarioIndex((i) => (i + 1) % HERO_SCENARIOS.length);
          }
          animate(reducedCrossfadeOpacity, 1, {
            duration: HERO_REDUCED_MOTION_CROSSFADE_SECONDS,
            onComplete: () => {
              if (cancelled) return;
              timeoutId = setTimeout(advance, HERO_REDUCED_MOTION_HOLD_MS);
            },
          });
        },
      });
    };

    timeoutId = setTimeout(advance, HERO_REDUCED_MOTION_HOLD_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- progress/reducedCrossfadeOpacity are stable MotionValue identities
  }, [prefersReducedMotion]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  const togglePause = useCallback(() => setIsPaused((paused) => !paused), []);

  return {
    /** 0–1 across the full loop; read via `useTransform` in child components. */
    progress,
    isPaused,
    pause,
    resume,
    togglePause,
    /** Increments each time the loop wraps; gates the CTA reveal at >= 1. */
    loopCount,
    scenario: getScenario(scenarioIndex),
    prefersReducedMotion,
    /** Apply to the whole scene (canvas + feed) to mask the loop wrap. */
    sceneVeilOpacity,
    /** Apply instead of `sceneVeilOpacity` when `prefersReducedMotion` is true. */
    reducedCrossfadeOpacity,
  };
}

export type HeroLoopController = ReturnType<typeof useHeroLoopController>;
