"use client";

import { useActionState, useState } from "react";
import { SubmitButton } from "./SubmitButtons";
import { SettingsAction } from "@/app/action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { settingsSchema } from "@/app/lib/zodSchemas";
import { X } from "lucide-react";
import { UploadDropzone } from "@/app/lib/uploadthings";
import { toast } from "sonner";

interface SettingsFormProps {
  fullName?: string;
  email?: string;
  profileImage?: string;
}

export function SettingsForm({ fullName, email, profileImage }: SettingsFormProps) {
  const [lastResult, action] = useActionState(SettingsAction, undefined);
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: settingsSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      className="space-y-8"
    >
      {/* Profile image section */}
      <div className="rounded-2xl border border-border/50 bg-card shadow-soft overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4">
          <h2 className="font-serif text-base font-bold">Profile photo</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            This shows on your public booking page.
          </p>
        </div>
        <div className="flex items-start gap-8 px-6 py-6">
          <input
            type="hidden"
            name={fields.profileImage.name}
            key={fields.profileImage.id}
            value={currentProfileImage}
          />
          {currentProfileImage ? (
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentProfileImage}
                alt="Profile"
                className="size-20 rounded-2xl object-cover border border-border/50"
              />
              <button
                type="button"
                onClick={() => setCurrentProfileImage("")}
                className="absolute -right-2 -top-2 grid size-6 cursor-pointer place-items-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition-transform hover:-translate-y-px focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
                aria-label="Remove photo"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex-1">
              <UploadDropzone
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url);
                  toast.success("Photo uploaded");
                }}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
                endpoint={"imageUploader"}
              />
            </div>
          )}
          {currentProfileImage && (
            <div className="flex-1 text-sm text-muted-foreground leading-relaxed">
              <p>Your photo looks great.</p>
              <p className="mt-1 text-xs">Click the × to replace it.</p>
            </div>
          )}
        </div>
        {fields.profileImage.errors && (
          <div className="border-t border-border/40 px-6 py-3 text-sm text-destructive">
            {fields.profileImage.errors}
          </div>
        )}
      </div>

      {/* Account details */}
      <div className="rounded-2xl border border-border/50 bg-card shadow-soft overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4">
          <h2 className="font-serif text-base font-bold">Account details</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your display name and sign-in email.
          </p>
        </div>
        <div className="space-y-5 px-6 py-6">
          {/* Full name */}
          <div className="space-y-1.5">
            <label
              className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/70"
            >
              Full name
            </label>
            <input
              name={fields.fullName.name}
              key={fields.fullName.id}
              defaultValue={fullName}
              placeholder="Your name"
              type="text"
              className="h-11 w-full rounded-xl border border-border/60 bg-background px-4 text-sm outline-none transition-colors focus:border-sage-deep/40 focus-visible:ring-1 focus-visible:ring-sage-deep/50"
            />
            {fields.fullName.errors && (
              <p className="text-xs text-destructive">{fields.fullName.errors}</p>
            )}
          </div>

          {/* Email — read-only */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
              Email
            </label>
            <input
              disabled
              defaultValue={email}
              type="email"
              className="h-11 w-full rounded-xl border border-border/40 bg-muted/30 px-4 text-sm text-muted-foreground outline-none cursor-not-allowed"
            />
            <p className="text-[11px] text-muted-foreground/60">
              Email cannot be changed — it&apos;s tied to your sign-in.
            </p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <SubmitButton
          text="Save changes"
          className="h-10 rounded-full bg-sage-deep px-6 text-sm font-semibold text-sage-deep-foreground transition-all hover:-translate-y-px hover:bg-sage-deep/90"
        />
      </div>
    </form>
  );
}