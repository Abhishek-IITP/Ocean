"use client"

import { Link2 } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { toast } from "sonner";

export function CopyLinkMenuItem({meetingUrl}: {meetingUrl: string}){
    
    const handleCopy = async()=>{
        try {
            await navigator.clipboard.writeText(meetingUrl);
            toast.success("URL has been copied ")
            
        } catch (error) {
            toast.error("Error occure while copying the URL")
        }
    }
    
    return(
        <DropdownMenuItem onSelect={handleCopy}>
            <Link2 className="mr-2 size-5"/>
            Copy
        </DropdownMenuItem>
    )

}