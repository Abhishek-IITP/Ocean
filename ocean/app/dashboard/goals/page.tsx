import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GoalsManager, GoalView } from "@/components/goals/GoalsManager";
import { startOfWeekUTC, startOfMonthUTC } from "@/app/lib/dates";

export default async function GoalsPage() {
  const session = await requireUser();
  const userId = session.user!.id as string;

  const goals = await prisma.goal.findMany({
    where: {
      userId,
      OR: [
        { period: "WEEKLY", periodKey: startOfWeekUTC() },
        { period: "MONTHLY", periodKey: startOfMonthUTC() },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped: GoalView[] = goals.map((g) => ({
    id: g.id,
    title: g.title,
    period: g.period,
    target: g.target,
    progress: g.progress,
    done: g.done,
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="Goals"
        description="Give the week and month a gentle shape. Nudge progress as you go — goals reset with each new period."
      />
      <GoalsManager goals={mapped} />
    </div>
  );
}
