import { CheckCircle2 } from "lucide-react";
import { Eyebrow } from "../ui/section";
import { Reveal, RevealItem } from "./Reveal";

const connections = [
  { name: "Google Calendar", desc: "Instant two-way sync.", status: "connected" },
  { name: "Outlook & 365", desc: "Work scheduling, unified.", status: "connected" },
  { name: "Nylas engine", desc: "Real-time availability.", status: "connected" },
  { name: "Apple iCal", desc: "Personal planner.", status: "soon" },
];

export function Integrations() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <Reveal className="space-y-6">
          <Eyebrow>Plays well with your calendar</Eyebrow>
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-[2.75rem]">
            Your meetings,{" "}
            <span className="accent-italic text-sage-deep">already</span> in sync.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Connect work and personal accounts once. Ocean coordinates
            availability across all of them, protecting buffers and travel time
            so you never have to rush from one thing to the next.
          </p>
          <ul className="space-y-3 text-sm font-medium">
            {[
              "Two-way Google Calendar sync",
              "Outlook & Office 365 support",
              "Automatic buffer & travel time",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="size-5 text-sage-deep" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal stagger delay={0.1} className="grid grid-cols-2 gap-4">
          {connections.map((c) => (
            <RevealItem
              key={c.name}
              className="flex h-40 flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-soft"
            >
              <div className="space-y-1">
                <div className="text-sm font-bold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.desc}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${
                    c.status === "connected" ? "bg-sage-deep" : "bg-clay"
                  }`}
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {c.status === "connected" ? "Connected" : "Coming soon"}
                </span>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
