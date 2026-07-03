"use server";

import prisma from "./lib/db";
import { parseWithZod } from '@conform-to/zod'
import { requireUser } from "./lib/hook";
import { eventTypeSchema, onboardingSchema, onboardingSchemaValidation, settingsSchema } from "./lib/zodSchemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nylas } from "./lib/nylas";

const dayNames = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
] as const;

function timeToMinutes(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        throw new Error("Invalid time format");
    }
    return hours * 60 + minutes;
}


export async function OnboardingAction(prevState: any, formData: FormData) {
    const session = await requireUser();
    const submission = await parseWithZod(formData, {
        schema: onboardingSchemaValidation({
            async isUsernameUnique() {
                const existingUsername = await prisma.user.findUnique({
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
        where: {
            id: session.user?.id,
        },
        data: {
            userName: submission.value.userName,
            name: submission.value.fullName,
            availability: {
                createMany: {
                    data: [
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

export async function SettingsAction(prevState: any, formData: FormData) {
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


export async function updateAvailabilityAction(formData: FormData) {
    const session = await requireUser();
    const rawData = Object.fromEntries(formData.entries())
    const availabilityData = Object.keys(rawData).filter((key) =>
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
        availabilityData.forEach((item) => {
            if (timeToMinutes(item.startTime) >= timeToMinutes(item.endTime)) {
                throw new Error("Start time must be before end time");
            }
        });

        const updates = await prisma.$transaction(
            availabilityData.map((item) => prisma.availability.updateMany({
                where: {
                    id: item.id,
                    userId: session.user?.id,
                },
                data: {
                    isAvailable: item.isAvailable,
                    startTime: item.startTime,
                    endTime: item.endTime,
                },
            })))
        if (updates.some((result) => result.count !== 1)) {
            throw new Error("Failed to update one or more availability records");
        }
        revalidatePath("/dashboard/availability");
    } catch (error) {
        console.error("Error updating availability:", error)

    }
}

export async function CreateEventTypeAction(prevState: any, formData: FormData) {
    const session = await requireUser();
    const submission = parseWithZod(formData, {
        schema: eventTypeSchema,
    })
    if (submission.status !== "success") {
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

    return redirect("/dashboard/events");

}

export async function CreateMeetingAction(formData: FormData) {
    const username = formData.get("username") as string;
    const eventTypeId = formData.get("eventTypeId") as string;
    const fromTime = formData.get("fromTime") as string;
    const eventDate = formData.get("eventDate") as string;
    const guestName = formData.get("name") as string;
    const guestEmail = formData.get("email") as string;

    if (!username || !eventTypeId || !fromTime || !eventDate || !guestName || !guestEmail) {
        throw new Error("Missing booking details");
    }
    if (!guestEmail.includes("@")) {
        throw new Error("Invalid guest email");
    }

    const eventTypeData = await prisma.eventType.findFirst({
        where: {
            id: eventTypeId,
            active: true,
            User: {
                userName: username,
            },
        },
        select: {
            duration: true,
            title: true,
            description: true,
            videoCallSoftware: true,
            User: {
                select: {
                    id: true,
                    grandEmail: true,
                    grantId: true,
                },
            },
        }
    })

    if (!eventTypeData) {
        throw new Error("Event type not found or inactive");
    }

    if (!eventTypeData.User.grantId || !eventTypeData.User.grandEmail) {
        throw new Error("Host calendar is not connected");
    }

    const startDateTime = new Date(`${eventDate}T${fromTime}:00`);
    if (Number.isNaN(startDateTime.getTime())) {
        throw new Error("Invalid booking date or time");
    }
    if (startDateTime <= new Date()) {
        throw new Error("Cannot book a meeting in the past");
    }

    const endDateTime = new Date(startDateTime.getTime() + eventTypeData.duration * 60000);
    const day = dayNames[startDateTime.getDay()];
    const availability = await prisma.availability.findFirst({
        where: {
            userId: eventTypeData.User.id,
            day,
            isAvailable: true,
        },
        select: {
            startTime: true,
            endTime: true,
        },
    });

    if (!availability) {
        throw new Error("Host is not available on this day");
    }

    const requestedStart = timeToMinutes(fromTime);
    const requestedEnd = requestedStart + eventTypeData.duration;
    if (
        requestedStart < timeToMinutes(availability.startTime) ||
        requestedEnd > timeToMinutes(availability.endTime)
    ) {
        throw new Error("Selected time is outside the host availability");
    }

    const freeBusy = await nylas.calendars.getFreeBusy({
        identifier: eventTypeData.User.grantId,
        requestBody: {
            startTime: Math.floor(startDateTime.getTime() / 1000),
            endTime: Math.floor(endDateTime.getTime() / 1000),
            emails: [eventTypeData.User.grandEmail],
        },
    });

    const busySlots = freeBusy.data?.flatMap((calendar) =>
        "timeSlots" in calendar ? calendar.timeSlots : []
    ) ?? [];
    if (busySlots.length > 0) {
        throw new Error("This slot is no longer available");
    }

    const createdEvent = await nylas.events.create({
        identifier: eventTypeData.User.grantId,
        requestBody: {
            title: eventTypeData.title,
            description: eventTypeData.description,
            when: {
                startTime: Math.floor(startDateTime.getTime() / 1000),
                endTime: Math.floor(endDateTime.getTime() / 1000),
            },
            conferencing: {
                autocreate: {},
                provider: eventTypeData.videoCallSoftware as any,
            },
            participants: [
                {
                    name: guestName,
                    email: guestEmail,
                    status: "yes" as any,
                }
            ]
        },
        queryParams: {
            calendarId: eventTypeData.User.grandEmail,
            notifyParticipants: true,
        },
    })

    await prisma.booking.create({
        data: {
            eventTypeId,
            userId: eventTypeData.User.id,
            guestName,
            guestEmail,
            startTime: startDateTime,
            endTime: endDateTime,
            nylasEventId: createdEvent.data.id,
        },
    });


    return redirect("/success");
}

export async function cancelMeetingAction(formData: FormData) {
    const session = await requireUser();
    const userData = await prisma.user.findUnique({
        where: {
            id: session.user?.id
        },
        select: {
            grandEmail: true,
            grantId: true,
        }
    })
    if (!userData) {
        throw new Error("User not Found")
    }

    const eventId = formData.get("eventId") as string;

    await nylas.events.destroy({
        eventId,
        identifier: userData.grantId as string,
        queryParams: {
            calendarId: userData.grandEmail as string
        }
    })

    await prisma.booking.updateMany({
        where: {
            userId: session.user?.id,
            nylasEventId: eventId,
        },
        data: {
            status: "CANCELLED",
        },
    });

    revalidatePath("/dashboard/meetings")
}

export async function EditEventTypeAction(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: eventTypeSchema,
    })
    if (submission.status !== "success") {
        return submission.reply()
    }

    const data = await prisma.eventType.update({
        where: {
            id: formData.get("id") as string,
            userId: session.user?.id
        },
        data: {
            title: submission.value.title,
            duration: submission.value.duration,
            url: submission.value.url,
            description: submission.value.description,
            videoCallSoftware: submission.value.videoCallSoftware
        }
    });

    return redirect("/dashboard/events")

}


export async function UpdateEventTypeStatusAction(prevState: any, { eventTypeId, isActive }: { eventTypeId: string; isActive: boolean }) {

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
        throw new Error("Failed to delete event type");
    }
}
