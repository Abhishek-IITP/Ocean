import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs uppercase tracking-[0.18em] text-sage-deep font-semibold",
        className
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl",
        className
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] md:leading-[1.1] font-bold tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground text-base leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
