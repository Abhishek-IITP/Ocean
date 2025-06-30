import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import video from "@/public/logo.ico"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarCheck2 } from "lucide-react";


export default function onboardingrouteTwo(){
    return(
        <div className="min-h-screen w-full flex items-center justify-center">
            <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>
                You are almost there!
                {/* <span className="text-primary"> Just a few more steps to complete your onboarding.</span> */}
                </CardTitle>
                <CardDescription>
                We have to connect your calendar to your account. 
                </CardDescription>
                <Image src={video} alt="almost finished"  className="w-full rounded-lg" />
            </CardHeader>
            <CardContent>
                <Button asChild className="hover:text-black text-white hover:bg-white w-full">
                    <Link href="/api/auth">
                    <CalendarCheck2  className=" mr-2 size-5" />
                    Connect Calendar to your account
                    </Link>
                </Button>
            </CardContent>
            </Card>
        </div>
    )
}