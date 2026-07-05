"use client";

import {
  createVaultItem,
  deleteVaultItem,
  revealVaultSecret,
} from "@/app/lib/actions/vault";
import { cn } from "@/lib/utils";
import {
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { OceanSelect } from "@/components/ui/ocean-select";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Category = "PASSWORD" | "NOTE" | "CARD" | "KEY" | "OTHER";

export interface VaultItemView {
  id: string;
  title: string;
  category: Category;
  username: string | null;
  url: string | null;
}

const CATEGORIES: Category[] = ["PASSWORD", "NOTE", "CARD", "KEY", "OTHER"];

const CATEGORY_ICONS: Record<Category, string> = {
  PASSWORD: "🔑",
  NOTE: "📄",
  CARD: "💳",
  KEY: "🗝️",
  OTHER: "📦",
};

export function VaultManager({ items }: { items: VaultItemView[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "PASSWORD" as Category,
    username: "",
    url: "",
    secret: "",
  });
  const [, startTransition] = useTransition();

  function submit() {
    if (!form.title.trim() || !form.secret) {
      toast.error("A title and a secret are required");
      return;
    }
    startTransition(async () => {
      const res = await createVaultItem(form);
      if (res.ok) {
        setForm({ title: "", category: "PASSWORD", username: "", url: "", secret: "" });
        setOpen(false);
        toast.success("Saved to your vault");
        router.refresh();
      } else toast.error(res.error ?? "Could not save");
    });
  }

  return (
    <div className="space-y-6">
      {/* Security notice + CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card px-5 py-4 shadow-soft">
        <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <Lock className="size-4 shrink-0 text-sage-deep/70" />
          Everything is encrypted at rest with AES-256-GCM.
        </p>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-sage-deep px-4 text-sm font-semibold text-sage-deep-foreground transition-all hover:-translate-y-px hover:bg-sage-deep/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer"
        >
          <Plus className="size-3.5" /> New item
        </button>
      </div>

      {/* Inline add form */}
      {open && (
        <div className="rounded-2xl border border-border/50 bg-card shadow-soft overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
            <h3 className="font-serif text-base font-bold">New vault item</h3>
            <button
              onClick={() => setOpen(false)}
              className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent/30 hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Email account"
                  className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <OceanSelect
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                  className="h-10"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_ICONS[c]} {c.charAt(0) + c.slice(1).toLowerCase()}
                    </option>
                  ))}
                </OceanSelect>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Username / label</label>
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Optional"
                  className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">URL</label>
                <input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="Optional"
                  className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Secret</label>
              <textarea
                value={form.secret}
                onChange={(e) => setForm({ ...form, secret: e.target.value })}
                placeholder="The password, key, or private note to encrypt"
                rows={3}
                className="w-full resize-none rounded-xl border border-border/60 bg-background p-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="h-9 rounded-full border border-border/60 px-4 text-sm text-muted-foreground hover:bg-accent/20 hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="h-9 rounded-full bg-sage-deep px-5 text-sm font-semibold text-sage-deep-foreground transition-all hover:-translate-y-px hover:bg-sage-deep/90 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
              >
                Encrypt &amp; save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items table */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 py-20 text-center">
          <KeyRound className="mb-3 size-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">Your vault is empty.</p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Keep passwords, keys and private notes safe here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-soft">
          {/* Table header */}
          <div className="hidden items-center border-b border-border/40 px-6 py-3 sm:flex">
            <div className="flex-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/60">
              Item
            </div>
            <div className="w-24 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/60">
              Category
            </div>
            <div className="w-40 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/60">
              Username
            </div>
            <div className="w-28 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/60">
              Secret
            </div>
          </div>

          {/* Rows */}
          <ul>
            {items.map((it, i) => (
              <VaultRow
                key={it.id}
                item={it}
                isLast={i === items.length - 1}
                onChange={() => router.refresh()}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function VaultRow({
  item,
  isLast,
  onChange,
}: {
  item: VaultItemView;
  isLast: boolean;
  onChange: () => void;
}) {
  const [secret, setSecret] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function reveal() {
    if (revealed) { setRevealed(false); return; }
    if (secret !== null) { setRevealed(true); return; }
    setLoading(true);
    const res = await revealVaultSecret(item.id);
    setLoading(false);
    if (res.ok && res.secret !== undefined) {
      setSecret(res.secret);
      setRevealed(true);
    } else {
      toast.error(res.error ?? "Could not decrypt");
    }
  }

  async function copy() {
    let value = secret;
    if (value === null) {
      const res = await revealVaultSecret(item.id);
      if (!res.ok || res.secret === undefined) { toast.error("Could not copy"); return; }
      value = res.secret;
      setSecret(value);
    }
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  }

  return (
    <li
      className={cn(
        "group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/10",
        !isLast && "border-b border-border/40"
      )}
    >
      {/* Icon + title */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sage-deep/8 text-sm">
          {CATEGORY_ICONS[item.category]}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{item.title}</div>
          {item.url && (
            <div className="truncate text-[11px] text-muted-foreground/60">{item.url}</div>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="hidden w-24 shrink-0 sm:block">
        <span className="inline-flex rounded-full bg-accent/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {item.category.toLowerCase()}
        </span>
      </div>

      {/* Username */}
      <div className="hidden w-40 shrink-0 truncate text-sm text-muted-foreground sm:block">
        {item.username ?? "—"}
      </div>

      {/* Secret + actions */}
      <div className="flex w-28 shrink-0 items-center justify-end gap-1">
        <code
          className={cn(
            "mr-1 flex-1 truncate font-mono text-xs",
            revealed ? "text-foreground" : "tracking-widest text-muted-foreground/40"
          )}
        >
          {revealed && secret !== null ? secret : "••••••••"}
        </code>
        <button
          onClick={reveal}
          aria-label={revealed ? "Hide" : "Reveal"}
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/30 hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : revealed ? (
            <EyeOff className="size-3.5" />
          ) : (
            <Eye className="size-3.5" />
          )}
        </button>
        <button
          onClick={copy}
          aria-label="Copy"
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/30 hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
        >
          <Copy className="size-3.5" />
        </button>
        <button
          onClick={() =>
            startTransition(async () => {
              await deleteVaultItem(item.id);
              onChange();
            })
          }
          aria-label="Delete"
          className="grid size-7 place-items-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  );
}
