/**
 * Shared motion constants for the Ocean landing page.
 * Single source so easing and timing never drift between components.
 */

/** cubic-bezier(0.16, 1, 0.3, 1) — ease-out-quint. Matches `.animate-rise` in globals.css. */
export const EASE_OUT_QUINT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Full "Living Workday" loop duration in seconds, per docs/HERO_LIVING_WORKDAY.md §4. */
export const HERO_LOOP_DURATION = 19.6;

/**
 * Beat boundaries as [start, end] fractions of the loop (0–1), derived directly
 * from the frozen choreography table. Components read these instead of
 * hardcoding second offsets, so the spec stays the single source of truth.
 */
export const HERO_BEATS = {
  coldOpen: [0 / HERO_LOOP_DURATION, 2 / HERO_LOOP_DURATION],
  meetingMoves: [2 / HERO_LOOP_DURATION, 4 / HERO_LOOP_DURATION],
  reorganization: [4 / HERO_LOOP_DURATION, 6 / HERO_LOOP_DURATION],
  taskSlides: [6 / HERO_LOOP_DURATION, 8 / HERO_LOOP_DURATION],
  focusBegins: [8 / HERO_LOOP_DURATION, 10 / HERO_LOOP_DURATION],
  focusCompletes: [10 / HERO_LOOP_DURATION, 13 / HERO_LOOP_DURATION],
  aiNotices: [13 / HERO_LOOP_DURATION, 15 / HERO_LOOP_DURATION],
  tomorrowOptimizes: [15 / HERO_LOOP_DURATION, 17 / HERO_LOOP_DURATION],
  analyticsUpdate: [17 / HERO_LOOP_DURATION, 19 / HERO_LOOP_DURATION],
  reset: [19 / HERO_LOOP_DURATION, 1],
} as const satisfies Record<string, [number, number]>;

export type HeroBeatKey = keyof typeof HERO_BEATS;

/**
 * The 8 narratable beats in order, matching `WorkdayScenario.feed`'s own
 * documented ordering ("one line per beat: meetingMoves -> analyticsUpdate").
 * Excludes `coldOpen` and `reset`, which have no feed line.
 */
export const HERO_FEED_BEAT_ORDER: readonly HeroBeatKey[] = [
  "meetingMoves",
  "reorganization",
  "taskSlides",
  "focusBegins",
  "focusCompletes",
  "aiNotices",
  "tomorrowOptimizes",
  "analyticsUpdate",
] as const;

/** Feed lines trail their visual beat by this fraction of the loop, per the frozen spec. */
export const HERO_FEED_LAG = 0.4 / HERO_LOOP_DURATION;

/**
 * Numeric ease-out-quint, for `useTransform`'s `ease` option (which wants a
 * `(t: number) => number` function, not a CSS cubic-bezier array). Visually
 * equivalent to `EASE_OUT_QUINT` — the standard closed-form quint curve.
 */
export function easeOutQuint(t: number): number {
  const clamped = Math.min(Math.max(t, 0), 1);
  return 1 - Math.pow(1 - clamped, 5);
}

/**
 * The four `progress` fractions the reduced-motion fallback holds on,
 * chosen to land inside a representative moment of a beat (post-resolve,
 * mid-hold) rather than at a beat's raw start — each frame should read as
 * a deliberate composition, not an animation caught mid-transit.
 * Per docs/HERO_LIVING_WORKDAY.md Phase 6.
 */
export const HERO_REDUCED_MOTION_KEYFRAMES: readonly [number, number, number, number] = [
  0.03, // cold open — calm baseline
  HERO_BEATS.reorganization[0] + (HERO_BEATS.reorganization[1] - HERO_BEATS.reorganization[0]) * 0.5, // mid-reorganization
  0.58, // focus complete + habit tick, past their resolve into the beat's hold
  0.72, // AI suggestion visible
];

/** How long each reduced-motion keyframe holds before crossfading to the next. */
export const HERO_REDUCED_MOTION_HOLD_MS = 4000;

/** Crossfade duration (each direction) between reduced-motion keyframes. */
export const HERO_REDUCED_MOTION_CROSSFADE_SECONDS = 0.4;
