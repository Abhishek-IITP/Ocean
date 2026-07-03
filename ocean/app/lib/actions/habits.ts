"use server";

import prisma from "../db";
import { requireUser } from "../hook";
import { revalidatePath } from "next/cache";
import { startOfDayUTC, parseDayKey } from "../dates";

async function uid() {
  const session = await requireUser();
  return session.user!.id as string;
}

export async function createHabit(input: {
  name: string;
  icon?: string;
  color?: string;
  target?: number;
}) {
  const userId = await uid();
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Name is required" };
  const count = await prisma.habit.count({ where: { userId, archived: false } });
  await prisma.habit.create({
    data: {
      name: name.slice(0, 120),
      icon: input.icon ?? "sprout",
      color: input.color ?? "sage",
      target: Math.max(1, Math.min(input.target ?? 1, 20)),
      order: count,
      userId,
    },
  });
  revalidatePath("/dashboard/habits");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function archiveHabit(id: string) {
  const userId = await uid();
  await prisma.habit.updateMany({ where: { id, userId }, data: { archived: true } });
  revalidatePath("/dashboard/habits");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Toggle today's (or a given day's) completion for a habit. */
export async function toggleHabitLog(habitId: string, dayKey?: string) {
  const userId = await uid();
  // ownership check
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) return { ok: false, error: "Not found" };

  const date = dayKey ? parseDayKey(dayKey) : startOfDayUTC();
  const existing = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId, date } },
  });

  if (existing) {
    await prisma.habitLog.delete({ where: { id: existing.id } });
  } else {
    await prisma.habitLog.create({ data: { habitId, date, count: 1 } });
  }
  revalidatePath("/dashboard/habits");
  revalidatePath("/dashboard");
  return { ok: true, checked: !existing };
}
