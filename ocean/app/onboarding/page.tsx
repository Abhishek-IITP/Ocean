"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { OnboardingAction } from "../action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../lib/zodSchemas";
import { SubmitButton } from "@/components/SubmitButtons";

export default function OnboardingRoute() {
  const[lastResult, action] = useActionState(OnboardingAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({formData}){
        return parseWithZod(formData, {
            schema: onboardingSchema,
    });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  })
  return (
    <div className="flex items-center justify-center h-screen  bg-gray-50">
        <Card className="w-full max-w-md p-6 shadow-lg">
            <CardHeader>
                <CardTitle>Welcome to O<span className="text-primary">cean</span> </CardTitle>
                <CardDescription>
                    we need to get you started with a few steps to set up your account.
                </CardDescription>
            </CardHeader>

            <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate >
            <CardContent className="grid gap-y-5 ">
                <div className="grid gap-y-2">
                    <Label>Full Name</Label>
                    <Input key={fields.fullName.key} name={fields.fullName.name} defaultValue={fields.fullName.initialValue} placeholder="Enter your full name" />
                    <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
                </div>
                <div className="grid gap-y-2">
                    <Label>Username</Label>
                    <div className="flex rounded-md">
                        <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground " >Ocean.com/</span>
                        <Input key={fields.userName.key} name={fields.userName.name} defaultValue={fields.userName.initialValue} className="rounded-l-none" placeholder="Enter your username" />
                    </div>
                        <p className="text-red-600 text-sm">{fields.userName.errors} </p>

                </div>


            </CardContent>
            <CardFooter>
                <SubmitButton text="Submit"  className="w-full mt-3" />
            </CardFooter>

            </form>

        </Card>

    </div>
  );
}
