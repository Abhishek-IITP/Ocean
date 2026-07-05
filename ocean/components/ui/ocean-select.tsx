import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectHTMLAttributes } from "react";

/**
 * OceanSelect — branded <select> wrapper.
 * Removes default browser chrome, applies brand focus ring and custom chevron.
 * Usage:
 *   <OceanSelect value={x} onChange={...}>
 *     <option value="a">Option A</option>
 *   </OceanSelect>
 */
export function OceanSelect({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn("relative", className)}>
      <select
        {...props}
        className="h-full w-full cursor-pointer appearance-none rounded-xl border border-border/60 bg-background pl-3.5 pr-9 text-sm text-foreground outline-none transition-colors focus-visible:ring-1 focus-visible:ring-sage-deep/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
    </div>
  );
}
