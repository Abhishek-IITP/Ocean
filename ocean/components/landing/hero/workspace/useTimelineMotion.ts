import { useTransform, type MotionValue } from "framer-motion";
import { HERO_BEATS, HERO_LOOP_DURATION, easeOutQuint } from "@/lib/motion";
import { timeToPercent } from "@/lib/hero-time";
import type { WorkdayScenario } from "@/lib/hero-scenarios";

/**
 * Matches the timeline band's `h-[200px]` (bumped from the original `h-16`
 * as part of the workspace-as-hero visual recomposition — architectural
 * scale, not a UI card). Focus/Habit/Analytics no longer live in the row
 * below the band (they're independent floating tiles composed in
 * `WorkspaceCanvas.tsx`), so these four numbers only describe the
 * band + launch-strip pairing the task-chip travel math depends on.
 */
const TIMELINE_BAND_HEIGHT = 260;
/** Matches the `gap-7` between the band and the launch strip. */
const ROW_GAP = 28;
/** Matches the Tasks backlog card height containing the header and three list items. */
const BACKLOG_ROW_HEIGHT = 240;
/** Matches `TaskChip`'s `h-12`. */
const CHIP_HEIGHT = 48;
const CONTAINER_HEIGHT = TIMELINE_BAND_HEIGHT + ROW_GAP + BACKLOG_ROW_HEIGHT;

/** A small indent under the "Backlog" label — the chip's resting spot before it travels. */
const RESTING_CHIP_LEFT_PERCENT = 8;
const RESTING_CHIP_TOP = TIMELINE_BAND_HEIGHT + ROW_GAP + 64;
const TIMELINE_CHIP_TOP = (TIMELINE_BAND_HEIGHT - CHIP_HEIGHT) / 2;

/** 80ms stagger behind the reorganization beat's own start, per the frozen spec. */
const ADJACENT_STAGGER = 0.08 / HERO_LOOP_DURATION;

function pct(value: number): string {
  return `${value}%`;
}

function px(value: number): string {
  return `${value}px`;
}

/**
 * Derives every beat-1-4 transform (meeting move, reorganization, task
 * slide, focus begins) from the loop's shared `progress` value. Colocated
 * here rather than inline in `TimelineTrack` to keep that component's JSX
 * declarative, per CLAUDE.md's file-size guidance.
 */
export function useTimelineMotion(scenario: WorkdayScenario, progress: MotionValue<number>) {
  const [meetingStart, meetingEnd] = HERO_BEATS.meetingMoves;
  const [reorgStart, reorgEnd] = HERO_BEATS.reorganization;
  const [slideStart, slideEnd] = HERO_BEATS.taskSlides;
  const [focusStart, focusEnd] = HERO_BEATS.focusBegins;
  const [completeStart, completeEnd] = HERO_BEATS.focusCompletes;
  const [analyticsStart, analyticsEnd] = HERO_BEATS.analyticsUpdate;

  const meetingOriginalLeft = timeToPercent(scenario.meeting.from);
  const meetingOriginalWidth = timeToPercent(scenario.meeting.to) - meetingOriginalLeft;
  const meetingNewLeft = timeToPercent(scenario.meetingNew.from);
  const meetingNewWidth = timeToPercent(scenario.meetingNew.to) - meetingNewLeft;

  const meetingLeft = useTransform(
    progress,
    [meetingStart, meetingEnd],
    [pct(meetingOriginalLeft), pct(meetingNewLeft)],
    { ease: easeOutQuint }
  );
  const meetingWidth = useTransform(
    progress,
    [meetingStart, meetingEnd],
    [pct(meetingOriginalWidth), pct(meetingNewWidth)],
    { ease: easeOutQuint }
  );
  // The "detach, arc, settle" feel: a small lift mid-beat, back to rest at the end.
  const meetingArcY = useTransform(
    progress,
    [meetingStart, (meetingStart + meetingEnd) / 2, meetingEnd],
    [0, -8, 0],
    { ease: [easeOutQuint, easeOutQuint] }
  );

  const adjacentOriginalLeft = timeToPercent(scenario.adjacentEvent.from);
  const adjacentWidth = timeToPercent(scenario.adjacentEvent.to) - adjacentOriginalLeft;
  const adjacentShiftedLeft = timeToPercent(scenario.adjacentEvent.shiftedFrom);
  const adjacentStart = reorgStart + ADJACENT_STAGGER;
  const adjacentLeft = useTransform(
    progress,
    [adjacentStart, reorgEnd],
    [pct(adjacentOriginalLeft), pct(adjacentShiftedLeft)],
    { ease: easeOutQuint }
  );

  const reorgMid = reorgStart + (reorgEnd - reorgStart) * 0.5;
  const freedSlotFlashOpacity = useTransform(progress, [reorgStart, reorgMid, reorgEnd], [0, 0.35, 0]);

  // 0.7 rather than a deeper dim — enough to read as "receded" while keeping
  // the dimmed chip title text at ~5:1 contrast (WCAG AA) against its box.
  const focusDimOpacity = useTransform(progress, [focusStart, focusEnd], [1, 0.7]);
  const focusRingValue = useTransform(progress, [focusStart, focusEnd], [0, 100], { ease: easeOutQuint });

  const freedSlotLeft = timeToPercent(scenario.freedSlot.from);
  const freedSlotWidth = timeToPercent(scenario.freedSlot.to) - freedSlotLeft;

  const taskChipLeft = useTransform(
    progress,
    [slideStart, slideEnd],
    [pct(RESTING_CHIP_LEFT_PERCENT), pct(freedSlotLeft)],
    { ease: easeOutQuint }
  );
  const taskChipTop = useTransform(
    progress,
    [slideStart, slideEnd],
    [px(RESTING_CHIP_TOP), px(TIMELINE_CHIP_TOP)],
    { ease: easeOutQuint }
  );

  const slideMid = slideStart + (slideEnd - slideStart) * 0.5;
  const connectingLineDraw = useTransform(progress, [slideStart, slideMid], [0, 1]);
  const connectingLineOpacity = useTransform(progress, [slideMid, slideEnd], [1, 0]);
  const connectingLinePath = `M ${RESTING_CHIP_LEFT_PERCENT} ${(RESTING_CHIP_TOP / CONTAINER_HEIGHT) * 100} C ${(RESTING_CHIP_LEFT_PERCENT + freedSlotLeft) / 2} ${(RESTING_CHIP_TOP / CONTAINER_HEIGHT) * 100}, ${(RESTING_CHIP_LEFT_PERCENT + freedSlotLeft) / 2} ${(TIMELINE_CHIP_TOP / CONTAINER_HEIGHT) * 100}, ${freedSlotLeft} ${(TIMELINE_CHIP_TOP / CONTAINER_HEIGHT) * 100}`;

  // Beat 5 (focus completes): resolves in the first ~20% of the beat, then
  // holds genuinely still for the rest — the longest hold in the loop, the
  // moment the visitor needs a breath to register the "one system" landing.
  const completeResolveEnd = completeStart + (completeEnd - completeStart) * 0.2;
  const completeMid = completeStart + (completeResolveEnd - completeStart) * 0.5;
  const ringCompletionOpacity = useTransform(progress, [completeStart, completeResolveEnd], [0, 1]);
  const ringPulseScale = useTransform(
    progress,
    [completeStart, completeMid, completeResolveEnd],
    [1, 1.02, 1],
    { ease: [easeOutQuint, easeOutQuint] }
  );
  const habitTickOpacity = useTransform(progress, [completeStart, completeResolveEnd], [0, 1]);
  const habitTickScale = useTransform(
    progress,
    [completeStart, completeMid, completeResolveEnd],
    [1, 1.15, 1],
    { ease: [easeOutQuint, easeOutQuint] }
  );

  // Beat 8 (analytics update): draw + count-up resolve in the first half of
  // the beat, then the final number holds still through the rest and reset.
  const analyticsResolveEnd = analyticsStart + (analyticsEnd - analyticsStart) * 0.5;
  const sparklineDraw = useTransform(progress, [analyticsStart, analyticsResolveEnd], [0, 1], {
    ease: easeOutQuint,
  });
  const sparklineCountUp = useTransform(
    progress,
    [analyticsStart, analyticsResolveEnd],
    [0, scenario.analytics.deltaPercent],
    { ease: easeOutQuint }
  );

  return {
    meetingLeft,
    meetingWidth,
    meetingArcY,
    adjacentLeft,
    adjacentWidth: pct(adjacentWidth),
    freedSlotLeft: pct(freedSlotLeft),
    freedSlotWidth: pct(freedSlotWidth),
    freedSlotFlashOpacity,
    focusDimOpacity,
    focusRingValue,
    taskChipLeft,
    taskChipTop,
    connectingLineDraw,
    connectingLineOpacity,
    connectingLinePath,
    ringCompletionOpacity,
    ringPulseScale,
    habitTickOpacity,
    habitTickScale,
    sparklineDraw,
    sparklineCountUp,
  };
}
