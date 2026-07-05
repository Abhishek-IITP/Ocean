import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { signInWithGithub, signInWithGoogle } from "@/app/lib/authActions";
import { GithubAuthButton, GoogleAuthButton } from "./SubmitButtons";
import { OceanMark } from "./Logo";

export function AuthModel({ label = "Start free" }: { label?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{label}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] rounded-2xl border border-border p-8">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center justify-center gap-2 text-center font-serif text-3xl">
            <OceanMark className="size-8" />
            Ocean
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            Welcome to a calmer way of planning your day.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <form action={signInWithGoogle} className="w-full">
            <GoogleAuthButton />
          </form>

          <form action={signInWithGithub} className="w-full">
            <GithubAuthButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
