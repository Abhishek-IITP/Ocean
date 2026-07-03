"use client";
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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

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

export function DashboardLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="space-y-6">
      {dashboardGroups.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
            {group.label}
          </p>
          {group.items.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-accent/60 text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                )}
              >
                <link.icon
                  className={cn(
                    "size-[18px] shrink-0",
                    active ? "text-sage-deep" : "text-muted-foreground"
                  )}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
