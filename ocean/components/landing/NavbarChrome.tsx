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
        <Logo href="#" />

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="#features" className="relative py-1 transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-sage-deep after:transition-all after:duration-300 hover:after:w-full">
            Features
          </Link>
          <Link href="#workspace" className="relative py-1 transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-sage-deep after:transition-all after:duration-300 hover:after:w-full">
            Workspace
          </Link>
          <Link href="#dashboard" className="relative py-1 transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-sage-deep after:transition-all after:duration-300 hover:after:w-full">
            Dashboard
          </Link>
          <Link href="#faq" className="relative py-1 transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-sage-deep after:transition-all after:duration-300 hover:after:w-full">
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
