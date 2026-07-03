"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HeroCopy({ authButton }: { authButton: React.ReactNode }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-32 text-center md:pt-44"
    >
      <motion.span
        variants={rise}
        className="rounded-full border border-border/60 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep backdrop-blur-sm"
      >
        A calm place for your day
      </motion.span>

      <motion.h1
        variants={rise}
        className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight [text-shadow:0_2px_28px_hsl(var(--background)/0.9),0_1px_2px_hsl(var(--background)/0.7)] sm:text-5xl md:text-6xl"
      >
        Plan your day the way you&apos;d
        <br className="hidden sm:block" />{" "}
        <span className="accent-italic text-sage-deep">wander</span> the shore.
      </motion.h1>

      <motion.p
        variants={rise}
        className="mt-6 max-w-xl text-base leading-relaxed text-foreground/80 [text-shadow:0_2px_20px_hsl(var(--background)/0.9)] md:text-lg"
      >
        Ocean brings scheduling, focus, habits, notes and a private vault into
        one unhurried workspace. No noise, no clutter — just room to think.
      </motion.p>

      <motion.div
        variants={rise}
        className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
      >
        {authButton}
        <a
          href="#workspace"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card/70 px-5 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:-translate-y-px hover:shadow-soft"
        >
          See it in action <ArrowDown className="size-4" />
        </a>
      </motion.div>
    </motion.div>
  );
}
