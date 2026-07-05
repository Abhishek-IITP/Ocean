"use client";

import { useState } from "react";
import { Sparkles, Loader2, X, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MeetingPrepButtonProps {
  title: string;
  guestName: string;
}

interface PrepData {
  contextConnection: string;
  talkingPoints: string[];
}

export function MeetingPrepButton({ title, guestName }: MeetingPrepButtonProps) {
  const [loading, setLoading] = useState(false);
  const [prepData, setPrepData] = useState<PrepData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function getPrep() {
    if (prepData) {
      setExpanded(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/meetings/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, guestName }),
      });
      const resData = await res.json();
      if (resData.ok && resData.data) {
        setPrepData(resData.data);
        setExpanded(true);
      } else {
        toast.error(resData.error ?? "Failed to compile prep details");
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not fetch prep details.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!prepData) return;
    const text = `Meeting: ${title}\nContext: ${prepData.contextConnection}\n\nTalking Points:\n${prepData.talkingPoints.map((tp, i) => `${i + 1}. ${tp}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Talking points copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-2 space-y-3">
      {/* Action link */}
      <div className="flex items-center gap-2">
        {!expanded ? (
          <button
            type="button"
            onClick={getPrep}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage-deep hover:text-sage-deep/80 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Sparkles className="size-3" />
            )}
            {loading ? "Preparing Talking Points..." : "Prep Agenda"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-3" /> Hide Prep Agenda
          </button>
        )}
      </div>

      {/* Expanded panel */}
      {expanded && prepData && (
        <div className="rounded-xl border border-sage-deep/15 bg-sage-deep/[0.01] p-4 text-left text-xs space-y-3 animate-rise select-all relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="font-bold text-sage-deep/90 uppercase tracking-wider text-[9px] flex items-center gap-1">
              <Sparkles className="size-3" /> Ocean AI Talking Points
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded p-1 text-muted-foreground hover:bg-accent/40 hover:text-foreground cursor-pointer focus-visible:outline-none"
              title="Copy talking points"
            >
              {copied ? (
                <Check className="size-3 text-sage-deep" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>

          <p className="font-serif italic text-foreground/80 leading-relaxed border-l-2 border-sage-deep/30 pl-3">
            &ldquo;{prepData.contextConnection}&rdquo;
          </p>

          <ul className="list-decimal pl-4.5 space-y-1.5 text-foreground/90 font-medium">
            {prepData.talkingPoints.map((tp, idx) => (
              <li key={idx} className="leading-relaxed">
                {tp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
