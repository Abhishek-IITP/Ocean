"use client";

import { Reveal, RevealItem } from "./Reveal";
import { ProgressRing } from "../ui/progress-ring";
import { motion } from "framer-motion";

const SPARK_PATH = "M0 22 L12 16 L24 18 L36 8 L48 10 L60 0";

export function ChapterInsights() {
  return (
    <section id="insights" className="mx-auto max-w-7xl px-6 py-20 bg-background">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
        
        {/* Left Timeline Backbone Indicator */}
        <div className="hidden lg:flex lg:col-span-2 flex-col items-center select-none">
          <div className="h-10 w-px border-l border-dashed border-border/70 mb-3" />
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80 mb-2">06:00 PM</div>
          <div className="size-3.5 rounded-full border-2 border-sage-deep bg-sage-deep shadow-[0_0_8px_rgba(59,84,71,0.2)]" />
          <div className="flex-1 w-px border-l border-dashed border-border/70 mt-3" />
        </div>

        {/* Center column: Editorial copy */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
          <Reveal className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80">
              Chapter 06 &middot; Reflection
            </span>
            <h2 className="text-3xl font-serif font-semibold leading-[1.15] tracking-tight sm:text-4xl text-foreground">
              Insights that build <span className="accent-italic text-sage-deep font-serif italic">clarity</span>.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Reflection closes the loop of a busy workday. Review your productivity with calm, clear data. No complex spreadsheets &mdash; just a simple weekly focus score and a gentle trajectory sparkline.
            </p>
          </Reveal>
        </div>

        {/* Right column: Visual insights and scores */}
        <div className="lg:col-span-6 flex items-center">
          <Reveal stagger className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Focus Score Card */}
            <RevealItem className="flex flex-col items-center rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-lift transition-all duration-300">
              <div className="w-full border-b border-border/40 pb-2 mb-3 text-left">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-sage-deep">Weekly Focus</h4>
                <p className="text-[9px] text-muted-foreground font-medium">Productivity index</p>
              </div>
              <ProgressRing value={78} size={96} stroke={7}>
                <span className="font-serif text-xl font-bold text-foreground">78</span>
                <span className="text-[9px] text-muted-foreground">of 100</span>
              </ProgressRing>
              <p className="mt-3.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Optimal state maintained
              </p>
            </RevealItem>

            {/* Sparkline analytics Card */}
            <RevealItem className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-lift transition-all duration-300 sm:translate-y-2">
              <div className="w-full border-b border-border/40 pb-2 mb-3 text-left">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-sage-deep">Trends</h4>
                <p className="text-[9px] text-muted-foreground font-medium">Focus time trajectory</p>
              </div>
              <div className="flex flex-col items-start gap-1 py-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tabular-nums text-foreground">+18%</span>
                  <span className="text-[9px] font-bold text-sage-deep/90">+12% vs yesterday</span>
                </div>
                <div className="flex items-center gap-3 w-full mt-2">
                  <svg width={60} height={20} viewBox="0 0 60 20" className="overflow-visible text-sky" aria-hidden="true">
                    <motion.path
                      d={SPARK_PATH}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </svg>
                  <span className="text-[9px] text-muted-foreground font-medium">This week&apos;s focus time</span>
                </div>
              </div>
            </RevealItem>

          </Reveal>
        </div>

      </div>
    </section>
  );
}
