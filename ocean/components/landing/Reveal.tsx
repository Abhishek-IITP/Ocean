"use client";

import { motion, type Variants } from "framer-motion";

const animVariants: Record<string, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  },
  "fade-left": {
    hidden: { opacity: 0, x: 40 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  },
  "fade-right": {
    hidden: { opacity: 0, x: -40 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.94 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 60, damping: 14 },
    },
  },
  "flip-3d": {
    hidden: { opacity: 0, rotateX: -22, transformPerspective: 1200 },
    show: {
      opacity: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 50, damping: 13, mass: 1.1 },
    },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

/**
 * Scroll-triggered reveal with multiple custom animation directions:
 * - "fade-up": Calm vertical rise (default)
 * - "fade-left": Slides in from the right
 * - "fade-right": Slides in from the left
 * - "scale-up": Spring-based scale zoom
 * - "flip-3d": Premium 3D perspective fold-down
 */
export function Reveal({
  children,
  className,
  stagger: withStagger = false,
  delay = 0,
  animation = "fade-up",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale-up" | "flip-3d";
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={withStagger ? stagger : animVariants[animation]}
      transition={withStagger ? undefined : { delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  animation = "fade-up",
}: {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale-up" | "flip-3d";
}) {
  return (
    <motion.div variants={animVariants[animation]} className={className}>
      {children}
    </motion.div>
  );
}
