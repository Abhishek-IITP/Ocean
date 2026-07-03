"use client";

import { saveJournal } from "@/app/lib/actions/journal";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Kind = "DAILY" | "WEEKLY" | "MONTHLY";

export interface JournalEntryView {
  content: string;
  gratitude: string | null;
  mood: string | null;
}

const PROMPTS: Record<Kind, { label: string; prompt: string }> = {
  DAILY: {
    label: "Today",
    prompt: "How did today feel? What went well, what drained you?",
  },
  WEEKLY: {
    label: "This week",
    prompt: "Looking back on the week — what mattered, what would you change?",
  },
  MONTHLY: {
    label: "This month",
    prompt: "A wider view. What are you proud of? Where are you headed?",
  },
};

export function JournalEditor({
  entries,
}: {
  entries: Record<Kind, JournalEntryView | null>;
}) {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("DAILY");
  const current = entries[kind];
  const [content, setContent] = useState(current?.content ?? "");
  const [gratitude, setGratitude] = useState(current?.gratitude ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function switchKind(k: Kind) {
    setKind(k);
    setContent(entries[k]?.content ?? "");
    setGratitude(entries[k]?.gratitude ?? "");
    setSaved(false);
  }

  function save() {
    startTransition(async () => {
      const res = await saveJournal({ kind, content, gratitude });
      if (res.ok) {
        setSaved(true);
        toast.success("Reflection saved");
        router.refresh();
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
      <div className="mb-5 flex gap-1 rounded-full bg-accent/30 p-1">
        {(Object.keys(PROMPTS) as Kind[]).map((k) => (
          <button
            key={k}
            onClick={() => switchKind(k)}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              kind === k
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {PROMPTS[k].label}
          </button>
        ))}
      </div>

      <p className="mb-3 text-sm italic text-muted-foreground">
        {PROMPTS[kind].prompt}
      </p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        placeholder="Write freely…"
        className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <label className="mt-4 block text-xs font-bold uppercase tracking-[0.14em] text-sage-deep">
        One thing I&apos;m grateful for
      </label>
      <input
        value={gratitude}
        onChange={(e) => setGratitude(e.target.value)}
        placeholder="A small good thing…"
        className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={save}
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-px disabled:opacity-50"
        >
          {saved ? <Check className="size-4" /> : null}
          {saved ? "Saved" : "Save reflection"}
        </button>
      </div>
    </div>
  );
}
