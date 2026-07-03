"use server";

import prisma from "../db";
import { requireUser } from "../hook";
import { revalidatePath } from "next/cache";
import { startOfDayUTC } from "../dates";

async function uid() {
  const session = await requireUser();
  return session.user!.id as string;
}

async function ensureToday(userId: string) {
  const date = startOfDayUTC();
  return prisma.dailyLog.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date },
    update: {},
  });
}

export async function setWater(glasses: number) {
  const userId = await uid();
  await ensureToday(userId);
  const date = startOfDayUTC();
  await prisma.dailyLog.update({
    where: { userId_date: { userId, date } },
    data: { water: Math.max(0, Math.min(glasses, 30)) },
  });
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function setMood(mood: string) {
  const userId = await uid();
  await ensureToday(userId);
  const date = startOfDayUTC();
  await prisma.dailyLog.update({
    where: { userId_date: { userId, date } },
    data: { mood: mood.slice(0, 40) },
  });
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function setSleep(hours: number) {
  const userId = await uid();
  await ensureToday(userId);
  const date = startOfDayUTC();
  await prisma.dailyLog.update({
    where: { userId_date: { userId, date } },
    data: { sleepHrs: Math.max(0, Math.min(hours, 24)) },
  });
  revalidatePath("/dashboard");
  return { ok: true };
}
