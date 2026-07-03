"use client";

import { cn } from "@/lib/utils";
import { Droplet, Flame } from "lucide-react";
import { useState } from "react";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function HabitsBoardDemo() {
  const [days, setDays] = useState([true, true, true, false, true, false, false]);
  const [water, setWater] = useState(4);

  const streak = (() => {
    let s = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i]) s++;
      else break;
    }
    return s;
  })();

  return (
    <div className="flex h-full flex-col justify-center gap-6 px-6 py-8 sm:px-10">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-deep">
          Habits
        </p>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-clay">
          <Flame className="size-3.5" /> {streak}-day streak
        </span>
      </div>

      <div>
        <p className="mb-2.5 text-sm font-medium">Read a physical page</p>
        <div className="flex gap-2">
          {days.map((on, i) => (
            <button
              key={i}
              onClick={() =>
                setDays((prev) => prev.map((x, j) => (j === i ? !x : x)))
              }
              aria-label={`Toggle ${DAY_LABELS[i]}`}
              className={cn(
                "flex h-12 flex-1 flex-col items-center justify-center gap-1 rounded-lg border text-[10px] font-medium transition-all duration-300",
                on
                  ? "border-sage-deep bg-sage-deep/85 text-sage-deep-foreground"
                  : "border-border bg-accent/20 text-muted-foreground hover:bg-accent/40"
              )}
            >
              {DAY_LABELS[i]}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border/70 pt-4">
        <div className="mb-2.5 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 font-medium">
            <Droplet className="size-4 text-sky" /> Water
          </span>
          <span className="text-muted-foreground">{water} / 8 glasses</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setWater(i + 1 === water ? i : i + 1)}
              aria-label={`Set water to ${i + 1}`}
              className={cn(
                "h-7 flex-1 rounded-md transition-all duration-300",
                i < water ? "bg-sky/70" : "bg-accent/25 hover:bg-accent/40"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
