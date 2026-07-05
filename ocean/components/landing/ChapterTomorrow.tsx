"use client";

import { Reveal } from "./Reveal";
import { Sparkles } from "lucide-react";

export function ChapterTomorrow() {
  return (
    <section 
      id="tomorrow" 
      className="mx-auto max-w-7xl px-6 py-20 bg-background relative overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(circle at 80% 40%, rgba(189,103,66,0.03) 0%, transparent 60%)"
      }}
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
        
        {/* Left Timeline Backbone Indicator */}
        <div className="hidden lg:flex lg:col-span-2 flex-col items-center select-none">
          <div className="h-10 w-px border-l border-dashed border-border/70 mb-3" />
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80 mb-2">04:00 PM</div>
          <div className="size-3.5 rounded-full border-2 border-sage-deep bg-sage-deep shadow-[0_0_8px_rgba(59,84,71,0.2)]" />
          <div className="flex-1 w-px border-l border-dashed border-border/70 mt-3" />
        </div>

        {/* Center column: Editorial copy */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
          <Reveal className="space-y-4" animation="fade-right">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80">
              Chapter 05 &middot; Optimization
            </span>
            <h2 className="text-3xl font-serif font-semibold leading-[1.15] tracking-tight sm:text-4xl text-foreground">
              A head start on <span className="accent-italic text-sage-deep font-serif italic">tomorrow</span>.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              As the workday winds down, Ocean&apos;s quiet intelligence automatically reorganizes tomorrow&apos;s slots around your peak productivity patterns, protecting your calendar before you sleep.
            </p>
          </Reveal>
        </div>

        {/* Right column: Tomorrow preview cards */}
        <div className="lg:col-span-6 flex items-center">
          <Reveal className="w-full flex justify-center" animation="scale-up">
            <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-lift transition-all duration-300">
              {/* Tomorrow preview lane */}
              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/20 px-4 py-3.5">
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Tomorrow
                </span>
                <div className="relative h-2 flex-1 rounded-full bg-muted/70">
                  <span className="absolute inset-y-0 rounded-full bg-sage-deep/80" style={{ left: "8%", width: "22%" }} />
                  <span className="absolute inset-y-0 rounded-full bg-border" style={{ left: "38%", width: "18%" }} />
                  <span className="absolute inset-y-0 rounded-full bg-border" style={{ left: "64%", width: "16%" }} />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="size-1 rounded-full bg-clay" />
                  <span className="h-px w-3 bg-clay" />
                </div>
              </div>

              {/* Overlapping AI Recommendation details */}
              <div className="mt-4 rounded-xl border border-border/60 bg-background/50 p-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="size-3 text-sage-deep" />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-sage-deep">AI Planner</h4>
                  </div>
                  <p className="text-[9px] text-muted-foreground font-medium">Tomorrow optimized</p>
                </div>
                <p className="text-xs font-semibold text-foreground leading-relaxed">
                  Mornings are your peak focus hours. Tomorrow&apos;s calendar has been adjusted to protect your focus buffer, shifting non-essential review blocks to late afternoon.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
