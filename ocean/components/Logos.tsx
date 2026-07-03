import { CalendarCheck, Leaf, ShieldCheck, Star } from "lucide-react";
import { Reveal } from "./landing/Reveal";

const points = [
  { icon: Star, label: "Loved by deliberate planners" },
  { icon: CalendarCheck, label: "Two-way calendar sync" },
  { icon: ShieldCheck, label: "Encrypted vault" },
  { icon: Leaf, label: "Calm by design" },
];

export function Logos() {
  return (
    <Reveal className="py-14">
      <p className="text-center text-sm text-muted-foreground">
        A quiet workspace trusted for the whole day — from first meeting to
        evening reflection.
      </p>
      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {points.map((p) => (
          <div
            key={p.label}
            className="flex items-center gap-2 text-sm font-medium text-foreground/70"
          >
            <p.icon className="size-4 text-sage-deep" />
            {p.label}
          </div>
        ))}
      </div>
    </Reveal>
  );
}
