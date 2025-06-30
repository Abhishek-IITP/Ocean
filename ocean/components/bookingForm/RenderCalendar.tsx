"use client";
import { Calendar } from "./Calendar";
import {today, getLocalTimeZone} from "@internationalized/date";

interface RenderCalendarProps {
    availability?: {
        day: string;
        isAvailable: boolean;
    }[];

}

export function RenderCalendar({availability }: RenderCalendarProps) {
  const isDateUnavailable =(date: )=>{
    const dayOfWeek = new Date().getDay();
  }
    return (
    console.log("RenderCalendar", availability),
    <Calendar minValue={today(getLocalTimeZone())} isDateUnavailable={} />

  );
}