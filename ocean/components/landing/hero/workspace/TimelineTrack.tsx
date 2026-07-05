"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { WorkdayScenario } from "@/lib/hero-scenarios";
import { DAY_START_MINUTES, DAY_SPAN_MINUTES } from "@/lib/hero-time";
import type { useTimelineMotion } from "./useTimelineMotion";
import { CalendarBlock } from "./CalendarBlock";
import { TaskChip } from "./TaskChip";
import { ConnectingLine } from "../ConnectingLine";

const TICKS = [
  { hour: 8, label: "8am" },
  { hour: 10, label: "10am" },
  { hour: 12, label: "12pm" },
  { hour: 14, label: "2pm" },
  { hour: 16, label: "4pm" },
  { hour: 18, label: "6pm" },
];

type TimelineTrackProps = {
  scenario: WorkdayScenario;
  tm: ReturnType<typeof useTimelineMotion>;
  className?: string;
};

/**
 * The architectural backbone: axis, the meeting move + reorganization, the
 * task chip traveling into the freed slot from its launch strip below the
 * band. Focus/Habit/Analytics no longer live here — they're independent
 * floating tiles composed in `WorkspaceCanvas.tsx`, which also owns the
 * single `useTimelineMotion` call this component reads via the `tm` prop
 * (docs/HERO_LIVING_WORKDAY.md, visual recomposition pass).
 */
export function TimelineTrack({ scenario, tm, className }: TimelineTrackProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        className="relative h-5 text-xs font-medium text-muted-foreground"
        aria-hidden="true"
      >
        {TICKS.map((tick, index) => {
          const percent = ((tick.hour * 60 - DAY_START_MINUTES) / DAY_SPAN_MINUTES) * 100;
          const isFirst = index === 0;
          const isLast = index === TICKS.length - 1;
          const isEdge = isFirst || isLast;
          return (
            <span
              key={tick.hour}
              className={cn("absolute top-0", !isEdge && "hidden sm:inline-block")}
              style={{
                left: `${percent}%`,
                transform: isFirst ? "none" : isLast ? "translateX(-100%)" : "translateX(-50%)",
              }}
            >
              {tick.label}
            </span>
          );
        })}
      </div>

      <div className="relative flex flex-col gap-7">
        <div className="relative h-[260px] rounded-2xl border border-border bg-card shadow-sm">
          {/* Static: Team Standup at 9:00 - 9:30 AM */}
          <CalendarBlock
            title="Team Standup"
            timeRange="9:00 - 9:30 AM"
            left="10%"
            width="12%"
            className="border-sky/30 bg-sky/5 text-sky/90 text-xs px-2.5 h-11"
          />

          {/* Dynamic Freed Slot Flash */}
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 h-14 -translate-y-1/2 rounded-lg bg-sky/20"
            style={{
              left: tm.freedSlotLeft,
              width: tm.freedSlotWidth,
              opacity: tm.freedSlotFlashOpacity,
            }}
          />

          {/* Dynamic Meeting Block (Purple/Sky) */}
          <motion.div className="absolute inset-0" style={{ y: tm.meetingArcY }}>
            <CalendarBlock
              title={scenario.meeting.title}
              timeRange={`${scenario.meeting.from} - ${scenario.meeting.to}`}
              left={tm.meetingLeft}
              width={tm.meetingWidth}
              opacity={tm.focusDimOpacity}
              className="border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400"
            />
          </motion.div>

          {/* Dynamic Adjacent Event Block */}
          <CalendarBlock
            title={scenario.adjacentEvent.title}
            timeRange={`${scenario.adjacentEvent.from} - ${scenario.adjacentEvent.to}`}
            left={tm.adjacentLeft}
            width={tm.adjacentWidth}
            opacity={tm.focusDimOpacity}
            className="hidden sm:flex border-clay/40 bg-clay/10 text-clay"
          />

          {/* Static: Client Call at 2:00 - 3:00 PM */}
          <CalendarBlock
            title="Client Call"
            timeRange="2:00 - 3:00 PM"
            left="60%"
            width="12%"
            className="border-clay/30 bg-clay/5 text-clay/90 text-xs px-3 h-11"
          />

          {/* Static: Design Review at 3:30 - 4:30 PM */}
          <CalendarBlock
            title="Design Review"
            timeRange="3:30 - 4:30 PM"
            left="75%"
            width="12%"
            className="border-sage-deep/30 bg-sage-deep/5 text-sage-deep/90 text-xs px-3 h-11"
          />
        </div>

        <div className="relative rounded-2xl border border-border bg-card p-5 shadow-sm w-[45%] max-w-[270px]">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-sage-deep">Tasks</h4>
              <p className="text-[10px] text-muted-foreground">Backlog</p>
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground/80 hover:text-foreground cursor-pointer">+ Add task</span>
          </div>
          <div className="mt-3 space-y-2">
            {/* The resting slot of the moving task chip */}
            <div className="flex h-12 items-center gap-3 rounded-lg border border-border/30 bg-muted/10 px-4 opacity-30">
              <span className="size-3.5 rounded border border-border bg-transparent" />
              <span className="text-xs font-medium text-foreground">{scenario.task.name}</span>
            </div>
            <div className="flex h-12 items-center gap-3 rounded-lg border border-border/30 bg-card px-4">
              <span className="size-3.5 rounded border border-border bg-transparent" />
              <span className="text-xs font-medium text-foreground">Content strategy</span>
              <span className="ml-auto rounded-full bg-accent/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Medium</span>
            </div>
            <div className="flex h-12 items-center gap-3 rounded-lg border border-border/30 bg-card px-4">
              <span className="size-3.5 rounded border border-border bg-transparent" />
              <span className="text-xs font-medium text-foreground">User research</span>
              <span className="ml-auto rounded-full bg-accent/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Low</span>
            </div>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden sm:block"
          style={{ opacity: tm.connectingLineOpacity }}
        >
          <ConnectingLine
            d={tm.connectingLinePath}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            progress={tm.connectingLineDraw}
            strokeDasharray="4 4"
            className="h-full w-full text-sage-deep/35"
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute"
          style={{ left: tm.taskChipLeft, top: tm.taskChipTop }}
        >
          <TaskChip name={scenario.task.name} />
        </motion.div>
      </div>
    </div>
  );
}
