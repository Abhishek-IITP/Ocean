import { useRef } from 'react';
import {mergeProps, useCalendarCell, useFocusRing} from 'react-aria';
import {CalendarDate, isToday, getLocalTimeZone, isSameMonth} from "@internationalized/date";
import {CalendarState} from "react-stately"
import { cn } from '@/lib/utils';
export function CalendarCell({
    state,
    date,
    currentMonth,
    isUnavailable
}:{
    state: CalendarState ;
    date: CalendarDate;
    currentMonth: CalendarDate;
    isUnavailable?: boolean;
}) {
      let ref = useRef(null);
  let {
    cellProps,
    buttonProps,
    isSelected,
    isDisabled,
    formattedDate
  } = useCalendarCell({ date }, state, ref);

  const {focusProps, isFocusVisible} = useFocusRing();

    // Check if the date is in the current month
    const isDateToday = isToday(date, getLocalTimeZone());

    const isOutsideCurrentMonth = !isSameMonth(date, currentMonth);

  const finalIsDisabled = isDisabled || isUnavailable ;


  return (
    <td {...cellProps} className={`py-0.5 px-0.5 relative ${isFocusVisible? "z-10 ":"z-0"} `}>
        <div hidden={isOutsideCurrentMonth} ref={ref} {...mergeProps(buttonProps, focusProps)} className='size-10 sm:size-12 outline-none group  rounded-md overflow-hidden'>
            <div className={cn("size-full bg-primary/5 rounded-sm flex items-center justify-center text-sm font-semibold cursor-pointer ",
                finalIsDisabled ? "text-muted-foreground cursor-not-allowed" :"",
                isSelected ? "bg-primary text-primary-foreground" : "",
                !finalIsDisabled && !isSelected ? "hover:bg-primary/10 hover:text-muted-foreground group-hover:bg-muted transition-all duration-200" : "",
                // isOutsideVisibleRange ? "text-muted-foreground" :
                // isUnavailable ? "bg-red-500 text-white cursor-not-allowed" :
                // "text-muted-foreground hover:bg-muted hover:text-muted-foreground group-hover:bg-muted transition-all duration-200"
            )}>
                {formattedDate}
                {isDateToday && <div className={cn("absolute bottom-2.5 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-1 h-1 rounded-full bg-primary", isSelected && "bg-white")} />}
            </div>

        </div>

    </td>
  );
}
