"use client";
import { cn } from "@/lib/utils";
import { CalendarCheck, HomeIcon, LucideProps, Settings, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface DashboardLinksProps {
    id: number;
    name: string;
    href: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

    // Define any props if needed
}
export const dashboardLinks: DashboardLinksProps[] = [
    {
        id: 0,
        name: "Event Types",
        href: "/dashboard",
        icon: HomeIcon
    },
    {
        id: 1,
        name: "Meetings",
        href: "/dashboard/meetings",
        icon: User2
    },
    {
        id:  2,
        name: "Availablility",
        href: "/dashboard/availability",
        icon: CalendarCheck
    },
    {
        id:  2,
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings
    }
];

export function DashboardLinks() {
    const pathname = usePathname();
return (
    <ul className="">
      {dashboardLinks.map((link,index) => (
        <Link
          key={index}
          href={link.href}
          className={cn(
            "flex items-center gap-3 mb-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
            pathname === link.href
              ? "bg-blue-100 text-blue-700"
              : "text-white-700 hover:bg-gray-100 hover:text-blue-700"
          )}
        >
          <link.icon className="w-5 h-5" />
          <span>{link.name}</span>
        </Link>
      ))}
    </ul>
  );
}