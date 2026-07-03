import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  JournalEditor,
  JournalEntryView,
} from "@/components/journal/JournalEditor";
import { startOfDayUTC, startOfWeekUTC, startOfMonthUTC } from "@/app/lib/dates";
import { format } from "date-fns";

export default async function JournalPage() {
  const session = await requireUser();
  const userId = session.user!.id as string;

  const [daily, weekly, monthly, recent] = await Promise.all([
    prisma.journalEntry.findUnique({
      where: { userId_kind_date: { userId, kind: "DAILY", date: startOfDayUTC() } },
    }),
    prisma.journalEntry.findUnique({
      where: { userId_kind_date: { userId, kind: "WEEKLY", date: startOfWeekUTC() } },
    }),
    prisma.journalEntry.findUnique({
      where: { userId_kind_date: { userId, kind: "MONTHLY", date: startOfMonthUTC() } },
    }),
    prisma.journalEntry.findMany({
      where: { userId, kind: "DAILY" },
      orderBy: { date: "desc" },
      take: 10,
    }),
  ]);

  const toView = (e: typeof daily): JournalEntryView | null =>
    e ? { content: e.content, gratitude: e.gratitude, mood: e.mood } : null;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Journal"
        description="Close the day, week or month with a short, honest reflection. No streak pressure — just a quiet moment."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <JournalEditor
          entries={{
            DAILY: toView(daily),
            WEEKLY: toView(weekly),
            MONTHLY: toView(monthly),
          }}
        />

        <aside className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Recent entries
          </h2>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Past reflections will appear here.
            </p>
          ) : (
            <ul className="space-y-2">
              {recent.map((e) => (
                <li
                  key={e.id}
                  className="rounded-xl border border-border/70 bg-card p-3 shadow-soft"
                >
                  <div className="text-xs font-semibold text-sage-deep">
                    {format(e.date, "EEE, d MMM")}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {e.content || "—"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
