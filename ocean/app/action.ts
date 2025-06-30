"use server";

import prisma from "./lib/db";
import {parseWithZod} from '@conform-to/zod'
import { requireUser } from "./lib/hook";
import { eventTypeSchema, onboardingSchema, onboardingSchemaValidation, settingsSchema } from "./lib/zodSchemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


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