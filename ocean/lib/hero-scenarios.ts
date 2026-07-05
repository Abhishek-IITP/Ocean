/**
 * Content pool for the "Living Workday" hero loop (docs/HERO_LIVING_WORKDAY.md).
 * One scenario drives both the workspace visuals and the Command Feed copy for
 * a single loop pass, so the two never fall out of sync with each other.
 *
 * The loop controller rotates to the next scenario on every repeat, which is
 * what keeps consecutive passes from feeling like an identical robotic replay.
 */

export type TimeRange = { from: string; to: string };

export type WorkdayScenario = {
  id: string;
  /** The meeting's original slot — vacated during the "meeting moves" beat. */
  meeting: TimeRange & { title: string };
  /** Where the meeting relocates to. */
  meetingNew: TimeRange;
  /** A separate block elsewhere on the day that shifts earlier during "reorganization". */
  adjacentEvent: TimeRange & { title: string; shiftedFrom: string; shiftedTo: string };
  /** Exactly the meeting's vacated footprint — where the task, then focus session, lands. */
  freedSlot: TimeRange;
  task: { name: string };
  focus: { minutes: number };
  habit: { name: string; streakDay: number };
  aiInsight: string;
  tomorrow: { summary: string };
  analytics: { label: string; deltaPercent: number };
  /** One line per beat, in order: meetingMoves → analyticsUpdate (8 beats). */
  feed: readonly [string, string, string, string, string, string, string, string];
};

export const HERO_SCENARIOS: readonly WorkdayScenario[] = [
  {
    id: "design-sync",
    meeting: { from: "2:15", to: "3:05", title: "Design sync" },
    meetingNew: { from: "3:05", to: "3:55" },
    adjacentEvent: {
      title: "Client call",
      from: "4:30",
      to: "5:00",
      shiftedFrom: "4:15",
      shiftedTo: "4:45",
    },
    freedSlot: { from: "2:15", to: "3:05" },
    task: { name: "Draft proposal" },
    focus: { minutes: 50 },
    habit: { name: "Deep work", streakDay: 12 },
    aiInsight: "mornings are your best focus hours",
    tomorrow: { summary: "adjusted around it" },
    analytics: { label: "This week's focus time", deltaPercent: 18 },
    feed: [
      "2:15 meeting moved to 3:00.",
      "Schedule reorganized to close the gap.",
      "Deep work block filled the open hour.",
      "Focus session started — 50 minutes.",
      "Focus session complete. Streak: day 12.",
      "A pattern noticed: mornings are your best focus hours.",
      "Tomorrow's schedule adjusted around it.",
      "This week's focus time: up 18%.",
    ],
  },
  {
    id: "client-review",
    meeting: { from: "10:30", to: "11:10", title: "Client review" },
    meetingNew: { from: "11:10", to: "11:50" },
    adjacentEvent: {
      title: "Team sync",
      from: "1:30",
      to: "2:00",
      shiftedFrom: "1:15",
      shiftedTo: "1:45",
    },
    freedSlot: { from: "10:30", to: "11:10" },
    task: { name: "Prep launch notes" },
    focus: { minutes: 40 },
    habit: { name: "Writing", streakDay: 27 },
    aiInsight: "you focus longest right after standups",
    tomorrow: { summary: "opened an earlier writing block" },
    analytics: { label: "Tasks completed on time", deltaPercent: 24 },
    feed: [
      "10:30 meeting moved to 11:15.",
      "Schedule reorganized to close the gap.",
      "Launch notes filled the open hour.",
      "Focus session started — 40 minutes.",
      "Focus session complete. Streak: day 27.",
      "A pattern noticed: you focus longest right after standups.",
      "Tomorrow's schedule opened an earlier writing block.",
      "Tasks completed on time: up 24%.",
    ],
  },
  {
    id: "team-standup",
    meeting: { from: "9:00", to: "9:35", title: "Team standup" },
    meetingNew: { from: "9:35", to: "10:10" },
    adjacentEvent: {
      title: "Code review",
      from: "11:00",
      to: "11:30",
      shiftedFrom: "10:45",
      shiftedTo: "11:15",
    },
    freedSlot: { from: "9:00", to: "9:35" },
    task: { name: "Review pull requests" },
    focus: { minutes: 35 },
    habit: { name: "Code review", streakDay: 8 },
    aiInsight: "short focus blocks work best before lunch",
    tomorrow: { summary: "added a short block before lunch" },
    analytics: { label: "Review turnaround", deltaPercent: 15 },
    feed: [
      // Own supplementary scenario (not the frozen canonical copy) — adjusted
      // from an original "standup shortened" framing to a "moved" framing so
      // every rotation shares one visual grammar (position change, not resize).
      "9:00 meeting moved to 9:35.",
      "Schedule reorganized to close the gap.",
      "Pull request review filled the open time.",
      "Focus session started — 35 minutes.",
      "Focus session complete. Streak: day 8.",
      "A pattern noticed: short focus blocks work best before lunch.",
      "Tomorrow's schedule added a short block before lunch.",
      "Review turnaround: up 15%.",
    ],
  },
] as const;

export function getScenario(index: number): WorkdayScenario {
  return HERO_SCENARIOS[index % HERO_SCENARIOS.length];
}

/**
 * A single visually-hidden summary for screen readers (docs/HERO_LIVING_WORKDAY.md
 * §8): reuses the already-authored feed lines instead of re-deriving new
 * copy from the raw fields, so the two never drift out of sync.
 */
export function describeScenario(scenario: WorkdayScenario): string {
  return `Animated demonstration of a workday reorganizing itself: ${scenario.feed.join(" ")}`;
}
