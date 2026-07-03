"use client";

import { useEffect, useState } from "react";

function greetingFor(hour: number) {
  if (hour < 5) return "Rest well";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Winding down";
}

export function Greeting({ name }: { name: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hour = now?.getHours() ?? 8;
  const dateLabel = now
    ? now.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : " ";

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold md:text-4xl">
        {greetingFor(hour)},{" "}
        <span className="accent-italic text-sage-deep">{name}</span>.
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{dateLabel}</p>
    </div>
  );
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : " ";
  const seconds = now
    ? now.toLocaleTimeString([], { second: "2-digit" }).replace(/\D/g, "")
    : "";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="font-serif text-4xl font-bold tabular-nums">{time}</span>
        <span className="text-sm text-muted-foreground tabular-nums">{seconds}</span>
      </div>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="inline-block size-1.5 rounded-full bg-sage-deep" />
        {tz.replace(/_/g, " ")}
      </p>
    </div>
  );
}
