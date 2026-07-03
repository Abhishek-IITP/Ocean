import { Skeleton } from "@/components/ui/skeleton";

/**
 * Generic loading placeholder for dashboard route segments. Shown instantly
 * on navigation (via loading.tsx) while the server component's data fetch
 * resolves, so switching pages never looks like the app has frozen.
 */
export function PageSkeleton({
  cards = 3,
  showSide = false,
}: {
  cards?: number;
  showSide?: boolean;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className={showSide ? "grid gap-6 lg:grid-cols-[320px_1fr]" : "space-y-6"}>
        {showSide && <Skeleton className="h-64 rounded-2xl" />}
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
          {Array.from({ length: cards }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
