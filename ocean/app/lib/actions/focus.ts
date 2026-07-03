"use server";

import prisma from "../db";
import { requireUser } from "../hook";
import { revalidatePath } from "next/cache";

async function uid() {
  const session = await requireUser();
  return session.user!.id as string;
}

/** Record a completed focus session (called when a pomodoro finishes). */
export async function logFocusSession(input: { minutes: number; label?: string }) {
  const userId = await uid();
  const minutes = Math.max(1, Math.min(Math.round(input.minutes), 24 * 60));
  await prisma.focusSession.create({
    data: {
      minutes,
      label: input.label?.slice(0, 120) ?? null,
      userId,
    },
  });
  revalidatePath("/dashboard/focus");
  revalidatePath("/dashboard");
  return { ok: true };
}
