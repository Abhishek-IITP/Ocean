import { ChevronDown } from "lucide-react";
import { Reveal, RevealItem } from "./Reveal";

const faqs = [
  {
    q: "Is Ocean an AI product?",
    a: "No. Ocean is a handcrafted set of calm, dependable tools. There's no agent planning your life for you — you stay fully in control. We simply give you a beautiful place to think.",
  },
  {
    q: "Does it sync with my calendar?",
    a: "Yes. Ocean syncs two-way with Google Calendar and Outlook in real time, so bookings and availability stay accurate everywhere without double-entry.",
  },
  {
    q: "What can I keep in the vault?",
    a: "Passwords, keys, and sensitive notes. Everything in the vault is encrypted at rest with AES-256-GCM, so your valuables aren't sitting in plain text.",
  },
  {
    q: "Is my day-planning data really saved?",
    a: "Every task, habit, focus session, goal and journal entry is stored to your account — your streaks and progress are real, not a demo that resets on refresh.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-border/60 bg-accent/15">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <Reveal>
          <h2 className="text-center font-serif text-3xl font-bold tracking-tight md:text-4xl">
            Questions, answered calmly.
          </h2>
        </Reveal>
        <Reveal stagger delay={0.1} className="mt-12 space-y-3">
          {faqs.map((f) => (
            <RevealItem key={f.q}>
              <details className="group rounded-2xl border border-border/70 bg-card p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between text-base font-bold">
                  <span>{f.q}</span>
                  <ChevronDown className="size-5 text-sage-deep transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
