"use client";

import { CheckCircle2, CloudLightning } from "lucide-react";
import { Reveal, RevealItem } from "./Reveal";

const connections = [
  { name: "Google Calendar", desc: "Two-way sync", status: "connected" },
  { name: "Outlook & 365", desc: "Unified schedule", status: "connected" },
];

export function ChapterScheduling() {
  return (
    <section id="scheduling" className="mx-auto max-w-7xl px-6 py-20 bg-background">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
        
        {/* Left Timeline Backbone Indicator */}
        <div className="hidden lg:flex lg:col-span-2 flex-col items-center select-none">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80 mb-2">09:00 AM</div>
          <div className="size-3.5 rounded-full border-2 border-sage-deep bg-sage-deep shadow-[0_0_8px_rgba(59,84,71,0.2)]" />
          <div className="flex-1 w-px border-l border-dashed border-border/70 mt-3" />
        </div>

        {/* Center column: Editorial copy */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
          <Reveal className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80">
              Chapter 02 &middot; Scheduling
            </span>
            <h2 className="text-3xl font-serif font-semibold leading-[1.15] tracking-tight sm:text-4xl text-foreground">
              Meetings that fit <span className="accent-italic text-sage-deep font-serif italic">your</span> day.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Connect Google Calendar and Outlook once. Ocean silently coordinates availability in the background, adding buffer times automatically so you never rush between slots.
            </p>
          </Reveal>

          <Reveal stagger className="space-y-3 pt-2">
            {[
              "Instant background Google/Outlook sync",
              "Automatic transit & buffer slot protection",
              "Calm client booking pages",
            ].map((item) => (
              <RevealItem key={item} className="flex items-center gap-2.5 text-xs font-semibold text-foreground/80">
                <CheckCircle2 className="size-4 text-sage-deep" />
                {item}
              </RevealItem>
            ))}
          </Reveal>
        </div>

        {/* Right column: Visual calendar blocks */}
        <div className="lg:col-span-6 flex items-center">
          <Reveal className="w-full space-y-4">
            {/* The schedule mockup block */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-bold uppercase tracking-wider">Morning schedule</span>
                <span className="flex items-center gap-1"><CloudLightning className="size-3.5 text-sage-deep" /> synced</span>
              </div>

              {/* Mapped calendar blocks */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/10 p-3">
                  <span className="text-[10px] font-bold text-muted-foreground w-10">09:00</span>
                  <div className="h-5 w-px bg-border/80" />
                  <span className="text-xs font-semibold text-foreground">Standup &middot; Sync complete</span>
                  <span className="ml-auto rounded-full bg-sage-deep/10 border border-sage-deep/20 px-2 py-0.5 text-[8px] font-bold text-sage-deep uppercase">Google</span>
                </div>

                {/* Conflict resolved block */}
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-sage-deep/30 bg-sage-deep/5 p-3 relative overflow-hidden">
                  <span className="text-[10px] font-bold text-sage-deep w-10">09:45</span>
                  <div className="h-5 w-px bg-sage-deep/30" />
                  <div>
                    <span className="text-xs font-bold text-foreground">Buffer protection slot</span>
                    <span className="block text-[8px] text-muted-foreground mt-0.5">30-minute block automatically added</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/10 p-3">
                  <span className="text-[10px] font-bold text-muted-foreground w-10">10:15</span>
                  <div className="h-5 w-px bg-border/80" />
                  <span className="text-xs font-semibold text-foreground">Project review meeting</span>
                  <span className="ml-auto rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[8px] font-bold text-blue-500 uppercase">Outlook</span>
                </div>
              </div>
            </div>

            {/* Micro sync connections badges underneath */}
            <div className="grid grid-cols-2 gap-3">
              {connections.map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-xs">
                  <div className="text-[10px] font-bold text-foreground">{c.name}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-sage-deep" />
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
