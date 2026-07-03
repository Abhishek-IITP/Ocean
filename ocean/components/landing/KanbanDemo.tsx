"use client";

import { cn } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { useState } from "react";

type Column = "todo" | "doing" | "done";

type Card = {
  id: string;
  label: string;
  column: Column;
};

const COLUMNS: { id: Column; title: string }[] = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

const INITIAL_CARDS: Card[] = [
  { id: "c1", label: "Sketch the new hero", column: "todo" },
  { id: "c2", label: "Write launch email", column: "todo" },
  { id: "c3", label: "Review onboarding copy", column: "doing" },
  { id: "c4", label: "Ship dark mode", column: "done" },
];

function KanbanCard({ card, isOverlay }: { card: Card; isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
  });

  return (
    <motion.div
      layout
      ref={isOverlay ? undefined : setNodeRef}
      {...(isOverlay ? {} : listeners)}
      {...(isOverlay ? {} : attributes)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: isDragging && !isOverlay ? 0.3 : 1, y: 0 }}
      className={cn(
        "cursor-grab select-none rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground active:cursor-grabbing",
        isOverlay && "border-sage-deep/60"
      )}
    >
      {card.label}
    </motion.div>
  );
}

function KanbanColumn({
  id,
  title,
  cards,
}: {
  id: Column;
  title: string;
  cards: Card[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[10rem] flex-1 flex-col gap-2 rounded-xl border border-border/70 bg-accent/15 p-3 transition-colors",
        isOver && "border-sage-deep/60 bg-sage-deep/10"
      )}
    >
      <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title} · {cards.length}
      </p>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export function KanbanDemo() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find((c) => c.id === event.active.id);
    setActiveCard(card ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;
    const targetColumn = over.id as Column;
    setCards((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, column: targetColumn } : c))
    );
  };

  return (
    <div className="flex h-full flex-col justify-center gap-4 px-6 py-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-deep">
        Kanban board · drag a card
      </p>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              cards={cards.filter((c) => c.column === col.id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? <KanbanCard card={activeCard} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
