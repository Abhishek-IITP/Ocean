"use server";

import prisma from "../db";
import { requireUser } from "../hook";
import { revalidatePath } from "next/cache";
import { GoalPeriod } from "../../generated/prisma";
import { startOfWeekUTC, startOfMonthUTC, startOfYearUTC } from "../dates";

async function uid() {
  const session = await requireUser();
  return session.user!.id as string;
}

function periodKeyFor(period: GoalPeriod): Date {
  if (period === "WEEKLY") return startOfWeekUTC();
  if (period === "MONTHLY") return startOfMonthUTC();
  return startOfYearUTC();
}

export async function createGoal(input: {
  title: string;
  period?: GoalPeriod;
  target?: number;
}) {
  const userId = await uid();
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required" };
  const period = input.period ?? "WEEKLY";
  await prisma.goal.create({
    data: {
      title: title.slice(0, 200),
      period,
      target: Math.max(1, Math.min(input.target ?? 1, 999)),
      periodKey: periodKeyFor(period),
      userId,
    },
  });
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateGoalProgress(id: string, delta: number) {
  const userId = await uid();
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) return { ok: false, error: "Not found" };
  const progress = Math.max(0, Math.min(goal.progress + delta, goal.target));
  await prisma.goal.update({
    where: { id },
    data: { progress, done: progress >= goal.target },
  });
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteGoal(id: string) {
  const userId = await uid();
  await prisma.goal.deleteMany({ where: { id, userId } });
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
  return { ok: true };
}
