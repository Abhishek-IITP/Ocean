"use client";

import { ChevronDown } from "lucide-react";
import { Reveal, RevealItem } from "./Reveal";
import { AuthModel } from "../AuthModel";

const faqs = [
  {
    q: "Is Ocean an AI product?",
    a: "No. Ocean is a set of calm, dependable tools. There is no autonomous agent planning your life. We simply give you a beautiful, quiet place to think.",
  },
  {
    q: "Does it sync with my calendar?",
    a: "Yes. Ocean syncs two-way with Google Calendar and Outlook in real time, keeping your availability accurate everywhere.",
  },
  {
    q: "Is my day-planning data saved?",
    a: "Every task, habit, focus session, and journal entry is stored to your account. Your progress is saved, not a demo.",
  },
];

export function ChapterFAQ() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-6 py-20 bg-background">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
        
        {/* Left Timeline Backbone Indicator Terminating */}
        <div className="hidden lg:flex lg:col-span-2 flex-col items-center select-none">
          <div className="h-10 w-px border-l border-dashed border-border/70 mb-3" />
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80 mb-2">10:00 PM</div>
          <div className="size-3.5 rounded-full border-2 border-sage-deep bg-sage-deep shadow-[0_0_8px_rgba(59,84,71,0.2)]" />
          <div className="h-12 w-px bg-gradient-to-b from-border/70 to-transparent mt-3" />
        </div>

        {/* Center column: FAQ accordions */}
        <div className="lg:col-span-5 space-y-6">
          <Reveal className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80 block">
              Chapter 08 &middot; Questions
            </span>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              Questions, answered <span className="accent-italic text-sage-deep font-serif italic">calmly</span>.
            </h2>
          </Reveal>

          <Reveal stagger className="space-y-3 max-w-md">
            {faqs.map((f) => (
              <RevealItem key={f.q}>
                <details className="group rounded-xl border border-border bg-card p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between text-xs font-bold text-foreground">
                    <span>{f.q}</span>
                    <ChevronDown className="size-3.5 text-sage-deep transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              </RevealItem>
            ))}
          </Reveal>
        </div>

        {/* Right column: Invitation SignUp CTA */}
        <div className="lg:col-span-5 flex flex-col justify-center lg:pl-10 lg:border-l lg:border-border/30 space-y-6">
          <Reveal className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-deep/80 block">
              The Invitation
            </span>
            <h3 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              Start your workday <span className="accent-italic text-sage-deep font-serif italic">quietly</span>.
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground max-w-sm">
              Join the planners who trade frantic dashboards for a single, unhurried place to think. Free to begin &mdash; no credit card required.
            </p>
            <div className="pt-2">
              <AuthModel label="Create your space" />
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
