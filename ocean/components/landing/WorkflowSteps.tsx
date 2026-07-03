import { SectionHeading } from "../ui/section";
import { Reveal, RevealItem } from "./Reveal";

const steps = [
  {
    step: "01",
    name: "Capture",
    text: "Empty your head into quick notes and tasks the moment thoughts arrive. Nothing to lose, nothing to hold.",
  },
  {
    step: "02",
    name: "Arrange",
    text: "Sort by what truly matters, then block it onto your day with room to breathe between things.",
  },
  {
    step: "03",
    name: "Flow",
    text: "Move through gentle focus sessions, check in on habits, and end the day with a short reflection.",
  },
];

export function WorkflowSteps() {
  return (
    <section
      id="workflow"
      className="border-t border-border/60 bg-accent/15"
    >
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="The Ocean rhythm"
            title="Three unhurried steps to a clear day."
            description="Ocean is shaped around a natural planning rhythm — so structure feels like calm, not pressure."
          />
        </Reveal>

        <Reveal stagger className="mt-16 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <RevealItem
              key={s.step}
              className="rounded-2xl border border-border/70 bg-card p-8 shadow-soft"
            >
              <div className="font-serif text-4xl font-bold text-sage-deep/70">
                {s.step}
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.text}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
