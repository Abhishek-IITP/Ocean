import { Day } from "@/app/generated/prisma";
import prisma from "@/app/lib/db";
import { nylas } from "@/app/lib/nylas";
import { Prisma } from "@prisma/client";
import {addMinutes, format, fromUnixTime, isAfter, isBefore, parse} from "date-fns"
import { get } from "http";
import Link from "next/link";
import { GetFreeBusyRequest, GetFreeBusyResponse, NylasResponse } from "nylas";
import { Button } from "../ui/button";

interface TimeTableProps {    // Define any props you need for the TimeTable component
    selectedDate: Date; 
    userName: string;
    duration?: number; 
}

async function getData(userName: string, selectedDate: Date) {
   
    const currentDay= format(selectedDate, "EEEE").toUpperCase() as Day;
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
   
    const data = await prisma.availability.findFirst({
        where: {
            day: currentDay ,
            User: {
                userName: userName,
            },
        },
        select: {
            startTime: true,
            endTime: true,
            id: true,
            User: {
                select: {
                    grandEmail: true,
                    grantId: true,
                }
            }
        },
    })

    const nylasCalendarData = await nylas.calendars.getFreeBusy({
        identifier: data?.User?.grantId as string,
        requestBody: {
            startTime: Math.floor(startOfDay.getTime() / 1000),
            endTime: Math.floor(endOfDay.getTime() / 1000),
            emails: [data?.User?.grandEmail as string],
        }
    })
    return {
        data,
        nylasCalendarData,
    };
}


function calculateAvailableTimeSlots(
    date: string, dbAvailability: {
        startTime: string | undefined
        endTime: string | undefined
    },
    nylasData: NylasResponse<GetFreeBusyResponse[]>,
    duration: number 
) {
    const now = new Date();
    const availableFrom = parse(
        `${date} ${dbAvailability.startTime}`, "yyyy-MM-dd HH:mm", new Date()
    )
    const availableTill = parse(
        `${date} ${dbAvailability.endTime}`, "yyyy-MM-dd HH:mm", new Date()
    )

    const busySlots = nylasData.data[0].timeSlots.map((slot)=>(
                {
            start : fromUnixTime(slot.startTime),
            end: fromUnixTime(slot.endTime)
        }
    ));

    const allSlots = [];
    let currentSlot = availableFrom;
    while(isBefore(currentSlot, availableTill)) {
        allSlots.push(currentSlot);
        currentSlot = addMinutes(currentSlot, duration); 
    }

    const freeSlots = allSlots.filter((slot) => {
        const slotEnd = addMinutes(slot, duration);
        return (
            isAfter(slot, now) &&
            !busySlots.some(
                (busy: { start: any; end: any }) =>
                    (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
                    (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
                    (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))

            )
        )
    })
    return freeSlots.map((slot)=> format(slot, "HH:mm"));

}


export async function  TimeTable({selectedDate, userName, duration}: TimeTableProps){
    
    const {data, nylasCalendarData} = await getData(userName, selectedDate);

    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const dbAvailability={
        startTime: data?.startTime,
        endTime: data?.endTime
    }
    
    const availableTimeSlots = calculateAvailableTimeSlots(
        formattedDate,
        dbAvailability,
        nylasCalendarData,
        duration || 30 // Default duration to 30 minutes if not provided 

    )

    return (
        <div>
            <p className="text-base font-semibold">
                {format(selectedDate, "EEEE, ")}
            <span className="text-muted-foreground text-sm">{format(selectedDate, "MMM d")}</span> {" "}
            <span className="text-muted-foreground text-sm">{format(selectedDate, "h:mm a")}</span>
            </p>
            <div className="mt-3 max-h-[300px] overflow-y-auto">
                {
                    availableTimeSlots.length>0 ? (
                        availableTimeSlots.map((slot, index)=>(
                            <Link href={`?date=${format(selectedDate, "yyyy-MM-dd")}&time=${slot}`} key={index} className="block mb-2">
                            <Button className="w-full text-left mb-2" variant="outline">
                                {slot}  
                            </Button>
                            </Link>
                        ))
                    ): (
                        <p className="text-red-500">
                            No available time slots for this date.
                        </p>
                    )
                }

            </div>
        </div>
    );
}