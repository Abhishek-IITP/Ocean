import { cancleMeetingAction } from "@/app/action"
import prisma from "@/app/lib/db"
import { requireUser } from "@/app/lib/hook"
import { nylas } from "@/app/lib/nylas"
import { EmptyState } from "@/components/EmptyState"
import { SubmitButton } from "@/components/SubmitButtons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format, fromUnixTime } from "date-fns"
import { Video } from "lucide-react"

async function getData(userId: string){
    const userData = await prisma.user.findUnique({
        where:{
            id: userId,
        },
        select:{
            grantId: true,
            grandEmail: true,
        }
    })
    if(!userData){
        return {
            error: "User not found",
        }
    }
    const data = await nylas.events.list({
        identifier: userData.grantId as string,
        queryParams:{
            calendarId: userData.grandEmail as string,
        }
    })
    return data;
}


export default async function MeetingsRoute(){
    const session = await  requireUser();
    const data = await getData(session.user?.id as string);
    // console.log(data.data[0].when)
    return (
        <>
        {
            data.data?.length < 1 ? (<EmptyState title="No meetings found" description="You have not booked any meetings yet" buttonText="Book a meeting" href="/dashboard" /> )
             :(
                <Card>
                    <CardHeader>
                        <CardTitle>Bookings</CardTitle>
                        <CardDescription>see all your bookings here</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.data.map((item)=>(
                            <form action={cancleMeetingAction}>
                                <input type="hidden" name="eventId"  value={item.id} />
                            <div className="grid grid-cols-3 justify-center items-center gap-4" key={item.id}>
                                <div className="mt-5">
                                    <p className="text-sm text-muted-foreground">{format(fromUnixTime(item.when.startTime), "EEE, dd MMM")}</p>
                                    <p className="text-sm text-muted-foreground pt-1">{format(fromUnixTime(item.when.startTime), "hh:mm a")} - {format(fromUnixTime(item.when.endTime), "hh:mm a")}</p>
                                    <div className="flex items-center mt-1">
                                        <Video className="size-4 mr-2 text-primary"/>
                                        <a className="text-xs text-primary underline underline-offset-4 " href={item.conferencing?.details?.url as string} target="_blank">
                                            Join Meeting
                                        </a>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start">
                                    <h2 className="font-medium text-sm">{item.title}</h2>
                                    <p>You and {item.participants[0]?.name}</p>
                                </div>
                                <SubmitButton text="Cancle Event" variant={"destructive"} className="w-fit ml-auto hover:text-white hover:bg-red-400"/>
                            </div>
                            <Separator className="my-3"/>
                            </form>
                        ))}
                    </CardContent>
                </Card>
             )

        }

        </>
    )
}