import { cn } from "@/lib/utils";

type HeroStaticCopyProps = {
  className?: string;
};

/**
 * The one static anchor in the whole experience — present from frame one,
 * untouched by the loop. The wordmark already lives in the Navbar. Kept
 * deliberately quiet (a masthead line, not a hero block) so the workspace
 * itself is the visual event — per the workspace-as-hero visual
 * recomposition, docs/HERO_LIVING_WORKDAY.md §2/§7.
 */
export function HeroStaticCopy({ className }: HeroStaticCopyProps) {
  return (
    <div className={cn("max-w-xl", className)}>
      <h1 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
        A workday that reorganizes{" "}
        <span className="accent-italic text-sage-deep">itself</span>.
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-foreground/80 md:text-base">
        Watch a real day move through Ocean — nothing here is staged.
      </p>
    </div>
  );
}
