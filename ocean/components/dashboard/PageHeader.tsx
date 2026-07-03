export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-6">
      <div className="space-y-1.5">
        <h1 className="font-serif text-2xl font-bold md:text-3xl">{title}</h1>
        {description && (
          <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
