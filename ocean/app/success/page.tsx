import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export  default function SuccessRoute(){
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <Card className="max-w-[400px] w-full mx-auto">
                <CardContent className="p-5 flex flex-col items-center w-full">
                    <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="size-10 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-semibold mt-5">Meeting Booked Successfully</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        You will receive an email with the meeting details.
                    </p>
                    

                </CardContent>
                <CardFooter>
                    <Button className="w-full" asChild>
                        <Link href="/">
                            Go to Home
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}