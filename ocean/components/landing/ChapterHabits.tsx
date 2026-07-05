"use client";

import { Reveal } from "./Reveal";
import { HabitsBoardDemo } from "./HabitsBoardDemo";

export function ChapterHabits() {
  return (
    <section id="habits" className="mx-auto max-w-7xl px-6 py-20 bg-background">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
        
        {/* Left Timeline Backbone Indicator */}
        <div className="hidden lg:flex lg:col-span-2 flex-col items-center select-none">
          <div className="h-10 w-px border-l border-dashed border-border/70 mb-3" />
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80 mb-2">01:00 PM</div>
          <div className="size-3.5 rounded-full border-2 border-sage-deep bg-sage-deep shadow-[0_0_8px_rgba(59,84,71,0.2)]" />
          <div className="flex-1 w-px border-l border-dashed border-border/70 mt-3" />
        </div>

        {/* Center column: Editorial copy */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
          <Reveal className="space-y-4" animation="fade-right">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80">
              Chapter 04 &middot; Consistency
            </span>
            <h2 className="text-3xl font-serif font-semibold leading-[1.15] tracking-tight sm:text-4xl text-foreground">
              Small habits, <span className="accent-italic text-sage-deep font-serif italic">compounding</span> daily.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Consistency is about momentum. Check off daily habits like drinking water or stretching right alongside your schedule, maintaining your streak over time.
            </p>
          </Reveal>
        </div>

        {/* Right column: Interactive habits widget */}
        <div className="lg:col-span-6 flex items-center">
          <Reveal className="w-full flex justify-center" animation="flip-3d">
            <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-lift transition-all duration-300">
              <HabitsBoardDemo />
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
