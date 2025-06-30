import {AriaButtonProps, useButton} from '@react-aria/button';
import {CalendarState} from '@react-stately/calendar';
import { Button } from '../ui/button';
import {mergeProps} from "@react-aria/utils"
import { useRef } from 'react';
import { useFocusRing } from '@react-aria/focus';

export function CalendarButton(props: AriaButtonProps<'button'> & {
    state: CalendarState;
    side?: 'left' | 'right';
}) {
    const ref = useRef(null)
    const {buttonProps} = useButton(props,ref);
    const  {focusProps} = useFocusRing();
    return (
        <Button disabled={props.isDisabled}
         ref={ref} {...mergeProps(buttonProps, focusProps)} variant={"outline"} size={"icon"} className="border p-2 rounded-md text-center cursor-pointer hover:bg-muted transition">
            {props.children}
        </Button>
    );
}