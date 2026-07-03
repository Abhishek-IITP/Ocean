"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckSquare2, Flame, Timer } from "lucide-react";
import { useState } from "react";
import { HabitsBoardDemo } from "./HabitsBoardDemo";
import { KanbanDemo } from "./KanbanDemo";
import { LaptopMockup } from "./LaptopMockup";
import { Reveal } from "./Reveal";
import { TimerDemo } from "./TimerDemo";
import { SectionHeading } from "@/components/ui/section";

const TABS = [
  { id: "timer", label: "Timer", icon: Timer, content: <TimerDemo /> },
  { id: "habits", label: "Habits", icon: Flame, content: <HabitsBoardDemo /> },
  { id: "kanban", label: "Kanban", icon: CheckSquare2, content: <KanbanDemo /> },
] as const;

export function WorkspaceDemo() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("timer");
  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <section id="workspace" className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Try it, right here"
          title={
            <>
              A whole <span className="accent-italic text-sage-deep">workspace</span>,
              <br className="hidden sm:block" /> not just a screenshot.
            </>
          }
          description="Every panel below is live. Start a focus session, check off a habit, drag a card — this is the real Ocean, running in your browser."
        />
      </Reveal>

      <Reveal delay={0.15} className="mt-14">
        <div className="mx-auto mb-6 flex w-full max-w-sm items-center justify-center gap-1.5 rounded-full border border-border/70 bg-card/70 p-1.5 backdrop-blur-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-colors",
                active === tab.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active === tab.id && (
                <motion.span
                  layoutId="workspace-tab-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <tab.icon className="relative z-10 size-3.5" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <LaptopMockup>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {activeTab.content}
            </motion.div>
          </AnimatePresence>
        </LaptopMockup>
      </Reveal>
    </section>
  );
}
