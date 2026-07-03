// "use server"
import { CreateMeetingAction } from "@/app/action";
import prisma from "@/app/lib/db";
import { Calendar } from "@/components/bookingForm/Calendar";
import { RenderCalendar } from "@/components/bookingForm/RenderCalendar";
import { TimeTable } from "@/components/bookingForm/TimeTable";
import { SubmitButton } from "@/components/SubmitButtons";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns/format";
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
  params, searchParams
}: {
  params: Promise<{ username: string; eventUrl: string }>;
  searchParams: Promise<{date?: string; time?: string}>
}) {
  const { username, eventUrl } = await params;
  const resolvedSearchParams = await searchParams;
  
  const data = await getData(eventUrl, username);

  const selectedDate = resolvedSearchParams.date ? new Date(resolvedSearchParams.date) : new Date();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(selectedDate);

  const showFrom  = !! resolvedSearchParams.date && !!resolvedSearchParams.time;

  return (
            <div className="min-h-screen w-screen flex items-center justify-center">
      {
        showFrom ? (
        <Card className="max-w-[800px] w-full mx-auto">
        <CardContent className="p-5 md:grid md:grid-cols-[1fr_auto_1fr] gap-4">
         {/* Left Side */}
          <div>
            <img src={data.User?.image as string} alt="profile" className="size-10 rounded-full" />
            <p className="text-sm font-medium text-muted-foreground mt-2">{data.User.name}</p>
            <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
            <p className="text-sm font-medium text-muted-foreground">{data.description}</p>

            <div className="mt-5 flex flex-col gap-y-3">
              <p className="flex items-center gap-x-2">
                <CalendarX2 className="size-5 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">{formattedDate}</span>
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

         <Separator orientation="vertical" className="h-full w-[2px]  mx-2" />

          <form className="flex flex-col gap-y-4" action={CreateMeetingAction}>

            <input type="hidden" name="fromTime" value={resolvedSearchParams.time}/>
            <input type="hidden" name="eventDate" value={resolvedSearchParams.date}/>
            <input type="hidden" name="meetingLength" value={data.duration}/>
            <input type="hidden" name="provider" value={data.videoCallSoftware}/>
            <input type="hidden" name="username" value={(await params).username} />
            <input type="hidden" name="eventTypeId" value={data.id}/>

            <div className="flex flex-col gap-y-3">
              <Label>
                Your Name
              </Label>
              <Input name="name" placeholder="Enter your name"/>
            </div>
            <div className="flex flex-col gap-y-3">
              <Label>
                Your Email
              </Label>
              <Input name="email" type="email" placeholder="Enter your email"/>
            </div>
            <SubmitButton
              text="Book Now"
              className="w-full"
              variant="default"
            />
          </form>
        </CardContent>
      </Card>
        ): 
        (
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
                <span className="text-sm font-medium text-muted-foreground">{formattedDate}</span>              </p>
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
         <Separator orientation="vertical" className="h-full w-[2px]  mx-6" />

         <TimeTable selectedDate={selectedDate} userName={username} duration={data.duration} />

        </CardContent>
      </Card>
        )
      }
      

    </div>
    
);
}
