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
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Calendar, 
  CheckSquare, 
  Target, 
  Flame as FlameIcon, 
  FileText, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Wifi,
  Battery
} from "lucide-react";
import { OceanMark } from "@/components/Logo";

type WorkspaceCanvasProps = {
  scenario: WorkdayScenario;
  className?: string;
};

export function WorkspaceCanvas({ scenario, className }: WorkspaceCanvasProps) {
  const { pause, resume, progress } = useHeroLoop();
  const tm = useTimelineMotion(scenario, progress);

  return (
    <div
      className={cn("relative w-full", className)}
      onPointerEnter={pause}
      onPointerLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      {/* ========================================================
          1. DESKTOP VIEW (>= 1024px): 3D Staggered Assembly Desk Mockup
          ======================================================== */}
      <div className="hidden lg:flex lg:relative lg:w-full lg:h-[880px]">
        {/* Tilted Desk Surface: Assembles from scale/skew depth */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.88, rotateX: 0, rotateY: 0, rotateZ: 0 }}
          animate={{ opacity: 1, scale: 1, rotateX: 10, rotateY: -6, rotateZ: -2 }}
          transition={{ type: "spring", stiffness: 45, damping: 14, mass: 1.1, delay: 0.1 }}
          style={{ transformStyle: "preserve-3d" }}
          className="absolute inset-x-0 top-0 bottom-12 rounded-[2rem] border border-border bg-[#fcfbf8] dark:bg-card p-6 shadow-sm flex flex-row"
        >
          {/* Sidebar Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.45 }}
            className="flex flex-col w-[16%] border-r border-border/40 pr-4 space-y-8 select-none"
          >
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
                      ? "bg-accent/60 text-sage-deep dark:bg-sage-deep/15 dark:text-sage-deep" 
                      : "text-muted-foreground hover:bg-accent/20 hover:text-foreground cursor-pointer"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>
          </motion.div>

          {/* Main Dashboard Area (Timeline) */}
          <div className="flex-1 flex flex-col pl-6">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.5 }}
              className="flex items-center justify-between pb-4"
            >
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <ChevronLeft className="size-4 cursor-pointer hover:text-foreground" />
                <span className="text-foreground font-bold">Today</span>
                <span className="text-muted-foreground/80">&middot; Wed, 24 Apr</span>
                <ChevronRight className="size-4 cursor-pointer hover:text-foreground" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scaleY: 0.8, originY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.6 }}
              className="w-[64%]"
            >
              <TimelineTrack scenario={scenario} tm={tm} />
            </motion.div>
          </div>

          {/* Overlapping Focus Session card: Flies in from high Z depth and right side */}
          <motion.div 
            initial={{ opacity: 0, x: 120, scale: 0.7, rotate: 12 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 14, mass: 1, delay: 0.75 }}
            className="absolute left-[46%] top-[390px] w-[230px] z-20"
          >
            <FocusRingOverlay
              minutes={scenario.focus.minutes}
              taskName={scenario.task.name}
              value={tm.focusRingValue}
              completionOpacity={tm.ringCompletionOpacity}
              pulseScale={tm.ringPulseScale}
              size={110}
              stroke={8}
            />
          </motion.div>

          {/* Overlapping Habits Checklist Card: Stagger-assembly floats from top-right */}
          <motion.div 
            initial={{ opacity: 0, y: -100, scale: 0.75, rotate: -8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 13, delay: 0.9 }}
            className="absolute left-[70%] top-[6%] w-[220px] rounded-2xl border border-border bg-card p-5 shadow-sm z-10"
          >
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
          </motion.div>

          {/* Overlapping Analytics Card: Assembly rises from bottom */}
          <motion.div 
            initial={{ opacity: 0, y: 80, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 55, damping: 15, delay: 1.05 }}
            className="absolute left-[70%] top-[370px] w-[220px] rounded-2xl border border-border bg-card p-5 shadow-sm z-10"
          >
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
          </motion.div>

          {/* Tomorrow Lane: Fades and slides forward */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 16, delay: 1.2 }}
            className="absolute left-[22%] top-[720px] w-[44%]"
          >
            <TomorrowLane />
          </motion.div>

          {/* AI Planner Card: Rises and angles slightly into layout */}
          <motion.div 
            initial={{ opacity: 0, y: 120, scale: 0.85, rotate: 6 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 45, damping: 13, delay: 1.35 }}
            className="absolute left-[70%] top-[720px] w-[220px] rounded-2xl border border-border bg-card p-5 shadow-sm z-20"
          >
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
          </motion.div>
        </motion.div>

        {/* Command Feed (Overlay): Slides out from side */}
        <motion.div 
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 14, delay: 1.5 }}
          className="absolute right-[2%] top-[8%] w-[280px] rounded-2xl border border-border bg-card px-5 py-4 shadow-sm z-30"
        >
          <div className="w-full text-left border-b border-border/40 pb-2 mb-2.5 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-sage-deep">Ocean &middot; Live</h4>
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <CommandFeed scenario={scenario} />
        </motion.div>

        {/* Loop controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: 1.65 }}
          className="absolute bottom-[-20px] left-[12%] w-[52%] flex items-center gap-3 z-30"
        >
          <LoopScrubBar progress={progress} className="flex-1" />
          <LoopPauseButton />
        </motion.div>
      </div>

      {/* ========================================================
          2. CRAZY MOBILE/TABLET VIEW (< 1024px): 
             3D Floating Perspective Smartphone Mockup (Optimized Overlap)
          ======================================================== */}
      <div className="lg:hidden w-full flex flex-col items-center justify-center py-6 select-none overflow-visible">
        
        {/* Viewport Scaler Wrapper: Prevents layout clipping on narrow displays */}
        <div className="scale-[0.78] min-[380px]:scale-[0.88] min-[420px]:scale-[0.98] sm:scale-100 origin-center transition-transform duration-300 relative w-[340px] h-[640px] flex items-center justify-center overflow-visible">
          
          {/* A. 3D Tilted Smartphone Frame Container */}
          <div 
            className="absolute w-[270px] h-[550px] rounded-[3rem] border-[7px] border-foreground dark:border-zinc-800 bg-[#fcfbf8] dark:bg-card shadow-2xl flex flex-col overflow-hidden [transform:perspective(1500px)_rotateX(15deg)_rotateY(6deg)_rotateZ(3deg)] [transform-style:preserve-3d] select-none"
          >
            {/* Phone Screen Status Bar */}
            <div className="flex items-center justify-between px-6 pt-3 pb-1 border-b border-border/20 text-muted-foreground/60 select-none bg-card">
              <span className="text-[9px] font-bold tracking-wider">09:41</span>
              <div className="flex items-center gap-1">
                <Wifi className="size-2.5" />
                <Battery className="size-3" />
              </div>
            </div>

            {/* Custom Phone Content: Timeline and mini events */}
            <div className="flex-1 p-4 space-y-4 overflow-hidden relative bg-[#fcfbf8] dark:bg-card">
              <div className="flex items-center gap-1 w-fit rounded-full bg-sage-deep/5 px-2 py-0.5 text-[8px] font-bold text-sage-deep uppercase tracking-wider">
                <span className="size-1 rounded-full bg-sage-deep animate-ping" />
                Active Loop
              </div>

              {/* Vertical timeline view */}
              <div className="space-y-2.5">
                <h3 className="font-serif text-xs font-bold text-foreground">
                  Today's Timeline
                </h3>
                <div className="scale-[0.85] origin-left w-[115%]">
                  <TimelineTrack scenario={scenario} tm={tm} />
                </div>
              </div>

              {/* Live typing logs under timeline */}
              <div className="rounded-xl border border-border bg-card p-3 shadow-xs h-[140px] flex flex-col overflow-hidden">
                <span className="text-[8px] font-bold uppercase tracking-wider text-sage-deep/80 border-b border-border/40 pb-1 mb-1.5 block">
                  Live Feed
                </span>
                <div className="flex-1 overflow-hidden scale-[0.85] origin-top-left pr-1">
                  <CommandFeed scenario={scenario} />
                </div>
              </div>
            </div>
          </div>

          {/* B. Floating Layered Widget 1: Focus Ring (TOP-RIGHT hover) */}
          <div 
            className="absolute -right-[15px] top-[40px] z-20 w-[120px] [transform:perspective(1500px)_translateZ(45px)_rotateX(15deg)_rotateY(6deg)_rotateZ(3deg)] filter drop-shadow-md"
          >
            <FocusRingOverlay
              minutes={scenario.focus.minutes}
              taskName={scenario.task.name}
              value={tm.focusRingValue}
              completionOpacity={tm.ringCompletionOpacity}
              pulseScale={tm.ringPulseScale}
              size={90}
              stroke={7}
            />
          </div>

          {/* C. Floating Layered Widget 2: Habits tick box (MIDDLE-LEFT hover) */}
          <div 
            className="absolute -left-[25px] top-[190px] z-20 w-[150px] rounded-2xl border border-border bg-card p-4 [transform:perspective(1500px)_translateZ(55px)_rotateX(15deg)_rotateY(6deg)_rotateZ(3deg)] shadow-xl"
          >
            <div className="w-full text-left border-b border-border/40 pb-1.5 mb-2">
              <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-sage-deep">Habits</h4>
            </div>
            <HabitTick
              name={scenario.habit.name}
              streakDay={scenario.habit.streakDay}
              tickOpacity={tm.habitTickOpacity}
              tickScale={tm.habitTickScale}
              className="scale-85 origin-left"
            />
          </div>

          {/* D. Floating Layered Widget 3: AI Planner Box (BOTTOM-RIGHT hover) */}
          <div 
            className="absolute -right-[20px] top-[370px] z-20 w-[170px] rounded-2xl border border-border bg-card p-4 shadow-xl [transform:perspective(1500px)_translateZ(65px)_rotateX(15deg)_rotateY(6deg)_rotateZ(3deg)]"
          >
            <div className="w-full text-left border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-sage-deep/80 flex items-center gap-1">
                <Sparkles className="size-3" /> AI Planner
              </span>
            </div>
            <p className="text-[9px] font-semibold text-foreground leading-relaxed text-left italic">
              {scenario.tomorrow.summary === "adjusted around it" 
                ? "Mornings are your peak focus. Tomorrow's calendar reorganized to protect a 3-hour deep work block."
                : scenario.tomorrow.summary === "opened an earlier writing block"
                ? "Writing focus detected. Reordered morning slot to start writing block immediately after standup."
                : "Short focus blocks work best. Shifted secondary task into late afternoon buffer hour."}
            </p>
          </div>
        </div>

        {/* Play & Scrub controllers: Positioned flat at the very bottom for responsiveness */}
        <div className="mt-4 flex w-full max-w-[280px] items-center gap-3 bg-card border border-border/60 rounded-xl px-4 py-2.5 shadow-xs relative z-30">
          <LoopScrubBar progress={progress} className="flex-1" />
          <LoopPauseButton />
        </div>
      </div>
    </div>
  );
}
