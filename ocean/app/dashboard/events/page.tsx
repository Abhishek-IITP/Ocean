import { notFound } from "next/navigation";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hook";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarCheck, Clock, ExternalLink, Pen, Settings, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyLinkMenuItem } from "@/components/CopyLinkMenu";
import { MenuActiveSwitch } from "@/components/EventTypeSwitcher";
import { PageHeader } from "@/components/dashboard/PageHeader";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      userName: true,
      eventTypes: {
        orderBy: { createdAt: "desc" },
        select: { id: true, active: true, title: true, url: true, duration: true },
      },
    },
  });
  if (!data) notFound();
  return data;
}

export default async function EventTypesPage() {
  const session = await requireUser();
  const data = await getData(session.user!.id as string);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Event types"
        description="Reusable meeting templates people can book. Share a link and let Ocean handle the back-and-forth."
      >
        <Button asChild>
          <Link href="/dashboard/new">Create event type</Link>
        </Button>
      </PageHeader>

      {data.eventTypes.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No event types yet"
          description="Create your first bookable event — a 30-minute intro, a weekly sync, whatever you like."
          buttonText="Create event type"
          href="/dashboard/new"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {data.eventTypes.map((eventType) => (
            <div
              key={eventType.id}
              className="relative flex h-48 flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-shadow duration-300 hover:shadow-lift"
            >
              <div className="absolute right-4 top-4 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 border border-border/60">
                      <Settings className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuLabel>Manage</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href={`/${data.userName}/${eventType.url}`} className="flex items-center gap-x-2">
                          <ExternalLink className="size-3.5" /> Preview page
                        </Link>
                      </DropdownMenuItem>
                      <CopyLinkMenuItem
                        meetingUrl={`${process.env.NEXT_PUBLIC_URL}/${data.userName}/${eventType.url}`}
                      />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/events/${eventType.id}`} className="flex items-center gap-x-2">
                          <Pen className="size-3.5" /> Edit
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="text-destructive">
                      <Link href={`/dashboard/events/${eventType.id}/delete`} className="flex items-center gap-x-2">
                        <Trash className="size-3.5" /> Delete
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link href={`/dashboard/events/${eventType.id}`} className="flex-grow p-6">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-accent/50 text-sage-deep">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-sage-deep">
                      {eventType.duration} min meeting
                    </div>
                    <h3 className="mt-0.5 font-serif text-lg font-bold">
                      {eventType.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">/{eventType.url}</p>
                  </div>
                </div>
              </Link>

              <div className="flex items-center justify-between border-t border-border/60 bg-accent/15 px-6 py-3.5">
                <MenuActiveSwitch initialChecked={eventType.active} eventTypeId={eventType.id} />
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/events/${eventType.id}`}>Edit</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
