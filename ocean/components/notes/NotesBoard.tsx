"use client";

import { createNote, deleteNote, updateNote } from "@/app/lib/actions/notes";
import { cn } from "@/lib/utils";
import { Pin, PinOff, Plus, Trash2 } from "lucide-react";
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

const COLORS: Record<string, string> = {
  default: "bg-card",
  sage: "bg-accent/40",
  sand: "bg-sand/40",
  sky: "bg-sky/15",
};

export function NotesBoard({ notes }: { notes: NoteView[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [, startTransition] = useTransition();

  function add() {
    if (!title.trim() && !content.trim()) return;
    startTransition(async () => {
      const res = await createNote({ title, content });
      if (res.ok) {
        setTitle("");
        setContent("");
        router.refresh();
      } else toast.error(res.error ?? "Empty note");
    });
  }

  return (
    <div className="space-y-6">
      {/* composer */}
      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent text-base font-semibold outline-none placeholder:text-muted-foreground/60"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Take a note…"
          rows={2}
          className="mt-2 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={add}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-px"
          >
            <Plus className="size-4" /> Save note
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-14 text-center">
          <p className="text-sm text-muted-foreground">
            Nothing captured yet. Your thoughts will gather here.
          </p>
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {notes.map((n) => (
            <NoteCard key={n.id} note={n} onChange={() => router.refresh()} />
          ))}
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
        "group break-inside-avoid rounded-2xl border border-border/70 p-4 shadow-soft transition-shadow hover:shadow-lift",
        COLORS[note.color] ?? COLORS.default
      )}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title !== note.title && persist({ title })}
          placeholder="Title"
          className="flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground/50"
        />
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            onClick={() => persist({ pinned: !note.pinned })}
            aria-label={note.pinned ? "Unpin" : "Pin"}
            className={cn(
              "grid size-7 place-items-center rounded-md transition-colors hover:bg-accent/40",
              note.pinned ? "text-sage-deep" : "text-muted-foreground opacity-0 group-hover:opacity-100"
            )}
          >
            {note.pinned ? <Pin className="size-3.5" /> : <PinOff className="size-3.5" />}
          </button>
          <button
            onClick={() =>
              startTransition(async () => {
                await deleteNote(note.id);
                onChange();
              })
            }
            aria-label="Delete note"
            className="grid size-7 place-items-center rounded-md text-muted-foreground opacity-0 transition-colors hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => content !== note.content && persist({ content })}
        rows={Math.min(10, Math.max(2, Math.ceil(content.length / 34)))}
        placeholder="Empty note"
        className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground/90 outline-none placeholder:text-muted-foreground/50"
      />
    </div>
  );
}
