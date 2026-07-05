"use client";

import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

/**
 * Shared scroll-triggered reveal — fades/rises content into view once as it
 * enters the viewport. Pass `stagger` to animate direct children in
 * sequence instead of all at once.
 */
export function Reveal({
  children,
  className,
  stagger: withStagger = false,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-100px" }}
      variants={withStagger ? stagger : fadeUp}
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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}
