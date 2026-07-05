"use client";

import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import { DashboardLinks } from "@/components/DashboardLinks";
import { PageTransition } from "@/components/dashboard/PageTransition";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Plus, PanelLeftClose, PanelLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: ReactNode;
  userImage?: string | null;
  userName?: string | null;
  logoutFormAction: ReactNode; // Pass the raw logout form action block from layout
}

export function DashboardShell({
  children,
  userImage,
  userName,
  logoutFormAction,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read saved collapse state from localStorage on client mount
  useEffect(() => {
    const saved = localStorage.getItem("ocean-sidebar-collapsed");
    if (saved === "true") {
      setCollapsed(true);
    }
    setMounted(true);
  }, []);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("ocean-sidebar-collapsed", String(next));
  }

  // Prevent flash of layout shift during server-side render
  const gridClass = cn(
    "grid min-h-screen w-full bg-background transition-all duration-300",
    mounted && collapsed
      ? "md:grid-cols-[72px_1fr]"
      : "md:grid-cols-[220px_1fr] lg:grid-cols-[248px_1fr]"
  );

  return (
    <div className={gridClass}>
      {/* ── Sidebar ── */}
      <aside className="sticky top-0 hidden h-screen max-h-screen flex-col overflow-hidden border-r border-border/40 bg-card md:flex">
        {/* Logo / Header row */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 px-5">
          {collapsed ? (
            <div className="flex w-full justify-center">
              <button
                onClick={toggleCollapse}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent/40 hover:text-foreground cursor-pointer focus-visible:outline-none"
                title="Expand sidebar"
              >
                <PanelLeft className="size-4.5" />
              </button>
            </div>
          ) : (
            <>
              <Logo />
              <button
                onClick={toggleCollapse}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent/40 hover:text-foreground cursor-pointer focus-visible:outline-none"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="size-4.5" />
              </button>
            </>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <DashboardLinks collapsed={collapsed} />
        </nav>

        {/* New Event CTA */}
        <div className="shrink-0 border-t border-border/40 p-4 flex justify-center">
          {collapsed ? (
            <Link
              href="/dashboard/new"
              className="flex size-9 items-center justify-center rounded-xl bg-sage-deep text-sage-deep-foreground transition-all hover:-translate-y-px hover:bg-sage-deep/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
              title="New event type"
            >
              <Plus className="size-4" />
            </Link>
          ) : (
            <Link
              href="/dashboard/new"
              className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-sage-deep px-4 text-xs font-semibold text-sage-deep-foreground transition-all hover:-translate-y-px hover:bg-sage-deep/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
            >
              <Plus className="size-3.5" />
              New event type
            </Link>
          )}
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/40 bg-background/90 px-5 backdrop-blur-sm md:px-7">
          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden" variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-[220px] flex-col bg-card p-0">
              <SheetTitle className="sr-only">Ocean navigation</SheetTitle>
              <div className="flex h-14 items-center border-b border-border/40 px-5">
                <Logo />
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-5">
                <DashboardLinks />
              </nav>
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="size-8 overflow-hidden rounded-full border border-border/60 transition-all hover:-translate-y-px hover:border-sage-deep/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50">
                  {userImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={userImage}
                      alt="Your avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-sage-deep/10 text-xs font-bold text-sage-deep">
                      {userName?.[0] ?? "O"}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {userName ?? "My account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {logoutFormAction}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background px-5 py-8 md:px-8 lg:px-10">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
