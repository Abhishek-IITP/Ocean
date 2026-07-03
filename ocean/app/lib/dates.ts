/**
 * Date helpers for per-day / per-period records.
 *
 * We normalize "day" values to UTC midnight so that a given calendar day maps
 * to a single, stable DateTime — this makes @@unique([userId, date]) reliable
 * regardless of the time a row is written.
 */

export function startOfDayUTC(d: Date = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Monday-based start of week, at UTC midnight. */
export function startOfWeekUTC(d: Date = new Date()): Date {
  const day = startOfDayUTC(d);
  const dow = day.getUTCDay(); // 0 = Sun
  const diff = (dow + 6) % 7; // days since Monday
  day.setUTCDate(day.getUTCDate() - diff);
  return day;
}

export function startOfMonthUTC(d: Date = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export function startOfYearUTC(d: Date = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
}

/** Parse a yyyy-mm-dd string to a UTC-midnight Date. */
export function parseDayKey(key: string): Date {
  const [y, m, day] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}

/** Format a Date as yyyy-mm-dd (UTC). */
export function toDayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Inclusive list of the N most recent day-start Dates ending today. */
export function lastNDaysUTC(n: number, from: Date = new Date()): Date[] {
  const end = startOfDayUTC(from);
  const days: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d);
  }
  return days;
}
