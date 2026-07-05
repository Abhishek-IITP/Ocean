import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { startOfWeekUTC, toDayKey } from "@/app/lib/dates";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { InsightsViewer } from "./InsightsViewer";

export default async function InsightsPage() {
  const session = await requireUser();
  const userId = session.user!.id as string;

  const startOfWeek = startOfWeekUTC();
  const periodKey = `weekly-${toDayKey(startOfWeek)}`;

  const insightRecord = await prisma.aiInsight.findUnique({
    where: { userId_periodKey: { userId, periodKey } },
  });

  let initialInsight = null;
  if (insightRecord?.content) {
    try {
      initialInsight = JSON.parse(insightRecord.content);
    } catch (e) {
      console.error("Failed to parse saved insight JSON:", e);
    }
  }

  return (
    <div className="mx-auto max-w-3xl animate-rise">
      <PageHeader
        title="Insights"
        description="A weekly editorial digest of your focus time, habit consistency, and journal themes."
      />
      <InsightsViewer initialInsight={initialInsight} />
    </div>
  );
}
