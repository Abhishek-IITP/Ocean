import { CloudSun, Droplet, Moon, Sunrise } from "lucide-react";
import { SectionHeading } from "../ui/section";
import { ProgressRing } from "../ui/progress-ring";
import { Reveal } from "./Reveal";

export function DashboardShowcase() {
  return (
    <section
      id="dashboard"
      className="border-t border-border/60 bg-accent/15"
    >
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Your daily sanctuary"
            title="A dashboard that never feels empty."
            description="Schedule, focus, habits and weather sit calmly beside each other — everything you need for the day, at a glance."
          />
        </Reveal>

        <Reveal delay={0.15} className="mt-14 overflow-hidden rounded-[2rem] border border-border/70 bg-card p-5 shadow-lift md:p-8">
          {/* header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-6">
            <div>
              <h3 className="font-serif text-2xl font-bold">
                Good morning, Abhishek
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Thursday, July 2 · a gentle start
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground">
              <CloudSun className="size-4 text-clay" /> 29°C · Noida
            </div>
          </div>

          <div className="grid gap-6 pt-6 md:grid-cols-[1fr_260px]">
            {/* schedule */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-sage-deep">
                Today&apos;s schedule
              </h4>
              <div className="space-y-3">
                {[
                  { time: "09:00", title: "Deep work — redesign", type: "Focus block" },
                  { time: "11:30", title: "Ocean sync", type: "Meeting" },
                  { time: "14:00", title: "Walk by the shore", type: "Rest" },
                ].map((item) => (
                  <div
                    key={item.time}
                    className="flex items-center gap-4 rounded-xl border border-border/70 bg-background/60 p-4"
                  >
                    <span className="w-14 text-sm font-bold tabular-nums text-muted-foreground">
                      {item.time}
                    </span>
                    <span className="h-8 w-px bg-border" />
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { icon: Sunrise, label: "Rise", value: "05:24" },
                  { icon: Droplet, label: "Humidity", value: "62%" },
                  { icon: Moon, label: "Set", value: "19:12" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-border/70 bg-background/60 p-3 text-center"
                  >
                    <s.icon className="mx-auto size-4 text-sage-deep" />
                    <div className="mt-1 text-sm font-bold">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* right widgets */}
            <div className="space-y-5">
              <div className="flex flex-col items-center rounded-2xl border border-border/70 bg-background/60 p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-sage-deep">
                  Focus score
                </p>
                <ProgressRing value={78} size={96}>
                  <span className="font-serif text-2xl font-bold">78</span>
                  <span className="text-[10px] text-muted-foreground">of 100</span>
                </ProgressRing>
              </div>
              <div className="space-y-2.5 rounded-2xl border border-border/70 bg-background/60 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-sage-deep">
                  Habits
                </p>
                {["Read a page", "Stretch", "No late screens"].map((h, i) => (
                  <div
                    key={h}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className={i === 0 ? "text-muted-foreground line-through" : ""}>
                      {h}
                    </span>
                    <span
                      className={`grid size-4 place-items-center rounded-full border ${
                        i === 0
                          ? "border-sage-deep bg-sage-deep"
                          : "border-border"
                      }`}
                    >
                      {i === 0 && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
