export function PageHeader({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border/50 pb-7">
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep/80">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-3xl font-bold leading-tight tracking-[-0.02em] text-foreground md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
