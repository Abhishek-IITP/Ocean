"use client";

import { useState, useEffect } from "react";
import { Sparkles, Calendar, Heart, ShieldAlert, Sparkle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InsightData {
  theme: string;
  trajectory: string;
  frictionPoint: string;
  suggestedAdjustment: string;
  reflectionsSummary: string;
}

const LOADING_STEPS = [
  "Retrieving tasks & completed work...",
  "Running vector search over journals & notes...",
  "Calculating habit streaks...",
  "Analyzing weekly mood parameters...",
  "Drafting print-editorial review...",
];

export function InsightsViewer({
  initialInsight,
}: {
  initialInsight: InsightData | null;
}) {
  const [insight, setInsight] = useState<InsightData | null>(initialInsight);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Cycle loading steps during compiling
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setStepIndex((idx) => (idx + 1) % LOADING_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [loading]);

  async function generate() {
    setLoading(true);
    setStepIndex(0);
    try {
      const res = await fetch("/api/insights/generate", { method: "POST" });
      const resData = await res.json();
      if (resData.ok && resData.data) {
        setInsight(resData.data);
        toast.success("Weekly review compiled successfully.");
      } else {
        toast.error(resData.error ?? "Failed to compile review");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while compiling.");
    } finally {
      setLoading(false);
    }
  }

  // 1. Loading state with zen breathing bubble
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center select-none animate-fade-in">
        {/* Pulsing Breathing Ring */}
        <div className="relative flex items-center justify-center size-24">
          <div className="absolute inset-0 rounded-full bg-sage-deep/5 animate-ping [animation-duration:3s]" />
          <div className="absolute size-16 rounded-full bg-sage-deep/10 animate-pulse [animation-duration:2s]" />
          <div className="relative size-8 rounded-full bg-sage-deep flex items-center justify-center text-white shadow-soft">
            <Sparkle className="size-4 animate-spin [animation-duration:8s]" />
          </div>
        </div>

        <h3 className="mt-8 font-serif text-xl font-medium text-foreground">
          Compiling Ocean Digest
        </h3>
        <p className="mt-2 text-xs text-muted-foreground transition-all duration-500 ease-in-out">
          {LOADING_STEPS[stepIndex]}
        </p>
      </div>
    );
  }

  // 2. Empty state (First time compilation)
  if (!insight) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-10 text-center shadow-soft">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-sage-deep/8 text-sage-deep mb-4">
          <Sparkles className="size-5" />
        </div>
        <h3 className="font-serif text-lg font-bold text-foreground">
          No Weekly Review Compiled
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
          Your personal productivity review is ready. The AI will look at your Focus blocks, habits, and vector memories from this week.
        </p>
        <button
          onClick={generate}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-sage-deep px-6 text-sm font-semibold text-sage-deep-foreground transition-all hover:-translate-y-px hover:bg-sage-deep/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer"
        >
          <Sparkles className="size-3.5" /> Compile Review
        </button>
      </div>
    );
  }

  // 3. Editorial compiled review view
  return (
    <div className="space-y-8 animate-rise">
      <div className="rounded-2xl border border-border/50 bg-card p-8 md:p-10 shadow-soft relative overflow-hidden">
        {/* Gentle background accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, hsl(var(--sage-deep) / 0.02) 0%, transparent 60%)",
          }}
        />

        {/* Eyebrow header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Weekly Digest &middot; Reflections
          </span>
          <span className="inline-flex rounded-full bg-sage-deep/5 px-2.5 py-0.5 text-[10px] font-bold text-sage-deep uppercase tracking-wider">
            Ready
          </span>
        </div>

        {/* Poetic Theme Block */}
        <div className="text-center font-serif text-2xl md:text-3xl text-sage-deep italic font-medium my-8 border-y border-border/30 py-7 px-4 select-all leading-normal">
          &ldquo;{insight.theme}&rdquo;
        </div>

        {/* Main Content Columns */}
        <div className="grid gap-8 md:grid-cols-2 mt-6">
          {/* Left Column: Trajectory */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80">
              <Calendar className="size-3" /> The Trajectory
            </h4>
            <p className="text-xs leading-[1.8] text-foreground/85 text-justify select-all">
              {insight.trajectory}
            </p>
          </div>

          {/* Right Column: Reflections */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80">
              <Heart className="size-3" /> Reflections &amp; Focus
            </h4>
            <p className="text-xs leading-[1.8] text-foreground/85 text-justify select-all">
              {insight.reflectionsSummary}
            </p>
          </div>
        </div>

        {/* Fine divider */}
        <div className="my-8 border-t border-border/30" />

        {/* Actionable Insights Panel */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Friction points */}
          <div className="rounded-xl border border-destructive/15 bg-destructive/[0.02] p-4.5 space-y-1.5">
            <h5 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-destructive/80">
              <ShieldAlert className="size-3.5" /> Friction Identified
            </h5>
            <p className="text-xs leading-relaxed text-foreground/80 select-all">
              {insight.frictionPoint}
            </p>
          </div>

          {/* Suggested adjustment */}
          <div className="rounded-xl border border-sage-deep/15 bg-sage-deep/[0.02] p-4.5 space-y-1.5">
            <h5 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80">
              <Sparkles className="size-3.5" /> Proposed Flow Adjustment
            </h5>
            <p className="text-xs leading-relaxed text-foreground/80 select-all">
              {insight.suggestedAdjustment}
            </p>
          </div>
        </div>
      </div>

      {/* Recalculate Trigger */}
      <div className="flex justify-end">
        <button
          onClick={generate}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/60 bg-card px-4 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-sage-deep/40 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer"
        >
          <RefreshCw className="size-3" /> Regenerate digest
        </button>
      </div>
    </div>
  );
}
