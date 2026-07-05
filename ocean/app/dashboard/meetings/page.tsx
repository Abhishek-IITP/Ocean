import { cancelMeetingAction } from "@/app/action";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hook";
import { nylas } from "@/app/lib/nylas";
import { EmptyState } from "@/components/EmptyState";
import { SubmitButton } from "@/components/SubmitButtons";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { format, fromUnixTime } from "date-fns";
import { CalendarDays, Video } from "lucide-react";
import { MeetingPrepButton } from "@/components/dashboard/MeetingPrepButton";

function getEventTimes(when: unknown) {
  if (
    typeof when === "object" &&
    when !== null &&
    "startTime" in when &&
    "endTime" in when &&
    typeof when.startTime === "number" &&
    typeof when.endTime === "number"
  ) {
    return { startTime: when.startTime, endTime: when.endTime };
  }
  return null;
}

function getConferenceUrl(conferencing: unknown) {
  if (
    typeof conferencing === "object" &&
    conferencing !== null &&
    "details" in conferencing &&
    typeof conferencing.details === "object" &&
    conferencing.details !== null &&
    "url" in conferencing.details &&
    typeof conferencing.details.url === "string"
  ) {
    return conferencing.details.url;
  }
  return null;
}

async function getData(userId: string) {
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: { grantId: true, grandEmail: true },
  });
  if (!userData?.grantId || !userData?.grandEmail) {
    return { data: [] };
  }
  const data = await nylas.events.list({
    identifier: userData.grantId as string,
    queryParams: { calendarId: userData.grandEmail as string },
  });
  return data;
}

export default async function MeetingsRoute() {
  const session = await requireUser();
  const data = await getData(session.user!.id as string);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="Meetings"
        description="Everything on your calendar, in one calm list. Join or cancel without leaving Ocean."
      />

      {!data.data || data.data.length < 1 ? (
        <EmptyState
          icon={CalendarDays}
          title="No meetings yet"
          description="When someone books time with you, it will appear here — with a join link and a gentle heads-up."
          buttonText="View event types"
          href="/dashboard/events"
        />
      ) : (
        <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
          {data.data.map((item) => {
            const eventTimes = getEventTimes(item.when);
            const conferenceUrl = getConferenceUrl(item.conferencing);
            const guestName = item.participants[0]?.name ?? "a guest";
            return (
              <form
                action={cancelMeetingAction}
                key={item.id}
                className="grid grid-cols-1 items-center gap-4 p-5 sm:grid-cols-[180px_1fr_auto]"
              >
                <input type="hidden" name="eventId" value={item.id} />
                <div>
                  <p className="text-sm font-semibold">
                    {eventTimes
                      ? format(fromUnixTime(eventTimes.startTime), "EEE, dd MMM")
                      : "Date unavailable"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {eventTimes
                      ? `${format(fromUnixTime(eventTimes.startTime), "HH:mm")} – ${format(
                          fromUnixTime(eventTimes.endTime),
                          "HH:mm"
                        )}`
                      : ""}
                  </p>
                  {conferenceUrl ? (
                    <a
                      className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-sage-deep hover:underline"
                      href={conferenceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Video className="size-3.5" /> Join meeting
                    </a>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Video className="size-3.5" /> No link
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-serif text-base font-bold">
                    {item.title}
                  </h2>
                  <p className="truncate text-sm text-muted-foreground">
                    You and {guestName}
                  </p>
                  <MeetingPrepButton
                    title={item.title}
                    guestName={guestName}
                  />
                </div>

                <SubmitButton
                  text="Cancel"
                  variant="outline"
                  className="w-full sm:w-auto"
                />
              </form>
            );
          })}
        </div>
      )}
    </div>
  );
}
