"use client";

import { setMood, setWater } from "@/app/lib/actions/daily";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";

const MOODS = [
  { label: "peaceful", glyph: "◍" },
  { label: "focused", glyph: "◆" },
  { label: "creative", glyph: "✦" },
  { label: "tired", glyph: "◌" },
];

const MAX_GLASSES = 8;

export function WaterMood({
  initialWater,
  initialMood,
}: {
  initialWater: number;
  initialMood: string | null;
}) {
  const [water, setW] = useState(initialWater);
  const [mood, setM] = useState(initialMood);
  const [, startTransition] = useTransition();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-sage-deep">
          How are you?
        </p>
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.label}
              title={m.label}
              onClick={() => {
                setM(m.label);
                startTransition(() => {
                  setMood(m.label);
                });
              }}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl border py-2.5 text-lg transition-all duration-300",
                mood === m.label
                  ? "border-sage-deep bg-accent/50"
                  : "border-border hover:bg-accent/25"
              )}
            >
              <span className="text-sage-deep">{m.glyph}</span>
              <span className="text-[10px] capitalize text-muted-foreground">
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-[0.14em] text-sage-deep">
            Water
          </span>
          <span className="text-muted-foreground">
            {water} / {MAX_GLASSES} glasses
          </span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_GLASSES }).map((_, i) => {
            const value = i + 1;
            return (
              <button
                key={i}
                aria-label={`Set water to ${value}`}
                onClick={() => {
                  const next = value === water ? i : value;
                  setW(next);
                  startTransition(() => {
                    setWater(next);
                  });
                }}
                className={cn(
                  "h-7 flex-1 rounded-md transition-all duration-300",
                  i < water ? "bg-sky/70" : "bg-accent/25 hover:bg-accent/40"
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
