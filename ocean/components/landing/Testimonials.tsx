import { Reveal, RevealItem } from "./Reveal";

const testimonials = [
  {
    text: "Ocean changed how I meet the morning. No frantic alerts — just a quiet page that shows me the day and lets me choose where to begin.",
    author: "Sarah Jenkins",
    role: "Creative Director",
  },
  {
    text: "It's the first productivity app I actually look forward to opening. The restraint in the design is the whole point — nothing shouts at me.",
    author: "David Osei",
    role: "Software Engineer",
  },
  {
    text: "Scheduling, habits, and a place to keep private notes — all in one calm space. I closed four other tabs the week I switched.",
    author: "Mara Lindqvist",
    role: "Independent Consultant",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
      <Reveal>
        <h2 className="text-center font-serif text-3xl font-bold tracking-tight md:text-4xl">
          Loved by deliberate planners.
        </h2>
      </Reveal>
      <Reveal stagger delay={0.1} className="mt-14 grid gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <RevealItem
            key={t.author}
            className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-7 shadow-soft"
          >
            <figure className="flex h-full flex-col justify-between">
              <blockquote className="text-[15px] leading-relaxed text-foreground/85">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-6">
                <div className="text-sm font-bold">{t.author}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
