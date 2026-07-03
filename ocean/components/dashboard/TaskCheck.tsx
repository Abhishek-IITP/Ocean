"use client";

import { toggleTask } from "@/app/lib/actions/tasks";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useOptimistic, useTransition } from "react";

export function TaskCheck({
  id,
  done,
  size = "md",
}: {
  id: string;
  done: boolean;
  size?: "sm" | "md";
}) {
  const [optimistic, setOptimistic] = useOptimistic(done, (_, v: boolean) => v);
  const [, startTransition] = useTransition();

  return (
    <button
      aria-label={optimistic ? "Mark as not done" : "Mark as done"}
      onClick={() =>
        startTransition(async () => {
          setOptimistic(!optimistic);
          await toggleTask(id, !optimistic);
        })
      }
      className={cn(
        "grid shrink-0 place-items-center rounded-md border transition-all duration-300",
        size === "sm" ? "size-5" : "size-6",
        optimistic
          ? "border-sage-deep bg-sage-deep text-white"
          : "border-border bg-card hover:border-sage-deep"
      )}
    >
      {optimistic && <Check className={size === "sm" ? "size-3" : "size-3.5"} />}
    </button>
  );
}
