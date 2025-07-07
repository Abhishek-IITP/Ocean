"use client";

import { useActionState, useEffect, useTransition } from "react";
import { Switch } from "./ui/switch";
import { UpdateEventTypeStatusAction } from "@/app/action";
import { toast } from "sonner";

export function MenuActiveSwitch({initialChecked, eventTypeId}: {
    initialChecked: boolean;
    eventTypeId: string;
}) {
    const [isPending, startTransition] = useTransition();

    const [state, action] = useActionState(UpdateEventTypeStatusAction, undefined);

    useEffect(()=>{
       if (state && state.status === "success") {
            toast.success(state.message)
        }
        else if (state && state.status === "error") {
            toast.error(state.message)
        }

    },[state])

    return (
        <Switch onCheckedChange={(isChecked) => {
            startTransition(() => {
                action({ eventTypeId, isActive: isChecked });
            });
        }} disabled={isPending} defaultChecked={initialChecked}  />
    );
}