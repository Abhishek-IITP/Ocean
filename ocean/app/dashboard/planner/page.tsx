import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PlannerBoard, PlannerTask } from "@/components/planner/PlannerBoard";

export default async function PlannerPage() {
  const session = await requireUser();
  const tasks = await prisma.task.findMany({
    where: { userId: session.user!.id as string, status: { not: "DONE" } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  const mapped: PlannerTask[] = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    quadrant: t.quadrant,
    blockStart: t.blockStart ? t.blockStart.toISOString() : null,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Day planner"
        description="Sort what matters with the Eisenhower matrix, then work through it with a clear head. Finished tasks tuck themselves away."
      />
      <PlannerBoard tasks={mapped} />
    </div>
  );
}
