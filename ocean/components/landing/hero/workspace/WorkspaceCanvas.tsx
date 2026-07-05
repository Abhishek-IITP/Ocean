"use client";

import { cn } from "@/lib/utils";
import type { WorkdayScenario } from "@/lib/hero-scenarios";
import { useHeroLoop } from "../HeroLoopContext";
import { useTimelineMotion } from "./useTimelineMotion";
import { TimelineTrack } from "./TimelineTrack";
import { TomorrowLane } from "./TomorrowLane";
import { FocusRingOverlay } from "./FocusRingOverlay";
import { HabitTick } from "./HabitTick";
import { AnalyticsSparkline } from "./AnalyticsSparkline";
import { CommandFeed } from "../feed/CommandFeed";
import { LoopScrubBar } from "../controls/LoopScrubBar";
import { LoopPauseButton } from "../controls/LoopPauseButton";
import { 
  Sparkles, 
  Calendar, 
  CheckSquare, 
  Target, 
  Flame as FlameIcon, 
  FileText, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { OceanMark } from "@/components/Logo";

type WorkspaceCanvasProps = {
  scenario: WorkdayScenario;
  className?: string;
};

/**
 * Redesigned Workspace stage — composed as a 3D tilted desk workspace with a sidebar,
 * populated calendar events, and overlapping floating cards.
 */
export function WorkspaceCanvas({ scenario, className }: WorkspaceCanvasProps) {
  const { pause, resume, progress } = useHeroLoop();
  const tm = useTimelineMotion(scenario, progress);

  return (
    <div
      className={cn("relative w-full sm:h-[720px] md:h-[820px] lg:h-[900px]", className)}
      onPointerEnter={pause}
      onPointerLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      {/* 3D Tilted Desk Surface (The base dashboard canvas) */}
      <div 
        className="static sm:absolute sm:inset-x-0 sm:top-0 sm:bottom-12 sm:[transform:perspective(2000px)_rotateX(10deg)_rotateY(-6deg)_rotateZ(-2deg)] sm:[transform-style:preserve-3d] rounded-[2rem] border border-border bg-[#fcfbf8] p-6 shadow-sm flex flex-row"
      >
        {/* Sidebar Left Column */}
        <div className="hidden sm:flex sm:flex-col sm:w-[16%] border-r border-border/40 pr-4 space-y-8 select-none">
          <div className="flex items-center gap-2">
            <OceanMark className="size-5.5 text-foreground" />
            <span className="font-serif text-base font-bold text-foreground">Ocean</span>
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { label: "Day", icon: Calendar, active: true },
              { label: "Tasks", icon: CheckSquare, active: false },
              { label: "Focus", icon: Target, active: false },
              { label: "Habits", icon: FlameIcon, active: false },
              { label: "Notes", icon: FileText, active: false },
              { label: "Insights", icon: BarChart3, active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors duration-300",
                  item.active 
                    ? "bg-accent/60 text-sage-deep" 
                    : "text-muted-foreground hover:bg-accent/20 hover:text-foreground cursor-pointer"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Dashboard Area (Timeline + floating widgets) */}
        <div className="flex-1 flex flex-col pl-6">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
              <ChevronLeft className="size-4 cursor-pointer hover:text-foreground" />
              <span className="text-foreground font-bold">Today</span>
              <span className="text-muted-foreground/80">&middot; Wed, 24 Apr</span>
              <ChevronRight className="size-4 cursor-pointer hover:text-foreground" />
            </div>
          </div>

          {/* Timeline Track Backbone */}
          <div className="w-full sm:w-[60%] md:w-[62%] lg:w-[64%]">
            <TimelineTrack scenario={scenario} tm={tm} />
          </div>
        </div>

        {/* Overlapping Focus Session card */}
        <div className="static mt-6 w-full max-w-[220px] sm:absolute sm:mt-0 sm:left-[44%] sm:top-[330px] sm:w-[200px] md:left-[45%] md:top-[350px] lg:left-[46%] lg:top-[390px] lg:w-[230px]">
          <FocusRingOverlay
            minutes={scenario.focus.minutes}
            taskName={scenario.task.name}
            value={tm.focusRingValue}
            completionOpacity={tm.ringCompletionOpacity}
            pulseScale={tm.ringPulseScale}
            size={110}
            stroke={8}
          />
        </div>

        {/* Overlapping Habits Checklist Card */}
        <div className="static mt-4 w-full max-w-[220px] rounded-2xl border border-border bg-card p-5 shadow-sm sm:absolute sm:mt-0 sm:left-[66%] sm:top-[4%] sm:w-[190px] md:left-[68%] lg:left-[70%] lg:top-[6%] lg:w-[220px]">
          <div className="w-full text-left border-b border-border/40 pb-2.5 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-sage-deep">Habits</h4>
            <p className="text-[10px] text-muted-foreground">Daily Progress</p>
          </div>
          <div className="flex flex-col gap-3">
            <HabitTick
              name={scenario.habit.name}
              streakDay={scenario.habit.streakDay}
              tickOpacity={tm.habitTickOpacity}
              tickScale={tm.habitTickScale}
              className="items-start"
            />
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-sage-deep" />
                <span className="size-2 rounded-full bg-sage-deep" />
                <span className="size-2 rounded-full bg-sage-deep" />
                <span className="size-2 rounded-full border border-border bg-transparent" />
                <span className="size-2 rounded-full border border-border bg-transparent" />
              </div>
              <span className="text-[10px] text-muted-foreground">Exercise &middot; day 4</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-sage-deep" />
                <span className="size-2 rounded-full border border-border bg-transparent" />
                <span className="size-2 rounded-full border border-border bg-transparent" />
                <span className="size-2 rounded-full border border-border bg-transparent" />
                <span className="size-2 rounded-full border border-border bg-transparent" />
              </div>
              <span className="text-[10px] text-muted-foreground">Read &middot; day 1</span>
            </div>
          </div>
        </div>

        {/* Overlapping Analytics Card */}
        <div className="static mt-4 w-full max-w-[220px] rounded-2xl border border-border bg-card p-5 shadow-sm sm:absolute sm:mt-0 sm:left-[66%] sm:top-[300px] sm:w-[190px] md:left-[68%] md:top-[330px] lg:left-[70%] lg:top-[370px] lg:w-[220px]">
          <div className="w-full text-left border-b border-border/40 pb-2.5 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-sage-deep">Insights</h4>
            <p className="text-[10px] text-muted-foreground">Productivity</p>
          </div>
          <AnalyticsSparkline
            label={scenario.analytics.label}
            deltaPercent={scenario.analytics.deltaPercent}
            draw={tm.sparklineDraw}
            countUp={tm.sparklineCountUp}
            className="items-start"
          />
        </div>

        {/* Tomorrow Lane at the bottom */}
        <div className="static mt-4 w-full sm:absolute sm:left-[22%] sm:top-[560px] sm:w-[42%] md:top-[640px] lg:top-[720px] lg:w-[44%]">
          <TomorrowLane />
        </div>

        {/* AI Planner Card at the bottom-right */}
        <div className="static mt-4 w-full max-w-[220px] rounded-2xl border border-border bg-card p-5 shadow-sm sm:absolute sm:mt-0 sm:left-[66%] sm:top-[560px] sm:w-[190px] md:left-[68%] md:top-[640px] lg:left-[70%] lg:top-[720px] lg:w-[220px]">
          <div className="w-full text-left border-b border-border/40 pb-2.5 mb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-3 text-sage-deep" />
              <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-sage-deep">AI Planner</h4>
            </div>
            <p className="text-[10px] text-muted-foreground">Tomorrow optimized</p>
          </div>
          <p className="text-[11px] font-medium text-foreground leading-relaxed text-left">
            {scenario.tomorrow.summary === "adjusted around it" 
              ? "Mornings are your peak focus. Tomorrow's calendar reorganized to protect a 3-hour deep work block."
              : scenario.tomorrow.summary === "opened an earlier writing block"
              ? "Writing focus detected. Reordered morning slot to start writing block immediately after standup."
              : "Short focus blocks work best. Shifted secondary task into late afternoon buffer hour."}
          </p>
        </div>
      </div>

      {/* Command Feed: Far right overlay (keeps flat for readability) */}
      <div className="static mt-6 w-full rounded-2xl border border-border bg-card px-5 py-4 shadow-sm sm:absolute sm:mt-0 sm:right-[1%] sm:top-[8%] sm:w-[240px] md:right-[2%] md:w-[260px] lg:w-[280px]">
        <div className="w-full text-left border-b border-border/40 pb-2 mb-2.5 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-sage-deep">Ocean &middot; Live</h4>
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <CommandFeed scenario={scenario} />
      </div>

      {/* Loop controls — positioned flat at the bottom center of the stage */}
      <div className="static mt-6 flex w-full items-center gap-3 sm:absolute sm:mt-0 sm:bottom-[-20px] sm:left-[8%] sm:w-[50%] md:left-[10%] lg:left-[12%] lg:w-[52%]">
        <LoopScrubBar progress={progress} className="flex-1" />
        <LoopPauseButton />
      </div>
    </div>
  );
}
