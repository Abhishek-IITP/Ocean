/**
 * Shared day-timeline math for the "Living Workday" hero, so `TimelineTrack`
 * and `useTimelineMotion` convert times to percent the same way.
 */

const DAY_START_HOUR = 8;

export const DAY_START_MINUTES = DAY_START_HOUR * 60;
export const DAY_END_MINUTES = 18 * 60;
export const DAY_SPAN_MINUTES = DAY_END_MINUTES - DAY_START_MINUTES;

/**
 * Scenario times are informal 12-hour clock without an am/pm marker (e.g.
 * "2:15" meaning 2:15pm) — any raw hour earlier than the workday's 8am start
 * can only mean the afternoon, so it gets bumped by 12.
 */
export function timeToMinutes(time: string): number {
  const [rawHours, minutes] = time.split(":").map(Number);
  const hours = rawHours < DAY_START_HOUR ? rawHours + 12 : rawHours;
  return hours * 60 + minutes;
}

export function timeToPercent(time: string): number {
  return ((timeToMinutes(time) - DAY_START_MINUTES) / DAY_SPAN_MINUTES) * 100;
}
