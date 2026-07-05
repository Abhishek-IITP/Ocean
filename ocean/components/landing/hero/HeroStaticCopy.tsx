"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type HeroStaticCopyProps = {
  className?: string;
};

/**
 * The static anchor in the experience — present from frame one.
 * Contains the custom infinite morphing underline wave on the key word "itself".
 */
export function HeroStaticCopy({ className }: HeroStaticCopyProps) {
  return (
    <div className={cn("max-w-xl", className)}>
      <h1 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl select-none">
        A workday that reorganizes{" "}
        <motion.span
          className="accent-italic text-sage-deep font-serif italic relative inline-block px-1 origin-center"
          animate={{
            scale: [1, 1.06, 1],
            rotate: [-0.6, 0.6, -0.6]
          }}
          transition={{
            repeat: Infinity,
            duration: 5.5,
            ease: "easeInOut"
          }}
        >
          itself
          {/* Custom infinite morphing handwritten-style SVG underline wave */}
          <svg 
            className="absolute -bottom-1.5 left-0 w-full h-1.5 text-sage-deep/80 dark:text-sage-deep" 
            viewBox="0 0 100 10" 
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M0,5 Q25,2 50,5 T100,5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              animate={{
                d: [
                  "M0,5 Q25,2 50,5 T100,5",
                  "M0,5 Q25,8 50,5 T100,5",
                  "M0,5 Q25,2 50,5 T100,5"
                ]
              }}
              transition={{
                repeat: Infinity,
                duration: 2.8,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.span>
        .
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/80 md:text-base">
        Watch a real day move through Ocean — nothing here is staged.
      </p>
    </div>
  );
}
