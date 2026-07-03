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
} from "lucide-react";
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
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-accent/25 p-4">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="size-4 text-sage-deep" />
          Everything here is encrypted at rest with AES-256-GCM. Secrets stay
          hidden until you reveal them.
        </p>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-px"
        >
          <Plus className="size-4" /> New item
        </button>
      </div>

      {open && (
        <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title (e.g. Email account)"
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as Category })
              }
              className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0) + c.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username / label (optional)"
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="URL (optional)"
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <textarea
            value={form.secret}
            onChange={(e) => setForm({ ...form, secret: e.target.value })}
            placeholder="The secret — password, key, or private note"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="h-10 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-accent/30"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="h-10 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-px"
            >
              Encrypt & save
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <KeyRound className="mx-auto size-6 text-sage-deep" />
          <p className="mt-3 text-sm text-muted-foreground">
            Your vault is empty. Keep passwords, keys and private notes safe here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((it) => (
            <VaultRow key={it.id} item={it} onChange={() => router.refresh()} />
          ))}
        </div>
      )}
    </div>
  );
}

function VaultRow({
  item,
  onChange,
}: {
  item: VaultItemView;
  onChange: () => void;
}) {
  const [secret, setSecret] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function reveal() {
    if (revealed) {
      setRevealed(false);
      return;
    }
    if (secret !== null) {
      setRevealed(true);
      return;
    }
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
      if (!res.ok || res.secret === undefined) {
        toast.error("Could not copy");
        return;
      }
      value = res.secret;
      setSecret(value);
    }
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="group rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-accent/50 text-sage-deep">
              <KeyRound className="size-4" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold">{item.title}</h3>
              <p className="truncate text-xs text-muted-foreground">
                {item.username || item.category.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() =>
            startTransition(async () => {
              await deleteVaultItem(item.id);
              onChange();
            })
          }
          aria-label="Delete"
          className="grid size-7 place-items-center rounded-md text-muted-foreground opacity-0 transition-colors hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
        <code
          className={cn(
            "flex-1 truncate font-mono text-sm",
            !revealed && "tracking-widest text-muted-foreground"
          )}
        >
          {revealed && secret !== null ? secret : "••••••••••••"}
        </code>
        <button
          onClick={reveal}
          aria-label={revealed ? "Hide" : "Reveal"}
          className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : revealed ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
        <button
          onClick={copy}
          aria-label="Copy"
          className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
        >
          <Copy className="size-4" />
        </button>
      </div>
    </div>
  );
}
