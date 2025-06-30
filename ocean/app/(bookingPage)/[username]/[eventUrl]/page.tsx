// "use server"
import prisma from "@/app/lib/db";
import { Calendar } from "@/components/bookingForm/Calendar";
import { RenderCalendar } from "@/components/bookingForm/RenderCalendar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarX2, Clock, VideoIcon } from "lucide-react";
import { notFound } from "next/navigation";

async function getData(eventUrl: string, userName: string) {
    const data = await prisma.eventType.findFirst({
        where: {
            url: eventUrl,
            User:{
                userName: userName,
            },
            active: true,
        },
        select:{
            id: true,
            description: true,
            title: true,
            duration: true,
            videoCallSoftware: true,
            User: {
                select: {
                    image: true,
                    id: true,
                    name: true,
                    email: true,
                    availability:  {
                        select:{
                            day: true,
                            isAvailable: true,
                        }
                    }
                }
            }
        }
    })
    if (!data) {
        return notFound();
    }
    return data;
    
}

export default async function BookingFormRoute({
  params,
}: {
  params: { username: string; eventUrl: string };
}) {
  const { username, eventUrl } = params;
  const data = await getData(eventUrl, username);

  return (
            <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="max-w-[1000px] w-full mx-auto">
        <CardContent className="p-5 md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4">
         {/* Left Side */}
          <div>
            <img src={data.User?.image as string} alt="profile" className="size-10 rounded-full" />
            <p className="text-sm font-medium text-muted-foreground mt-2">{data.User.name}</p>
            <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
            <p className="text-sm font-medium text-muted-foreground">{data.description}</p>

            <div className="mt-5 flex flex-col gap-y-3">
              <p className="flex items-center gap-x-2">
                <CalendarX2 className="size-5 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">23 Sept 2025</span>
              </p>
              <p className="flex items-center gap-x-2">
                <Clock className="size-5 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">{data.duration} minutes</span>
              </p>
              <p className="flex items-center gap-x-2">
                <VideoIcon className="size-5 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">{data.videoCallSoftware}</span>
              </p>
            </div>
          </div>




         <Separator orientation="vertical" className="h-full w-[2px]  mx-6" />

           <RenderCalendar availability={data.User?.availability as any} />
        </CardContent>
      </Card>
    </div>
    
);
}
