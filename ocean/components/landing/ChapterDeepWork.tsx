"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { TimerDemo } from "./TimerDemo";
import { cn } from "@/lib/utils";
import { EyeOff } from "lucide-react";

export function ChapterDeepWork() {
  const [running, setRunning] = useState(false);

  return (
    <section id="focus" className="mx-auto max-w-7xl px-6 py-20 bg-background">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
        
        {/* Left Timeline Backbone Indicator */}
        <div className="hidden lg:flex lg:col-span-2 flex-col items-center select-none">
          <div className="h-10 w-px border-l border-dashed border-border/70 mb-3" />
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80 mb-2">11:00 AM</div>
          <div className="size-3.5 rounded-full border-2 border-sage-deep bg-sage-deep shadow-[0_0_8px_rgba(59,84,71,0.2)]" />
          <div className="flex-1 w-px border-l border-dashed border-border/70 mt-3" />
        </div>

        {/* Center column: Editorial copy */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
          <Reveal className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80">
              Chapter 03 &middot; Execution
            </span>
            <h2 className="text-3xl font-serif font-semibold leading-[1.15] tracking-tight sm:text-4xl text-foreground">
              A room to <span className="accent-italic text-sage-deep font-serif italic">just</span> do the work.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Click &ldquo;Start focus&rdquo; to experience the calm workspace. Surrounding notifications fall silent, secondary tasks fade back, and the interface helps you focus on one single task.
            </p>
          </Reveal>
        </div>

        {/* Right column: Interactive Focus & Quiet Tasks */}
        <div className="lg:col-span-6 flex items-center">
          <Reveal className="w-full grid gap-4 sm:grid-cols-12">
            
            {/* The Timer Card */}
            <div className="sm:col-span-7 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <TimerDemo running={running} onRunningChange={setRunning} />
            </div>

            {/* Fading surrounding tasks list */}
            <div className="sm:col-span-5 flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="space-y-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Today&apos;s Focus
                </span>
                
                {/* Active item (always fully opaque) */}
                <div className="rounded-lg border border-sage-deep/20 bg-sage-deep/5 p-2.5">
                  <span className="text-[9px] font-bold uppercase text-sage-deep tracking-wider block mb-0.5">Active task</span>
                  <span className="text-xs font-semibold text-foreground">Redesign landing page</span>
                </div>

                {/* Quiet/Faded items during active focus */}
                <div className="space-y-2">
                  {[
                    "Outline content strategy",
                    "Gather visual assets",
                    "Write product copy",
                  ].map((task) => (
                    <div
                      key={task}
                      className={cn(
                        "rounded-lg border border-border/60 bg-muted/5 p-2.5 text-xs font-medium text-muted-foreground transition-all duration-1000",
                        running ? "opacity-15 blur-[0.6px] select-none" : "opacity-90"
                      )}
                    >
                      {task}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Message at the bottom */}
              <div className="pt-4 border-t border-border/40 mt-4 flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                <EyeOff className="size-3.5 text-sage-deep" />
                <span>
                  {running ? "Notifications muted" : "Distractions filtered"}
                </span>
              </div>

            </div>

          </Reveal>
        </div>

      </div>
    </section>
  );
}
