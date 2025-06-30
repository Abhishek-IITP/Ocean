"use server";
import { notFound } from "next/navigation";
import prisma from "../lib/db";
import { requireUser } from "../lib/hook";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, icons, Link2, Pen, Settings, Trash, User2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      userName: true,
      eventTypes: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
      },
    },
  });
  if (!data) {
    return notFound();
  }

  return data;
}

export default async function DashboardPage() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <>
      {data.eventTypes.length === 0 ? (
        <EmptyState
          title="No Event Types Found"
          description="You don't have any event types yet, create one to get started."
          buttonText="Create Event Type"
          href="/dashboard/new"
        />
      ) : (
        <>
          <div className="flex items-center justify-between px-2 ">
            <div className="hidden sm:grid gap-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold ">
                Your Event Types
              </h1>
              <p className="text-muted-foreground">
                Manage your event types and their settings.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/new" className="flex items-center gap-x-2">
                <span className="text-white">Create Event Type</span>
              </Link>
            </Button>
          </div>
          <div className="grid  sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {data.eventTypes.map((eventType) => (
              <div
                key={eventType.id}
                className="overflow-hidden shadow p-4 border rounded-lg  relative mb-4"
              >
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="cursor-pointer" variant="ghost" size={"icon"}>
                        <Settings />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuLabel>Event Type Settings</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/${data.userName}/${eventType.url}`} className="flex items-center gap-x-2">
                              <ExternalLink className="mr-2 size-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link2 className="size-5 mr-2"/>
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pen className="size-5 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Trash className="size-5 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link href={"/"} className="flex  items-center gap-x-4">
                  <div className=" flex-shrink-0  ">
                    <User2 className="size-6 " />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {eventType.duration} Minutes Meeting
                      </dt>
                      <dd className="text-lg font-medium ">
                        {eventType.title}
                      </dd>
                    </dl>
                  </div>
                </Link>
                <div className="bg-muted px-5 py-3 flex justify-between items-center ">
                  <Switch />
                  <Button className=" text-white cursor-pointer">
                    Edit Event
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
