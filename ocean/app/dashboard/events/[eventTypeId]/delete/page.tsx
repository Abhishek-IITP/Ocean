import { DeleteEventTypeAction } from "@/app/action";
import { SubmitButton } from "@/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DeleteEventType({params}: {params: {eventTypeId: string}}) {
    return(
        <div className="flex  items-center justify-center">
            <Card className="max-w-[400px] w-full ">
                <CardHeader>
                    <CardTitle>Delete Event Type</CardTitle>
                    <CardDescription>Are you sure you want to delete this event type?</CardDescription>
                </CardHeader>
                <CardFooter className="w-full flex justify-between">
                    <Button variant={"outline"}>
                        <Link href="/dashboard">
                        cancel
                        </Link>
                    </Button>
                    <form action={DeleteEventTypeAction}>
                        <input type="hidden" name="eventTypeId" value={params.eventTypeId} />
                        <SubmitButton variant={"destructive"} text="Delete"/>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )   
}