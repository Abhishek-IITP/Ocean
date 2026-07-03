import { cn } from "@/lib/utils";

/**
 * A laptop-frame mockup built entirely from borders and background tints —
 * no box-shadow. Depth reads through layered border tones and a subtle
 * top-edge highlight instead.
 */
export function LaptopMockup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-4xl", className)}>
      {/* Lid */}
      <div className="rounded-[1.75rem] border-[10px] border-foreground/85 bg-foreground/85 p-2.5">
        <div className="relative overflow-hidden rounded-xl border border-foreground/10 bg-background">
          {/* Camera notch */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center py-1.5">
            <span className="size-1.5 rounded-full bg-foreground/20" />
          </div>
          {/* Top-edge highlight — reads as a reflection without a drop shadow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-card/40 to-transparent" />
          <div className="min-h-[22rem] pt-6 sm:min-h-[26rem]">{children}</div>
        </div>
      </div>

      {/* Hinge */}
      <div className="mx-auto h-2 w-[92%] rounded-b-sm bg-foreground/70" />

      {/* Base */}
      <div className="mx-auto h-3 w-full rounded-b-2xl border border-t-0 border-foreground/20 bg-gradient-to-b from-muted to-muted/60" />
      <div className="mx-auto -mt-[1px] h-1.5 w-24 rounded-b-lg border border-t-0 border-foreground/25 bg-foreground/15" />
    </div>
  );
}
