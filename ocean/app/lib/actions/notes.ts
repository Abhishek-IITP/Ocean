"use server";

import prisma from "../db";
import { requireUser } from "../hook";
import { revalidatePath } from "next/cache";

async function uid() {
  const session = await requireUser();
  return session.user!.id as string;
}

export async function createNote(input: {
  title?: string;
  content?: string;
  color?: string;
}) {
  const userId = await uid();
  const title = (input.title ?? "").trim();
  const content = (input.content ?? "").trim();
  if (!title && !content) return { ok: false, error: "Note is empty" };
  const note = await prisma.note.create({
    data: {
      title: title.slice(0, 200),
      content: content.slice(0, 10000),
      color: input.color ?? "default",
      userId,
    },
  });
  revalidatePath("/dashboard/notes");
  revalidatePath("/dashboard");
  return { ok: true, id: note.id };
}

export async function updateNote(
  id: string,
  data: { title?: string; content?: string; color?: string; pinned?: boolean }
) {
  const userId = await uid();
  await prisma.note.updateMany({
    where: { id, userId },
    data: {
      ...(data.title !== undefined ? { title: data.title.slice(0, 200) } : {}),
      ...(data.content !== undefined ? { content: data.content.slice(0, 10000) } : {}),
      ...(data.color !== undefined ? { color: data.color } : {}),
      ...(data.pinned !== undefined ? { pinned: data.pinned } : {}),
    },
  });
  revalidatePath("/dashboard/notes");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteNote(id: string) {
  const userId = await uid();
  await prisma.note.deleteMany({ where: { id, userId } });
  revalidatePath("/dashboard/notes");
  revalidatePath("/dashboard");
  return { ok: true };
}
