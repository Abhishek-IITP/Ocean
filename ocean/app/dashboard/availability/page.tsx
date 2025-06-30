import { updateAvailabilityAction } from "@/app/action";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hook";
import { times } from "@/app/lib/times";
import { SubmitButton } from "@/components/SubmitButtons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";


async function  getData(userId: string) {
    const data = await prisma.availability.findMany({
        where: {
            userId: userId , // Replace with actual user ID logic
        },
    })
    if(!data || data.length === 0) {
        return notFound();
    }

    return data;
    
}
export default async function AvailabilityRoute() {
    const session= await requireUser();
    const data= await  getData(session.user?.id as string);
  return (
    <Card>
<CardHeader>
  <CardTitle className="text-2xl font-semibold ">
    Weekly Availability
  </CardTitle>
  <CardDescription className="text-gray-600 mt-2">
    Set your working days and preferred time slots. This helps others know when you're available for meetings, tasks, or collaborations.
  </CardDescription>
</CardHeader>

        <form action={updateAvailabilityAction}>
<CardContent className="space-y-6">
  {data.map((item) => (
    <div
      key={item.id}
      className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 p-4 border rounded-xl"
    >
        <input type="hidden" name={`id-${item.id}`} value={item.id} />
      {/* Day & Availability */}
      <div className="flex items-center gap-3">
        <Switch name={`isAvailable-${item.id}`} defaultChecked={item.isAvailable} />
        <p className="font-semibold ">{item.day}</p>
      </div>

      {/* From Time */}
      <div className="flex flex-col">
        <Label className="text-sm font-medium  mb-1">From Time</Label>
        <Select name={`startTime-${item.id}`} defaultValue={item.startTime}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {times.map((time) => (
                <SelectItem key={time.id} value={time.time}>
                  {time.time}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Till Time */}
      <div className="flex flex-col">
        <Label className="text-sm font-medium  mb-1">Till Time</Label>
        <Select name={`endTime-${item.id}`} defaultValue={item.endTime}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {times.map((time) => (
                <SelectItem key={time.id} value={time.time}>
                  {time.time}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  ))}
</CardContent>


            <CardFooter>
                <SubmitButton text="Save Changes" className="w-40  p-5"/>
            </CardFooter>
        </form>
    </Card>
  );
}
