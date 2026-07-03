"use client";
import { useFormStatus } from "react-dom";
import GoogleLogo from "@/public/google-icon-logo-svgrepo-com.svg";
import GithubLogo from "@/public/github.svg";
import { Button } from "./ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
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

export function SubmitButton({ text, variant, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button variant="outline" disabled className={cn("w-full", className)}>
        <Loader2 className="mr-2 size-4 animate-spin" /> Please wait…
      </Button>
    );
  }
  return (
    <Button className={cn("w-full", className)} type="submit" variant={variant}>
      {text}
    </Button>
  );
}

export function GithubAuthButton() {
  const { pending } = useFormStatus();
  return pending ? (
    <Button variant="outline" disabled className="w-full">
      <Loader2 className="mr-2 size-4 animate-spin" /> Please wait…
    </Button>
  ) : (
    <Button className="w-full" variant="outline">
      <Image src={GithubLogo} alt="" className="size-5" /> Continue with GitHub
    </Button>
  );
}

export function GoogleAuthButton() {
  const { pending } = useFormStatus();
  return pending ? (
    <Button variant="outline" disabled className="w-full">
      <Loader2 className="mr-2 size-4 animate-spin" /> Please wait…
    </Button>
  ) : (
    <Button className="w-full" variant="outline">
      <Image src={GoogleLogo} alt="" className="size-5" /> Continue with Google
    </Button>
  );
}
