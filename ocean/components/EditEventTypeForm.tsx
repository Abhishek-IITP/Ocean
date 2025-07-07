"use client"
import { CreateEventTypeAction, EditEventTypeAction } from "@/app/action";
import { eventTypeSchema } from "@/app/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { ButtonGroup } from "./ui/ButtonGroup";
import { Button } from "./ui/button";
import Link from "next/link";
import { SubmitButton } from "./SubmitButtons";

type VideoCallProvider = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";

interface iAppProps{
    id: string;
    title: string;
    url: string;
    description: string;
    duration: number;
    callProvider: string

}


export function EditEventForm({id,title,url,description,duration,callProvider}:iAppProps){
    
    const  [activePlatform, setActivePlatform] = useState<VideoCallProvider | null>(callProvider as VideoCallProvider);
    const[lastResult, action] = useActionState(EditEventTypeAction,undefined)
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
    return(
        <div className="flex flex-col items-center  justify-center h-full p-4 space-y-4">
           <Card>
            <CardHeader>
                <CardTitle>
                    Edit Appointment Type
                </CardTitle>
                <CardDescription>
                    Edit your  appointment type to manage your scheduling needs. Define the title, duration, and URL for booking.
                </CardDescription>
            </CardHeader>
            <form id={form.id} noValidate action={action} onSubmit={form.onSubmit}>
                <input type="hidden" name="id" value={id} />
                <CardContent className="grid gap-y-5">
                    <div className="flex flex-col gap-y-2">
                        <Label>
                            Title
                        </Label>
                            <Input name={fields.title.name}
                            key={fields.title.key}
                            defaultValue={title}
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
                            defaultValue={url}
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
                        defaultValue={description}
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
                        defaultValue={String(duration)}>
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
                        <input type="hidden" name={"videoCallSoftware"} value={activePlatform || ""} />
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
                    <SubmitButton className="w-40" text="Edit Event"/>
                </CardFooter>

            </form>
           </Card>

        </div>
    )
}