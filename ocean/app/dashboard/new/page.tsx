"use client";
import { CreateEventTypeAction } from "@/app/action";
import { eventTypeSchema } from "@/app/lib/zodSchemas";
import { SubmitButton } from "@/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useActionState, useState } from "react";

type VideoCallProvider = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";

export default function NewEventRoute() {
    const  [activePlatform, setActivePlatform] = useState<VideoCallProvider | null>("Google Meet");
    const[lastResult, action] = useActionState(CreateEventTypeAction,undefined)
    const[form, fields] = useForm({
        lastResult,
  
        onValidate({formData}) {
            return parseWithZod(formData,{
                schema: eventTypeSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    return (
        <div className="flex flex-col items-center  justify-center h-full p-4 space-y-4">
           <Card>
            <CardHeader>
                <CardTitle>
                    Add New Appointment Type
                </CardTitle>
                <CardDescription>
                    Create a new appointment type to manage your scheduling needs. Define the title, duration, and URL for booking.
                </CardDescription>
            </CardHeader>
            <form id={form.id} noValidate action={action} onSubmit={form.onSubmit}>
                <CardContent className="grid gap-y-5">
                    <div className="flex flex-col gap-y-2">
                        <Label>
                            Title
                        </Label>
                            <Input name={fields.title.name}
                            key={fields.title.key}
                            defaultValue={fields.title.initialValue} 
                            placeholder="Enter appointment title"/>
                            <p className="text-red-500 text-sm">{fields.title.errors}</p>
                    </div>
                    <div className="flex flex-col gap-y-2 mt-4">
                        <Label>
                            URL Slug
                        </Label>
                        <div className="flex items-center gap-x-2">
                            <span className="inline-flex items-center px-5 rounded-l-md border border-r-0 border-muted bg-muted text-lg text-muted-foreground  ">
                                Ocean.com/<span className="text-primary">event/</span>
                            </span>
                            <Input
                            name={fields.url.name}
                            key={fields.url.key}
                            defaultValue={fields.url.initialValue}
                             className="rounded-l-none" placeholder="Enter your URL slug"/>
                            <p className="text-red-500 text-sm">{fields.url.errors}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2 mt-4">
                        <Label>
                            Description
                        </Label>
                        <Textarea 
                        name={fields.description.name}
                        key={fields.description.key}
                        defaultValue={fields.description.initialValue}
                        placeholder="Enter a brief description of the appointment type"/>
                        <p className="text-red-500 text-sm">{fields.description.errors}</p>
                    </div>
                    <div className="flex flex-col gap-y-2 mt-4">
                        <Label>
                            Duration
                        </Label>
                       <Select
                        name={fields.duration.name}
                        key={fields.duration.key}
                        defaultValue={fields.duration.initialValue}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Duration Options</SelectLabel>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="45">45 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                       </Select>

                    </div>
                    <div className="flex flex-col gap-y-2 mt-4">
                        <Label>Video Call Provider</Label>
                        <input type="hidden" name={fields.videoCallSoftware.name} value={activePlatform || ""} />
                        <ButtonGroup className="grid grid-cols-3 gap-2">
                            <Button
                            type="button" onClick={()=> setActivePlatform("Zoom Meeting")} variant={
                                activePlatform === "Zoom Meeting" ? "secondary" : "outline"
                            } className="w-full">
                                Zoom    
                            </Button>
                            <Button type="button" onClick={()=> setActivePlatform("Google Meet")} variant={
                                activePlatform === "Google Meet" ? "secondary" : "outline"
                            } className="w-full">
                                Google Meet
                            </Button>
                            <Button type="button" onClick={()=> setActivePlatform("Microsoft Teams")} variant={
                                activePlatform === "Microsoft Teams" ? "secondary" : "outline"
                            } className="w-full">
                                Microsoft Teams
                            </Button>
                        </ButtonGroup>

                    </div>
                </CardContent>

                <CardFooter className="flex w-full justify-between">
                    <Button variant={"secondary"} asChild>
                        <Link href="/dashboard">
                            Cancel
                        </Link>
                    </Button>
                    <SubmitButton className="w-40" text="Create Event"/>
                </CardFooter>

            </form>
           </Card>

        </div>
    );
}