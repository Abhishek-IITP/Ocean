import Link from "next/link";
import { cn } from "@/lib/utils";

/** The Ocean mark — a calm four-petal / pinwheel wave glyph. */
export function OceanMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 0 0-9 9h9z" />
      <path d="M12 12a9 9 0 0 1 9 9h-9z" />
      <path d="M3 12a9 9 0 0 1 9 9v-9z" />
      <path d="M12 3a9 9 0 0 1 9 9v-9z" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  textClassName,
  href = "/",
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  href?: string | null;
}) {
  const inner = (
    <span className={cn("flex items-center gap-2.5 group", className)}>
      <OceanMark
        className={cn(
          "size-7 text-foreground transition-transform duration-500 group-hover:rotate-45",
          markClassName
        )}
      />
      <span
        className={cn(
          "font-serif text-xl font-bold tracking-tight text-foreground",
          textClassName
        )}
      >
        Ocean
      </span>
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} aria-label="Ocean home">
      {inner}
    </Link>
  );
}
