"use client";

import { useFormStatus } from "react-dom";
import GoogleLogo from "@/public/google-icon-logo-svgrepo-com.svg";
import GithubLogo from "@/public/github.svg";
import { Button } from "./ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  text: string;
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

/**
 * Premium Loading Indicator showing three calm pulsing dots in sequence
 */
function FormPendingIndicator({ text = "Connecting..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 justify-center select-none">
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse duration-1000" />
        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse duration-1000 delay-150" />
        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse duration-1000 delay-300" />
      </div>
      <span className="text-xs font-semibold text-muted-foreground/80 tracking-wide font-sans">
        {text}
      </span>
    </div>
  );
}

export function SubmitButton({ text, variant = "default", className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      variant={variant}
      className={cn(
        "w-full h-11 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs select-none",
        variant === "default" && "bg-sage-deep hover:bg-sage-deep/90 text-sage-deep-foreground border border-sage-deep/10 hover:-translate-y-px hover:shadow-soft active:translate-y-px",
        variant === "outline" && "border border-border/80 bg-background hover:bg-accent/40 hover:-translate-y-px hover:shadow-soft active:translate-y-px",
        pending && "opacity-80 pointer-events-none hover:translate-y-0 active:translate-y-0 shadow-none",
        className
      )}
    >
      {pending ? <FormPendingIndicator text="Saving workspace..." /> : text}
    </Button>
  );
}

export function GithubAuthButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      variant="outline"
      className={cn(
        "w-full h-11 rounded-xl border border-border/80 bg-card hover:bg-accent/40 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/80 transition-all duration-200 hover:-translate-y-px hover:shadow-soft active:translate-y-px flex items-center justify-center gap-3 cursor-pointer select-none",
        pending && "opacity-80 pointer-events-none hover:translate-y-0 active:translate-y-0 shadow-none"
      )}
    >
      {pending ? (
        <FormPendingIndicator text="Securing GitHub connection..." />
      ) : (
        <>
          <Image src={GithubLogo} alt="GitHub Logo" className="size-5 shrink-0 dark:invert transition-transform duration-300 group-hover:scale-105" />
          <span className="font-semibold text-foreground tracking-wide">Continue with GitHub</span>
        </>
      )}
    </Button>
  );
}

export function GoogleAuthButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      variant="outline"
      className={cn(
        "w-full h-11 rounded-xl border border-border/80 bg-card hover:bg-accent/40 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/80 transition-all duration-200 hover:-translate-y-px hover:shadow-soft active:translate-y-px flex items-center justify-center gap-3 cursor-pointer select-none",
        pending && "opacity-80 pointer-events-none hover:translate-y-0 active:translate-y-0 shadow-none"
      )}
    >
      {pending ? (
        <FormPendingIndicator text="Verifying Google account..." />
      ) : (
        <>
          <Image src={GoogleLogo} alt="Google Logo" className="size-5 shrink-0 transition-transform duration-300 group-hover:scale-105" />
          <span className="font-semibold text-foreground tracking-wide">Continue with Google</span>
        </>
      )}
    </Button>
  );
}
