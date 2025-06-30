import { Ban, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface EmptyStateProps {
    title?: string; 
    description?: string;
    buttonText?: string;
    href: string;
}

export function EmptyState({ title, description, buttonText, href }: EmptyStateProps) {
    return (
        <div className="flex flex-col flex-1 items-center justify-center rounded-md border-dashed p-8 text-center animate-in fade-in-50  h-full">
            <div className="flex items-center justify-center size-20 rounded-full bg-primary/10 ">
            <Ban className="h-12 w-12 "  />
            </div>
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <p className="text-muted-foreground mx-auto max-w-xs mb-3">{description}</p>
            <Button  asChild>
                <Link className="text-white" href={href}>
                <PlusCircle className="mr-2 size-5"/>
                {buttonText}</Link>
            </Button>
        </div>
    );
}