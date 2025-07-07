"use server";

import prisma from "./lib/db";
import {parseWithZod} from '@conform-to/zod'
import { requireUser } from "./lib/hook";
import { eventTypeSchema, onboardingSchema, onboardingSchemaValidation, settingsSchema } from "./lib/zodSchemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nylas } from "./lib/nylas";
import { get } from "http";


export async function OnboardingAction(prevState: any,formData: FormData) {
    const session = await requireUser();
    const submission= await parseWithZod(formData,{
        schema: onboardingSchemaValidation({
            async isUsernameUnique() {
                const  existingUsername = await prisma.user.findUnique({
                    where: {
                        userName: formData.get("userName") as string,
                    }
                });
                return !existingUsername;
            }
        }),
        async: true,
    })
    if (submission.status !== "success") {
        return submission.reply();
    }

    const data = await prisma.user.update({
        where:{
            id: session.user?.id,
        },
        data:{
            userName: submission.value.userName,
            name: submission.value.fullName,
            availability: {
                createMany :{
                    data:[
                        {
                            day: "MONDAY",
                            startTime: "08:00",
                            endTime: "17:00",
                        },
                        {
                            day: "TUESDAY",
                            startTime: "08:00",
                            endTime: "17:00",
                        },
                        {
                            day: "WEDNESDAY",
                            startTime: "08:00",
                            endTime: "17:00",
                        },
                        {
                            day: "THURSDAY",
                            startTime: "08:00",
                            endTime: "17:00",
                        },
                        {
                            day: "FRIDAY",
                            startTime: "08:00",
                            endTime: "17:00",
                        },
                        {
                            day: "SATURDAY",
                            startTime: "09:00",
                            endTime: "13:00",
                        },
                        {
                            day: "SUNDAY",
                            startTime: "09:00",
                            endTime: "13:00",
                        }
                    ]
                }
            }
        },
    });
    return redirect("/onboarding/grant-id");

}

export async function SettingsAction(prevState: any,formData: FormData) {
    const session = await requireUser();
    const submission = parseWithZod(formData, {
        schema: settingsSchema,
    });
    if (submission.status !== "success") {
        return submission.reply();
    }

    const data = await prisma.user.update({
        where: {
            id: session.user?.id,
        },
        data: {
            name: submission.value.fullName,
            image: submission.value.profileImage,
        },
    });

    return redirect("/dashboard");
}


export async function updateAvailabilityAction( formData: FormData){
    const session = await requireUser();
    const rawData= Object.fromEntries(formData.entries())
    const availabilityData= Object.keys(rawData).filter((key)=>
        key.startsWith("id-")
    ).map((key) => {
        const id = key.replace("id-", "");
        return {
            id,
            isAvailable: rawData[`isAvailable-${id}`] === "on",
            startTime: rawData[`startTime-${id}`] as string,
            endTime: rawData[`endTime-${id}`] as string,
        };
    });
    try {
        await prisma.$transaction(
            availabilityData.map((item)=> prisma.availability.update({
                where: {
                    id: item.id,
                    // userId: session.user?.id,
                },
                data: {
                    isAvailable: item.isAvailable,
                    startTime: item.startTime,
                    endTime: item.endTime,
                },
            })) )
         revalidatePath("/dashboard/availability");
    } catch (error) {
        console.log(error)
        
    }
}

export async function CreateEventTypeAction(prevState:any,formData: FormData) {
    const session = await requireUser();
    const submission =  parseWithZod(formData,{
        schema: eventTypeSchema,
    })
    if(submission.status !== "success") {
        return submission.reply();
    }

        if (!session.user?.id) {
            throw new Error("User ID is required to create an event type.");
        }
        await prisma.eventType.create({
        data: {
            title: submission.value.title,
            duration: submission.value.duration,
            url: submission.value.url,
            description: submission.value.description,
            videoCallSoftware: submission.value.videoCallSoftware,
            userId: session.user.id,
        },
    });

    return redirect("/dashboard");

}

export async function CreateMeetingAction(formData: FormData) {
        const getUserData=  await prisma.user.findUnique({
        where:{
            userName: formData.get("username") as string,
        },
        select: {
            grandEmail: true,
            grantId: true,
        }
    })
    
    if (!getUserData) {
        throw new Error(`User not found `);
    }

    const eventTypeData =  await prisma.eventType.findUnique({
        where:{
            id: formData.get("eventTypeId") as string,
        },
        select: {
            title: true,
            description: true,
        }
    })

    const fromTime = formData.get("fromTime") as string;
    const eventDate = formData.get("eventDate") as string;
    const meetingLength = Number(formData.get("meetingLength"));
    const provider = formData.get("provider") as string;

    const startDateTime = new Date(`${eventDate}T${fromTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000); 

    await nylas.events.create({
        identifier: getUserData.grantId as string,
        requestBody: {
            title: eventTypeData?.title,
            description: eventTypeData?.description,
            when: {
                startTime: Math.floor(startDateTime.getTime() / 1000),
                endTime: Math.floor(endDateTime.getTime() / 1000),
            },
            conferencing:{
                autocreate: {},
                provider: provider as any,
            },
            participants: [
                {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    status: "yes" as any,
                }
            ]
        },
        queryParams:{
            calendarId: getUserData.grandEmail                                                                                                                                                                                                                                                                                                                           as string,
            notifyParticipants: true,
        },
    })
 

    return redirect("/success");
}

export async function cancleMeetingAction(formData: FormData){
    const session = await  requireUser();
    const userData=  await prisma.user.findUnique({
        where:{
            id: session.user?.id
        },
        select: {
            grandEmail: true,
            grantId: true,
        }
    })
    if(!userData){
        throw new Error("User not Found")
    }

    const data = nylas.events.destroy({
        eventId: formData.get("eventId") as string,
        identifier: userData.grantId as string,
        queryParams:{
            calendarId: userData.grandEmail as string
        }
    })

    revalidatePath("/dashboard/meetings")
}

export async function EditEventTypeAction(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission =  parseWithZod(formData,{
        schema: eventTypeSchema,
    })
    if(submission.status !== "success"){
        return submission.reply()
    }

    const data=  await prisma.eventType.update({
        where:{
            id: formData.get("id") as string,
            userId: session.user?.id
        },
        data:{
            title: submission.value.title,
            duration: submission.value.duration,
            url: submission.value.url,
            description: submission.value.description,
            videoCallSoftware: submission.value.videoCallSoftware
        }
    });

    return redirect("/dashboard")
    
}


export async function UpdateEventTypeStatusAction(prevState:any,{eventTypeId, isActive}: { eventTypeId: string; isActive: boolean }) {
    
    try {
        const session = await requireUser();
     const data = await prisma.eventType.update({
        where: {
            id: eventTypeId,
            userId: session.user?.id,
        },
        data: {
            active: isActive,
        },
    });

    revalidatePath("/dashboard");
    return {
        status: "success",
        message: `Event type ${isActive ? "activated" : "deactivated"} successfully`
    }
    } catch (error) {
        console.error("Error updating event type status:", error);
        return {
            status: "error",
            message: "Failed to update event type status"
        }
        
    }
    

}


export async function DeleteEventTypeAction(formData: FormData) {
    const session = await requireUser();

 

    try {
        const data = await prisma.eventType.delete({
            where: {
                id: formData.get("eventTypeId") as string,
                userId: session.user?.id,
            },
        });

       return redirect("/dashboard");

    } catch (error) {
        console.error("Error deleting event type:", error);
        return {
            status: "error",
            message: "Failed to delete event type"
        };
    }
}