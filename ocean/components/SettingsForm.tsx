"use client";

import { useActionState, useState } from "react";
import { SubmitButton } from "./SubmitButtons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SettingsAction } from "@/app/action";
import { useForm } from "@conform-to/react";
import { parse } from "path";
import { parseWithZod } from "@conform-to/zod";
import { settingsSchema } from "@/app/lib/zodSchemas";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { UploadDropzone } from "@/app/lib/uploadthings";
import { toast } from "sonner";


interface SettingsFormProps {
    fullName?: string;
    email?: string;
    profileImage?: string;

}

export function SettingsForm({ fullName, email, profileImage }: SettingsFormProps) {
    const [lastResult, action]= useActionState(SettingsAction, undefined);
    const[currentProfileImage, setCurrentProfileImage] = useState(profileImage );
    const [ form, fields]= useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData,{
                schema: settingsSchema,
            })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })
    return (
            <Card>
        <CardHeader>
            <CardTitle>
                Settings
            </CardTitle>
            <CardDescription>
                Manage your account settings and preferences.
            </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit}   action={action} className="flex flex-col gap-y-4 p-4">
            <CardContent className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                    <Label className="font-medium">Username</Label>
                    <Input name={fields.fullName.name} key={fields.fullName.id} defaultValue={fullName} placeholder="Enter your username" type="text" className="border rounded-md p-2" />
                    <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
                </div>
                <div className="flex flex-col gap-y-2">
                    <Label className="font-medium">Email</Label>
                    <Input disabled defaultValue={email} placeholder="Enter your email" type="email" className="border rounded-md p-2" />
                </div>
                <div className="grid gap-y-5">
                    <Label className="font-medium">Profile Image</Label>
                    <Input type="hidden" name={fields.profileImage.name} key={fields.profileImage.id} value={currentProfileImage} />
                    {
                        currentProfileImage ? (
                            <div className="relative size-32 ">
                                <img src={currentProfileImage} alt="Profile" className="size-32 rounded-lg " />
                                <Button type="button" variant={"destructive"} size="icon" className="absolute cursor-pointer -top-3 -right-3 " onClick={() => setCurrentProfileImage('')}>
                                    <X className="size-6" />

                                </Button>
                            </div>
                        ) : (
                            <UploadDropzone onClientUploadComplete={(res)=>{
                                setCurrentProfileImage(res[0].url)
                                toast.success("Image uploaded successfully", {
                                    description: "Your profile image has been updated.",
                                })
                            }}
                            onUploadError={(error)=>{
                                console.log("Upload error:", error);
                                toast.error(error.message)
                            }}
                            endpoint={"imageUploader"}/>
                        )
                    }
                    <p className="text-red-500 text-sm">{fields.profileImage.errors}</p>
                </div>

            </CardContent>
            <CardFooter>
                <SubmitButton className="w-40 mt-3" text="Save Changes" />
            </CardFooter>
        </form>
    </Card>
    )
}