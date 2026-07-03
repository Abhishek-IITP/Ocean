import { LucideProps, Sprout } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  description,
  buttonText,
  href,
  icon: Icon = Sprout,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center animate-soft-fade",
        className
      )}
    >
      {/* Calm layered "illustration" built from soft sage rings */}
      <div className="relative mb-6 grid place-items-center">
        <span className="absolute size-24 rounded-full bg-accent/40" />
        <span className="absolute size-16 rounded-full bg-accent/60" />
        <span className="relative grid size-14 place-items-center rounded-full bg-card text-sage-deep shadow-soft">
          <Icon className="size-6" />
        </span>
      </div>
      <h2 className="font-serif text-xl font-bold text-foreground">{title}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? (
        <div className="mt-6">{action}</div>
      ) : buttonText && href ? (
        <Button asChild className="mt-6">
          <Link href={href}>{buttonText}</Link>
        </Button>
      ) : null}
    </div>
  );
}
