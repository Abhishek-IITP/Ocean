"use server";

import prisma from "../db";
import { requireUser } from "../hook";
import { revalidatePath } from "next/cache";
import { TaskQuadrant, TaskStatus } from "../../generated/prisma";

async function uid() {
  const session = await requireUser();
  return session.user!.id as string;
}

export async function createTask(input: {
  title: string;
  quadrant?: TaskQuadrant;
  dueDate?: string | null;
  blockStart?: string | null;
  blockEnd?: string | null;
  notes?: string | null;
}) {
  const userId = await uid();
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required" };

  await prisma.task.create({
    data: {
      title: title.slice(0, 200),
      quadrant: input.quadrant ?? "UNSORTED",
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      blockStart: input.blockStart ? new Date(input.blockStart) : null,
      blockEnd: input.blockEnd ? new Date(input.blockEnd) : null,
      notes: input.notes?.slice(0, 2000) ?? null,
      userId,
    },
  });
  revalidatePath("/dashboard/planner");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function toggleTask(id: string, done: boolean) {
  const userId = await uid();
  await prisma.task.updateMany({
    where: { id, userId },
    data: {
      status: done ? "DONE" : "TODO",
      completedAt: done ? new Date() : null,
    },
  });
  revalidatePath("/dashboard/planner");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateTask(
  id: string,
  data: {
    title?: string;
    notes?: string | null;
    quadrant?: TaskQuadrant;
    status?: TaskStatus;
    dueDate?: string | null;
    blockStart?: string | null;
    blockEnd?: string | null;
  }
) {
  const userId = await uid();
  await prisma.task.updateMany({
    where: { id, userId },
    data: {
      ...(data.title !== undefined ? { title: data.title.slice(0, 200) } : {}),
      ...(data.notes !== undefined ? { notes: data.notes?.slice(0, 2000) ?? null } : {}),
      ...(data.quadrant !== undefined ? { quadrant: data.quadrant } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.dueDate !== undefined ? { dueDate: data.dueDate ? new Date(data.dueDate) : null } : {}),
      ...(data.blockStart !== undefined ? { blockStart: data.blockStart ? new Date(data.blockStart) : null } : {}),
      ...(data.blockEnd !== undefined ? { blockEnd: data.blockEnd ? new Date(data.blockEnd) : null } : {}),
    },
  });
  revalidatePath("/dashboard/planner");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteTask(id: string) {
  const userId = await uid();
  await prisma.task.deleteMany({ where: { id, userId } });
  revalidatePath("/dashboard/planner");
  revalidatePath("/dashboard");
  return { ok: true };
}
