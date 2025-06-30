"use client";
import {  useFormStatus } from "react-dom";
import GoogleLogo from '@/public/google-icon-logo-svgrepo-com.svg'
import  GithubLogo  from "@/public/github-mark.svg";
import { Button } from "./ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
    text: string;
    className?: string;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
}

export function SubmitButton({ text, variant,className }: SubmitButtonProps) {
    const {pending}= useFormStatus();

    return (
        <>
        {
            pending? <Button  variant="outline" disabled className={cn("w-full hover:bg-gray-200  cursor-pointer", className)}>
                <Loader2 className="size-6 mr-2  animate-spin"/>Please wait ...

            </Button> : <Button className={cn("w-full text-white hover:bg-gray-200 hover:text-black cursor-pointer", className)} type="submit" variant={variant}>
                {text}
            </Button>
        }
        </>
    );
}

export function GithubAuthButton(){
    const {pending}= useFormStatus();

    return (
        <>
        {
            pending? <Button  variant={'outline'} disabled>
                <Loader2 className="size-6 ml-27  animate-spin"/>Please wait ...

            </Button> : <Button className="w-full hover:bg-gray-200  cursor-pointer" variant={'outline'}>
                <Image src={GithubLogo} alt="Github Logo" className="w-7 h-7 mt-1"/>
                Sign in with Github
            </Button>
        }
        </>
    );

}
export function GoogleAuthButton(){
    const {pending}= useFormStatus();

    return (
        <>
        {
            pending? <Button variant={'outline'} disabled>
                <Loader2 className="size-6 ml-25  animate-spin"/>Please wait ...

            </Button> : <Button className="w-full hover:bg-gray-200  cursor-pointer" variant={'outline'}>
                <Image src={GoogleLogo} alt="Google Logo" className="w-7 h-7 mt-1"/>
                Sign in with Google
            </Button>
        }
        </>
    );

}