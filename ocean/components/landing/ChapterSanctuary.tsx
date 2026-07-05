"use client";

import { CloudSun, Droplet, Moon, Sunrise, CheckCircle2, Circle } from "lucide-react";
import { ProgressRing } from "../ui/progress-ring";
import { Reveal } from "./Reveal";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  type: string;
};

const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: "s1", time: "09:00", title: "Deep work — redesign", type: "Focus block" },
  { id: "s2", time: "11:30", title: "Ocean sync", type: "Meeting" },
  { id: "s3", time: "14:00", title: "Walk by the shore", type: "Rest" },
];

type HabitItem = {
  id: string;
  name: string;
  checked: boolean;
  weight: number;
};

export function ChapterSanctuary() {
  // Interactive States
  const [habits, setHabits] = useState<HabitItem[]>([
    { id: "h1", name: "Read a page", checked: true, weight: 20 },
    { id: "h2", name: "Stretch", checked: false, weight: 20 },
    { id: "h3", name: "No late screens", checked: false, weight: 20 },
  ]);

  const [completedSchedule, setCompletedSchedule] = useState<Record<string, boolean>>({
    s3: true,
  });

  const [isCelsius, setIsCelsius] = useState(true);

  const baseScore = 38;
  const habitsScore = habits.reduce((acc, h) => acc + (h.checked ? h.weight : 0), 0);
  const scheduleScore = Object.values(completedSchedule).filter(Boolean).length * 10;
  const focusScore = Math.min(100, baseScore + habitsScore + scheduleScore);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, checked: !h.checked } : h))
    );
  };

  const toggleSchedule = (id: string) => {
    setCompletedSchedule((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-6 py-20 bg-background">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
        
        {/* Left Timeline Backbone Indicator */}
        <div className="hidden lg:flex lg:col-span-2 flex-col items-center select-none">
          <div className="h-10 w-px border-l border-dashed border-border/70 mb-3" />
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80 mb-2">08:00 PM</div>
          <div className="size-3.5 rounded-full border-2 border-sage-deep bg-sage-deep shadow-[0_0_8px_rgba(59,84,71,0.2)]" />
          <div className="h-10 w-px border-l border-dashed border-border/70 mt-3" />
        </div>

        {/* Center column: Editorial copy */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
          <Reveal className="space-y-4" animation="fade-right">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80">
              Chapter 07 &middot; Sanctuary
            </span>
            <h2 className="text-3xl font-serif font-semibold leading-[1.15] tracking-tight sm:text-4xl text-foreground">
              A workspace that is <span className="accent-italic text-sage-deep font-serif italic">yours</span>.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              All your tools live in one calm dashboard. Try interacting: complete schedule blocks, toggle habits to recalculate the focus score, or check weather metrics.
            </p>
          </Reveal>
        </div>

        {/* Right column: Interactive Sanctuary mockup */}
        <div className="lg:col-span-6 flex items-center">
          <Reveal className="w-full overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm hover:shadow-lift transition-all duration-300 select-none" animation="flip-3d">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Good morning, Abhishek
                </h3>
                <p className="mt-0.5 text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Thursday, July 2 &middot; a gentle start
                </p>
              </div>
              <button
                onClick={() => setIsCelsius((c) => !c)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-muted/20 hover:bg-muted/40 transition-colors px-3 py-1.5 text-[9px] font-bold text-muted-foreground cursor-pointer"
                title="Toggle temperature unit"
              >
                <CloudSun className="size-3.5 text-clay" /> 
                {isCelsius ? "29°C" : "84°F"} &middot; Noida
              </button>
            </div>

            {/* Content columns */}
            <div className="grid gap-5 md:grid-cols-[1fr_200px]">
              {/* Left Column: Schedule */}
              <div className="space-y-3.5">
                <h4 className="text-[9px] font-bold uppercase tracking-wider text-sage-deep">
                  Today&apos;s schedule
                </h4>
                <div className="space-y-2">
                  {INITIAL_SCHEDULE.map((item) => {
                    const isDone = !!completedSchedule[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleSchedule(item.id)}
                        className={cn(
                          "flex items-center gap-3.5 rounded-xl border p-3 cursor-pointer transition-all duration-300 hover:-translate-y-px",
                          isDone 
                            ? "border-sage-deep/30 bg-accent/10" 
                            : "border-border/50 bg-background/50"
                        )}
                      >
                        <span className={cn(
                          "w-10 text-[10px] font-bold tabular-nums transition-colors",
                          isDone ? "text-sage-deep" : "text-muted-foreground"
                        )}>
                          {item.time}
                        </span>
                        <span className="h-5 w-px bg-border" />
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <div className={cn(
                              "text-xs font-semibold transition-all",
                              isDone ? "text-muted-foreground line-through" : "text-foreground"
                            )}>
                              {item.title}
                            </div>
                            <div className="text-[8px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                              {item.type}
                            </div>
                          </div>
                          {isDone ? (
                            <CheckCircle2 className="size-4 text-sage-deep shrink-0" />
                          ) : (
                            <Circle className="size-4 text-border shrink-0 hover:text-muted-foreground/60" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sunrise / sunset small cards */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { icon: Sunrise, label: "Rise", value: "05:24" },
                    { icon: Droplet, label: "Humidity", value: "62%" },
                    { icon: Moon, label: "Set", value: "19:12" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-border/50 bg-background/40 p-2 text-center"
                    >
                      <s.icon className="mx-auto size-3.5 text-sage-deep" />
                      <div className="mt-1 text-xs font-bold text-foreground">{s.value}</div>
                      <div className="text-[7px] uppercase tracking-wider text-muted-foreground font-semibold">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Score & Habits */}
              <div className="space-y-3.5">
                {/* Focus Score widget */}
                <div className="flex flex-col items-center rounded-xl border border-border/50 bg-background/40 p-3.5">
                  <p className="mb-2.5 text-[8px] font-bold uppercase tracking-wider text-sage-deep">
                    Focus score
                  </p>
                  <ProgressRing value={focusScore} size={80} stroke={6}>
                    <span className="font-serif text-lg font-bold text-foreground">
                      {focusScore}
                    </span>
                    <span className="text-[8px] text-muted-foreground">of 100</span>
                  </ProgressRing>
                </div>

                {/* Habits list widget */}
                <div className="space-y-1.5 rounded-xl border border-border/50 bg-background/40 p-3.5">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-sage-deep border-b border-border/30 pb-1 mb-1">
                    Habits
                  </p>
                  {habits.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => toggleHabit(h.id)}
                      className="flex items-center justify-between text-[11px] py-0.5 cursor-pointer group"
                    >
                      <span className={cn(
                        "transition-all",
                        h.checked ? "text-muted-foreground/75 line-through" : "text-foreground group-hover:text-muted-foreground"
                      )}>
                        {h.name}
                      </span>
                      <span
                        className={cn(
                          "grid size-3.5 place-items-center rounded-full border transition-all",
                          h.checked
                            ? "border-sage-deep bg-sage-deep text-white"
                            : "border-border bg-transparent group-hover:border-muted-foreground"
                        )}
                      >
                        {h.checked && <span className="size-1 rounded-full bg-white" />}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
