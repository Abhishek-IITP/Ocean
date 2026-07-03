import {
  CalendarDays,
  ListTodo,
  LockKeyhole,
  NotebookPen,
  Sprout,
  Timer,
} from "lucide-react";
import { SectionHeading } from "./ui/section";
import { Reveal, RevealItem } from "./landing/Reveal";

const features = [
  {
    name: "Scheduling that respects your time",
    description:
      "Share your availability, let people book, and keep buffers and travel time intact. Syncs both ways with your calendar.",
    icon: CalendarDays,
  },
  {
    name: "A day planner, not a to-do pile",
    description:
      "Sort what matters with the Eisenhower matrix, then block it onto a real timeline. Your day, laid out gently.",
    icon: ListTodo,
  },
  {
    name: "Focus sessions & habits",
    description:
      "Run quiet Pomodoro sessions and grow small habits. Every finished session is remembered, so your streaks are real.",
    icon: Timer,
  },
  {
    name: "Notes & quick capture",
    description:
      "Clear your head the moment a thought arrives. Pin what matters, keep the rest close but out of the way.",
    icon: NotebookPen,
  },
  {
    name: "Goals & reflection",
    description:
      "Set weekly and monthly goals, then close each day with a short journal. Progress you can actually see.",
    icon: Sprout,
  },
  {
    name: "A private vault",
    description:
      "Keep passwords, keys and sensitive notes encrypted at rest. Your valuables, kept quietly out of sight.",
    icon: LockKeyhole,
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Everything in one calm place"
          title="More than a scheduler."
          description="Ocean grew from a booking tool into a quiet home for your whole day — plan it, focus through it, and keep what matters safe."
        />
      </Reveal>

      <Reveal stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <RevealItem
            key={feature.name}
            className="group rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/50 text-sage-deep transition-colors duration-500 group-hover:bg-accent">
              <feature.icon className="size-6" />
            </div>
            <h3 className="mt-5 font-serif text-xl font-bold">{feature.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
