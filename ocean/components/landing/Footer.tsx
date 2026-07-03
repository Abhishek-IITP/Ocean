"use client";

import { Logo, OceanMark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Github, Send, Twitter } from "lucide-react";
import Link from "next/link";
import { Reveal, RevealItem } from "./Reveal";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Workspace", href: "#workspace" },
      { label: "Dashboard", href: "#dashboard" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Journal", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Support", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 pt-20">
        <Reveal className="grid gap-14 md:grid-cols-[1.2fr_2fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A calm place to plan your day, grow your habits, and keep what
              matters safe. No noise — just room to think.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex max-w-xs items-center gap-2 rounded-full border border-border bg-card/70 p-1.5 pl-4"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 hover:-translate-y-px"
              >
                <Send className="size-3.5" />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <RevealItem key={col.heading}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                  {col.heading}
                </p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/60 py-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Ocean. Made to feel calm.</p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Twitter"
              className="grid size-8 place-items-center rounded-full border border-border transition-colors hover:bg-accent/40 hover:text-foreground"
            >
              <Twitter className="size-3.5" />
            </a>
            <a
              href="#"
              aria-label="Github"
              className="grid size-8 place-items-center rounded-full border border-border transition-colors hover:bg-accent/40 hover:text-foreground"
            >
              <Github className="size-3.5" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Oversized outlined wordmark — a quiet signature, not a gradient or shadow */}
      <div
        aria-hidden
        className="pointer-events-none -mb-6 flex items-center justify-center gap-3 overflow-hidden pb-2 text-[16vw] font-bold leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_hsl(var(--foreground)/0.08)] sm:text-[11rem]"
      >
        <OceanMark className="size-[0.6em] shrink-0 text-foreground/[0.06]" />
        Ocean
      </div>
    </footer>
  );
}
