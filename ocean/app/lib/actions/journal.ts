"use server";

import prisma from "../db";
import { requireUser } from "../hook";
import { revalidatePath } from "next/cache";
import { JournalKind } from "@prisma/client";
import { startOfDayUTC, startOfWeekUTC, startOfMonthUTC, parseDayKey } from "../dates";

async function uid() {
  const session = await requireUser();
  return session.user!.id as string;
}

function dateForKind(kind: JournalKind, dayKey?: string): Date {
  const base = dayKey ? parseDayKey(dayKey) : new Date();
  if (kind === "WEEKLY") return startOfWeekUTC(base);
  if (kind === "MONTHLY") return startOfMonthUTC(base);
  return startOfDayUTC(base);
}

/** Upsert a journal entry for a given kind + day (idempotent per period). */
export async function saveJournal(input: {
  kind: JournalKind;
  content: string;
  gratitude?: string | null;
  mood?: string | null;
  dayKey?: string;
}) {
  const userId = await uid();
  const date = dateForKind(input.kind, input.dayKey);
  await prisma.journalEntry.upsert({
    where: { userId_kind_date: { userId, kind: input.kind, date } },
    create: {
      userId,
      kind: input.kind,
      date,
      content: input.content.slice(0, 20000),
      gratitude: input.gratitude?.slice(0, 2000) ?? null,
      mood: input.mood ?? null,
    },
    update: {
      content: input.content.slice(0, 20000),
      gratitude: input.gratitude?.slice(0, 2000) ?? null,
      mood: input.mood ?? null,
    },
  });
  revalidatePath("/dashboard/journal");
  revalidatePath("/dashboard");
  return { ok: true };
}
