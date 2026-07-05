import { cn } from "@/lib/utils";
import {
  BookOpenText,
  CalendarCheck,
  CalendarDays,
  Home,
  ListTodo,
  LockKeyhole,
  LucideProps,
  NotebookPen,
  Settings,
  Sprout,
  Target,
  Timer,
  BarChart3,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes, useState, useEffect } from "react";

type Icon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

interface LinkItem {
  name: string;
  href: string;
  icon: Icon;
}

interface LinkGroup {
  label: string;
  items: LinkItem[];
}

export const dashboardGroups: LinkGroup[] = [
  {
    label: "Plan",
    items: [
      { name: "Today", href: "/dashboard", icon: Home },
      { name: "Day Planner", href: "/dashboard/planner", icon: ListTodo },
      { name: "Meetings", href: "/dashboard/meetings", icon: CalendarDays },
      { name: "Event Types", href: "/dashboard/events", icon: CalendarCheck },
      { name: "Availability", href: "/dashboard/availability", icon: CalendarCheck },
    ],
  },
  {
    label: "Grow",
    items: [
      { name: "Habits", href: "/dashboard/habits", icon: Sprout },
      { name: "Goals", href: "/dashboard/goals", icon: Target },
      { name: "Focus", href: "/dashboard/focus", icon: Timer },
      { name: "Journal", href: "/dashboard/journal", icon: BookOpenText },
      { name: "Insights", href: "/dashboard/insights", icon: BarChart3 },
    ],
  },
  {
    label: "Keep",
    items: [
      { name: "Notes", href: "/dashboard/notes", icon: NotebookPen },
      { name: "Vault", href: "/dashboard/vault", icon: LockKeyhole },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function DashboardLinks({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const [clickedHref, setClickedHref] = useState<string | null>(null);

  useEffect(() => {
    setClickedHref(null);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className={cn("space-y-6", collapsed && "space-y-5")}>
      {dashboardGroups.map((group, groupIdx) => (
        <div key={group.label}>
          {collapsed ? (
            groupIdx > 0 && <div className="mx-1 my-3 h-px bg-border/40" />
          ) : (
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/50">
              {group.label}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((link) => {
              const active = isActive(link.href);
              const isTransitioning = clickedHref === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    if (!active) {
                      setClickedHref(link.href);
                    }
                    if (onNavigate) onNavigate();
                  }}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50",
                    active
                      ? "text-sage-deep"
                      : "text-muted-foreground hover:text-foreground",
                    isTransitioning && "opacity-75 pointer-events-none",
                    collapsed && "justify-center px-0"
                  )}
                  title={collapsed ? link.name : undefined}
                >
                  {/* Active indicator dot */}
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-sage-deep transition-all duration-200",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />

                  {/* Hover bg */}
                  <span
                    className={cn(
                      "absolute inset-0 rounded-lg transition-all duration-150",
                      active
                        ? "bg-sage-deep/8"
                        : "bg-transparent group-hover:bg-accent/25"
                    )}
                  />

                  {isTransitioning ? (
                    <Loader2 className="relative z-10 size-[16px] shrink-0 animate-spin text-sage-deep" />
                  ) : (
                    <link.icon
                      className={cn(
                        "relative z-10 size-[16px] shrink-0 transition-colors",
                        active
                          ? "text-sage-deep"
                          : "text-muted-foreground/70 group-hover:text-foreground"
                      )}
                    />
                  )}
                  {!collapsed && (
                    <span className="relative z-10 font-medium">{link.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
