"use client";

import { saveJournal } from "@/app/lib/actions/journal";
import { cn } from "@/lib/utils";
import {
  Bold,
  Check,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Strikethrough,
  Type,
  Underline,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

type Kind = "DAILY" | "WEEKLY" | "MONTHLY";

export interface JournalEntryView {
  content: string;
  gratitude: string | null;
  mood: string | null;
}

const PROMPTS: Record<Kind, { label: string; prompt: string; sub: string }> = {
  DAILY: {
    label: "Today",
    prompt: "How did today feel?",
    sub: "What went well, what drained you, what do you want to carry forward?",
  },
  WEEKLY: {
    label: "This week",
    prompt: "Looking back on the week —",
    sub: "What mattered, what would you change, what are you learning?",
  },
  MONTHLY: {
    label: "This month",
    prompt: "A wider view.",
    sub: "What are you proud of? Where are you headed? What patterns do you notice?",
  },
};

type ToolbarCommand =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "formatBlock";

interface ToolbarAction {
  icon: React.ElementType;
  label: string;
  command: ToolbarCommand;
  value?: string;
}

const TOOLBAR: ToolbarAction[] = [
  { icon: Bold, label: "Bold", command: "bold" },
  { icon: Italic, label: "Italic", command: "italic" },
  { icon: Underline, label: "Underline", command: "underline" },
  { icon: Strikethrough, label: "Strikethrough", command: "strikeThrough" },
  { icon: Heading2, label: "Heading", command: "formatBlock", value: "h3" },
  { icon: Quote, label: "Quote", command: "formatBlock", value: "blockquote" },
  { icon: List, label: "Bullet list", command: "insertUnorderedList" },
  { icon: ListOrdered, label: "Numbered list", command: "insertOrderedList" },
];

interface SlashCommandOption {
  icon: React.ElementType;
  label: string;
  sub: string;
  command: ToolbarCommand;
  value?: string;
}

const SLASH_COMMANDS: SlashCommandOption[] = [
  {
    icon: Type,
    label: "Normal Text",
    sub: "Plain text format",
    command: "formatBlock",
    value: "p",
  },
  {
    icon: Heading2,
    label: "Heading",
    sub: "Large serif display section heading",
    command: "formatBlock",
    value: "h3",
  },
  {
    icon: Quote,
    label: "Blockquote",
    sub: "Dignified editorial quote block",
    command: "formatBlock",
    value: "blockquote",
  },
  {
    icon: List,
    label: "Bulleted List",
    sub: "Simple bulleted list items",
    command: "insertUnorderedList",
  },
  {
    icon: ListOrdered,
    label: "Numbered List",
    sub: "Sequential numbered list items",
    command: "insertOrderedList",
  },
];

function ToolbarButton({
  action,
  active,
}: {
  action: ToolbarAction;
  active: boolean;
}) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (action.command === "formatBlock" && action.value) {
      document.execCommand(action.command, false, action.value);
    } else {
      document.execCommand(action.command, false, undefined);
    }
  }

  return (
    <button
      type="button"
      onMouseDown={handleClick}
      aria-label={action.label}
      title={action.label}
      className={cn(
        "grid size-8 place-items-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer",
        active
          ? "bg-sage-deep/10 text-sage-deep"
          : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
      )}
    >
      <action.icon className="size-3.5" />
    </button>
  );
}

function RichEditor({
  initialHtml,
  onChange,
  placeholder,
}: {
  initialHtml: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());
  const [isEmpty, setIsEmpty] = useState(!initialHtml);

  // Editor.js type floating toolbar coordinates
  const [floatingMenu, setFloatingMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({ visible: false, x: 0, y: 0 });

  // Notion-style slash command overlay coordinates
  const [slashMenu, setSlashMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    activeIndex: number;
  }>({ visible: false, x: 0, y: 0, activeIndex: 0 });

  // Sync active commands on selection change
  const updateActive = useCallback(() => {
    const commands: string[] = [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "insertUnorderedList",
      "insertOrderedList",
    ];
    const active = new Set<string>();
    for (const cmd of commands) {
      if (document.queryCommandState(cmd)) active.add(cmd);
    }
    // Check formatBlock
    const block = document.queryCommandValue("formatBlock");
    if (block === "h3") active.add("formatBlock-h3");
    if (block === "blockquote") active.add("formatBlock-blockquote");
    if (block === "p") active.add("formatBlock-p");
    setActiveCommands(active);
  }, []);

  // Selection change to show floating menu above highlighted text
  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !editorRef.current) {
      setFloatingMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    if (!editorRef.current.contains(sel.anchorNode)) {
      setFloatingMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = editorRef.current.parentElement?.getBoundingClientRect();

    if (containerRect) {
      setFloatingMenu({
        visible: true,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 44,
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateActive);
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", updateActive);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [updateActive, handleSelectionChange]);

  // Set initial HTML
  useEffect(() => {
    if (editorRef.current && initialHtml !== undefined) {
      editorRef.current.innerHTML = initialHtml || "";
      setIsEmpty(!initialHtml);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleInput() {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    const textContent = el.textContent ?? "";
    setIsEmpty(!textContent.trim());
    onChange(html);
  }

  function isActive(action: ToolbarAction): boolean {
    if (action.command === "formatBlock" && action.value) {
      return activeCommands.has(`formatBlock-${action.value}`);
    }
    return activeCommands.has(action.command);
  }

  // Get current cursor coordinates to align slash menu
  function getCaretCoordinates() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0).cloneRange();
    range.collapse(false);
    const rect = range.getBoundingClientRect();
    return rect.width === 0 && rect.height === 0 ? null : rect;
  }

  const applySlashCommand = (cmd: ToolbarCommand, val?: string) => {
    // Delete the "/" character
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      // We want to delete the last character which is '/'
      range.setStart(range.startContainer, Math.max(0, range.startOffset - 1));
      range.deleteContents();
    }

    // Apply the block format command
    if (cmd === "formatBlock" && val) {
      document.execCommand(cmd, false, val);
    } else {
      document.execCommand(cmd, false, undefined);
    }

    setSlashMenu({ visible: false, x: 0, y: 0, activeIndex: 0 });
    handleInput();
    updateActive();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (slashMenu.visible) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashMenu((prev) => ({
          ...prev,
          activeIndex: (prev.activeIndex + 1) % SLASH_COMMANDS.length,
        }));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashMenu((prev) => ({
          ...prev,
          activeIndex:
            (prev.activeIndex - 1 + SLASH_COMMANDS.length) % SLASH_COMMANDS.length,
        }));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = SLASH_COMMANDS[slashMenu.activeIndex];
        applySlashCommand(selected.command, selected.value);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSlashMenu((prev) => ({ ...prev, visible: false }));
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    updateActive();

    // Check if the user typed "/"
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const text = range.startContainer.textContent || "";
      const offset = range.startOffset;

      const charBefore = text.slice(Math.max(0, offset - 1), offset);
      if (charBefore === "/") {
        const rect = getCaretCoordinates();
        const containerRect = editorRef.current?.parentElement?.getBoundingClientRect();
        if (rect && containerRect) {
          setSlashMenu({
            visible: true,
            x: rect.left - containerRect.left,
            y: rect.bottom - containerRect.top + 8,
            activeIndex: 0,
          });
        }
        return;
      }
    }

    if (slashMenu.visible) {
      setSlashMenu((prev) => ({ ...prev, visible: false }));
    }
  };

  return (
    <div className="flex flex-col relative">
      {/* Formatting toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/40 px-5 py-2.5">
        {TOOLBAR.map((action, i) => {
          // Separator before heading tools
          const showSep = i === 4 || i === 6;
          return (
            <span key={action.label} className="flex items-center gap-0.5">
              {showSep && (
                <span className="mx-1.5 inline-block h-5 w-px bg-border/60" />
              )}
              <ToolbarButton action={action} active={isActive(action)} />
            </span>
          );
        })}
      </div>

      {/* Editable area */}
      <div className="relative px-7 py-5">
        {isEmpty && (
          <span
            className="pointer-events-none absolute left-7 top-5 text-sm text-muted-foreground/40 select-none"
            aria-hidden
          >
            {placeholder ?? "Write freely…"}
          </span>
        )}

        {/* Floating selection formatting menu */}
        {floatingMenu.visible && (
          <div
            className="absolute z-40 flex items-center gap-0.5 rounded-lg border border-border/60 bg-popover p-1 shadow-soft -translate-x-1/2 select-none animate-in fade-in zoom-in duration-100"
            style={{
              left: `${floatingMenu.x}px`,
              top: `${floatingMenu.y}px`,
            }}
          >
            {TOOLBAR.slice(0, 4).map((action) => (
              <ToolbarButton
                key={action.label}
                action={action}
                active={isActive(action)}
              />
            ))}
          </div>
        )}

        {/* Floating slash command menu */}
        {slashMenu.visible && (
          <div
            className="absolute z-50 w-56 rounded-xl border border-border/60 bg-popover p-1.5 shadow-soft select-none animate-in fade-in slide-in-from-top-2 duration-100"
            style={{
              left: `${slashMenu.x}px`,
              top: `${slashMenu.y}px`,
            }}
          >
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Insert Block
            </div>
            <div className="space-y-0.5 mt-1">
              {SLASH_COMMANDS.map((item, idx) => {
                const active = idx === slashMenu.activeIndex;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => applySlashCommand(item.command, item.value)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors cursor-pointer focus:outline-none",
                      active
                        ? "bg-accent/40 text-foreground"
                        : "text-muted-foreground hover:bg-accent/20 hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4 shrink-0",
                        active ? "text-sage-deep" : "text-muted-foreground/70"
                      )}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[9px] text-muted-foreground/80 truncate leading-none mt-0.5">
                        {item.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onMouseUp={updateActive}
          className={cn(
            "min-h-[280px] w-full text-sm leading-[1.85] text-foreground outline-none",
            // Prose styles for formatted content
            "[&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-foreground",
            "[&_blockquote]:border-l-2 [&_blockquote]:border-sage-deep/40 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_blockquote]:my-3",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1",
            "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1",
            "[&_li]:text-sm",
            "[&_b]:font-semibold",
            "[&_strong]:font-semibold",
            "[&_em]:italic",
            "[&_u]:underline",
            "[&_s]:line-through [&_s]:text-muted-foreground"
          )}
        />
      </div>
    </div>
  );
}

export function JournalEditor({
  entries,
  dynamicDailyPrompt,
}: {
  entries: Record<Kind, JournalEntryView | null>;
  dynamicDailyPrompt?: string;
}) {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("DAILY");
  const current = entries[kind];
  const [content, setContent] = useState(current?.content ?? "");
  const [gratitude, setGratitude] = useState(current?.gratitude ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  // Track the editor key to force re-mount when switching tabs
  const [editorKey, setEditorKey] = useState(kind);

  function switchKind(k: Kind) {
    setKind(k);
    setEditorKey(k);
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
        setTimeout(() => setSaved(false), 2500);
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-soft">
      {/* Tab bar */}
      <div className="flex border-b border-border/40">
        {(Object.keys(PROMPTS) as Kind[]).map((k) => (
          <button
            key={k}
            onClick={() => switchKind(k)}
            className={cn(
              "flex-1 px-5 py-3.5 text-sm font-medium transition-colors focus-visible:outline-none cursor-pointer",
              kind === k
                ? "border-b-2 border-sage-deep text-sage-deep"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {PROMPTS[k].label}
          </button>
        ))}
      </div>

      {/* Prompt */}
      <div className="px-7 pt-6 pb-2">
        <p className="font-serif text-xl font-bold text-foreground">
          {kind === "DAILY" && dynamicDailyPrompt ? "Today's Reflection Focus" : PROMPTS[kind].prompt}
        </p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed text-justify">
          {kind === "DAILY" && dynamicDailyPrompt ? dynamicDailyPrompt : PROMPTS[kind].sub}
        </p>
      </div>

      {/* Rich editor */}
      <RichEditor
        key={editorKey}
        initialHtml={entries[kind]?.content ?? ""}
        onChange={setContent}
        placeholder="Write freely…"
      />

      {/* Divider */}
      <div className="mx-7 border-t border-border/40" />

      {/* Gratitude + Save */}
      <div className="px-7 py-5">
        <label className="block text-xs font-bold uppercase tracking-[0.16em] text-sage-deep/70 mb-2">
          One thing I&apos;m grateful for today
        </label>
        <input
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="A small good thing…"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/40 border-b border-border/40 pb-2 transition-colors focus:border-sage-deep/50"
        />

        <div className="mt-5 flex justify-end">
          <button
            onClick={save}
            disabled={pending}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
              saved
                ? "bg-sage-deep/10 text-sage-deep"
                : "bg-sage-deep text-sage-deep-foreground hover:-translate-y-px hover:bg-sage-deep/90"
            )}
          >
            {pending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : saved ? (
              <Check className="size-3.5" />
            ) : null}
            {pending ? "Saving…" : saved ? "Saved" : "Save reflection"}
          </button>
        </div>
      </div>
    </div>
  );
}
