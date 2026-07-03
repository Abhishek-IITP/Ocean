"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeToggle } from "../ThemeToggle";
import { Logo } from "../Logo";

export function NavbarChrome({ authButton }: { authButton: React.ReactNode }) {
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0.3, 0.8]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      <motion.div
        style={{
          borderColor: useTransform(borderOpacity, (o) => `hsl(var(--border) / ${o})`),
        }}
        className="mx-auto mt-3 flex w-[min(72rem,calc(100%-1.5rem))] items-center justify-between rounded-full border bg-background/25 px-4 py-2.5 shadow-soft backdrop-blur-xl md:px-6"
      >
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="#features" className="transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#workspace" className="transition-colors hover:text-foreground">
            Workspace
          </Link>
          <Link href="#dashboard" className="transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <Link href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {authButton}
        </div>
      </motion.div>
    </header>
  );
}
