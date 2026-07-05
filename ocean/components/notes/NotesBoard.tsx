"use client";

import { createNote, deleteNote, updateNote } from "@/app/lib/actions/notes";
import { cn } from "@/lib/utils";
import { NotebookPen, Pin, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export interface NoteView {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
}

const COLOR_CLASSES: Record<string, string> = {
  default: "bg-card",
  sage: "bg-sage-deep/5",
  sky: "bg-sky/8",
  clay: "bg-clay/5",
};

export function NotesBoard({ notes }: { notes: NoteView[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [focused, setFocused] = useState(false);
  const [, startTransition] = useTransition();

  function add() {
    if (!title.trim() && !content.trim()) return;
    startTransition(async () => {
      const res = await createNote({ title, content });
      if (res.ok) {
        setTitle("");
        setContent("");
        setFocused(false);
        router.refresh();
      } else toast.error(res.error ?? "Empty note");
    });
  }

  const pinned = notes.filter((n) => n.pinned);
  const unpinned = notes.filter((n) => !n.pinned);

  return (
    <div className="space-y-8">
      {/* Composer card */}
      <div
        className={cn(
          "rounded-2xl border border-border/50 bg-card shadow-soft transition-all duration-200",
          focused ? "border-sage-deep/30" : ""
        )}
      >
        <div className="px-5 pt-5">
          {focused && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              autoFocus
              className="mb-2 w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/40"
            />
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Take a note…"
            rows={focused ? 4 : 2}
            className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/40"
          />
        </div>
        {focused && (
          <div className="flex items-center justify-between border-t border-border/40 px-5 py-3">
            <button
              onClick={() => {
                setFocused(false);
                setTitle("");
                setContent("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={add}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-sage-deep px-4 text-xs font-semibold text-sage-deep-foreground transition-all hover:-translate-y-px hover:bg-sage-deep/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer"
            >
              <Plus className="size-3" /> Save note
            </button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {notes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 py-20 text-center">
          <NotebookPen className="mb-3 size-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">Nothing captured yet.</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Your thoughts will gather here.</p>
        </div>
      )}

      {/* Pinned section */}
      {pinned.length > 0 && (
        <div>
          <p className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/60">
            <Pin className="size-3" /> Pinned
          </p>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {pinned.map((n) => (
              <NoteCard key={n.id} note={n} onChange={() => router.refresh()} />
            ))}
          </div>
        </div>
      )}

      {/* Other notes */}
      {unpinned.length > 0 && (
        <div>
          {pinned.length > 0 && (
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/60">
              Others
            </p>
          )}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {unpinned.map((n) => (
              <NoteCard key={n.id} note={n} onChange={() => router.refresh()} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NoteCard({
  note,
  onChange,
}: {
  note: NoteView;
  onChange: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [, startTransition] = useTransition();

  function persist(patch: { title?: string; content?: string; pinned?: boolean }) {
    startTransition(async () => {
      await updateNote(note.id, patch);
      onChange();
    });
  }

  return (
    <div
      className={cn(
        "group break-inside-avoid rounded-2xl border border-border/50 p-4 transition-all duration-200 hover:border-border/80 hover:shadow-lift",
        COLOR_CLASSES[note.color] ?? COLOR_CLASSES.default
      )}
    >
      {/* Card header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title !== note.title && persist({ title })}
          placeholder="Title"
          className="flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/40"
        />
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => persist({ pinned: !note.pinned })}
            aria-label={note.pinned ? "Unpin" : "Pin"}
            className={cn(
              "grid size-7 place-items-center rounded-lg transition-colors hover:bg-accent/40 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50",
              note.pinned ? "text-sage-deep" : "text-muted-foreground"
            )}
          >
            <Pin className="size-3.5" />
          </button>
          <button
            onClick={() =>
              startTransition(async () => {
                await deleteNote(note.id);
                onChange();
              })
            }
            aria-label="Delete note"
            className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => content !== note.content && persist({ content })}
        rows={Math.min(10, Math.max(2, Math.ceil(content.length / 36)))}
        placeholder="Empty note…"
        className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground/85 outline-none placeholder:text-muted-foreground/40"
      />

      {/* Pinned indicator */}
      {note.pinned && (
        <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-sage-deep/60">
          <Pin className="size-2.5" /> Pinned
        </div>
      )}
    </div>
  );
}
