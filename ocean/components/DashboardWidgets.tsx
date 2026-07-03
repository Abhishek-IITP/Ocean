"use client";

import React, { useState, useEffect } from "react";
import { Clock, Coffee, Droplet, Flame, Moon, Plus, Smile, Sun, SunMoon, Wind } from "lucide-react";

export function DashboardWidgets() {
  // Time and Date
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pomodoro Focus Session Timer
  const [timerMinutes, setTimerMinutes] = useState<number>(25);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          setSessionCount(prev => prev + 1);
          alert("Focus session complete. Take a gentle breath.");
          setTimerMinutes(25);
          setTimerSeconds(0);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timerMinutes, timerSeconds]);

  // Water Tracker
  const [waterGlasses, setWaterGlasses] = useState<number>(3);
  const maxGlasses = 8;

  // Mood Tracker
  const [mood, setMood] = useState<string>("peaceful");
  const moods = [
    { label: "peaceful", emoji: "🌊" },
    { label: "focused", emoji: "🍃" },
    { label: "creative", emoji: "✨" },
    { label: "tired", emoji: "☁️" }
  ];

  // Daily Habits
  const [habits, setHabits] = useState([
    { id: 1, name: "Stretch for 5 mins", checked: true },
    { id: 2, name: "Read a physical page", checked: false },
    { id: 3, name: "No screens after 10 PM", checked: false }
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, checked: !h.checked } : h));
  };

  return (
    <div className="space-y-6">
      {/* 1. Time, Date & Location Widget */}
      <div className="border border-border/80 bg-background dark:bg-[#151E3D]/40 p-6 rounded-3xl space-y-2 shadow-sm text-center md:text-left">
        <div className="text-3xl font-serif font-bold text-[#0A1128] dark:text-[#F4F6F9]">
          {time || "8:30 AM"}
        </div>
        <div className="text-sm font-medium text-[#5B6B54] dark:text-[#A3B19B]">
          {date || "Thursday, July 2"}
        </div>
        <div className="text-xs text-muted-foreground pt-1 flex items-center justify-center md:justify-start gap-1">
          <span className="size-1.5 bg-green-500 rounded-full inline-block"></span>
          Noida, India • Noida Timezone (IST)
        </div>
      </div>

      {/* 2. Weather Widget */}
      <div className="border border-border/80 bg-background dark:bg-[#151E3D]/40 p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Sun className="size-5 text-amber-500" />
            <span className="text-sm font-bold">Noida Weather</span>
          </div>
          <span className="text-xl font-serif font-bold">84°F</span>
        </div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Droplet className="size-3.5" /> Humid: 62%
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="size-3.5" /> Wind: 8 mph
          </div>
          <div className="flex items-center gap-1.5">
            <Sun className="size-3.5" /> Rise: 05:24 AM
          </div>
          <div className="flex items-center gap-1.5">
            <Moon className="size-3.5" /> Set: 07:12 PM
          </div>
        </div>
      </div>

      {/* 3. Pomodoro Focus Session Timer */}
      <div className="border border-border/80 bg-background dark:bg-[#151E3D]/40 p-6 rounded-3xl space-y-4 shadow-sm text-center">
        <div className="flex items-center justify-between border-b pb-3 text-left">
          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Coffee className="size-4" /> Focus Timer
          </h5>
          <span className="text-xs text-muted-foreground">
            Streak: {sessionCount}
          </span>
        </div>
        <div className="font-serif text-4xl font-bold py-2 tracking-wide text-[#0A1128] dark:text-[#F4F6F9]">
          {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex-1 bg-[#0A1128] text-white dark:bg-[#F4F6F9] dark:text-[#0B132B] py-2 rounded-full text-xs font-semibold hover:scale-[1.02] transition-transform duration-300"
          >
            {isActive ? "Pause" : "Start Session"}
          </button>
          <button
            onClick={() => {
              setIsActive(false);
              setTimerMinutes(25);
              setTimerSeconds(0);
            }}
            className="px-4 py-2 border border-border rounded-full text-xs hover:bg-[#A3B19B]/10 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 4. Hydration & Mood Tracker */}
      <div className="border border-border/80 bg-background dark:bg-[#151E3D]/40 p-6 rounded-3xl space-y-5 shadow-sm">
        {/* Mood tracker */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current State</h5>
          <div className="flex gap-2 justify-between">
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                title={m.label}
                className={`p-2.5 rounded-xl border text-base flex-1 transition-all ${
                  mood === m.label
                    ? "bg-[#A3B19B]/20 border-[#A3B19B] scale-105"
                    : "border-border/80 hover:bg-muted"
                }`}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Water tracker */}
        <div className="space-y-2 pt-2 border-t border-[#0A1128]/5 dark:border-white/5">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="font-bold">Water Intake</span>
            <span>{waterGlasses} / {maxGlasses} glasses</span>
          </div>
          <div className="flex gap-1.5 pt-1">
            {Array.from({ length: maxGlasses }).map((_, i) => (
              <button
                key={i}
                onClick={() => setWaterGlasses(i + 1)}
                className={`h-7 flex-1 rounded-md transition-all ${
                  i < waterGlasses
                    ? "bg-sky-400 dark:bg-sky-500 scale-105"
                    : "bg-[#0A1128]/5 dark:bg-white/5 border border-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 5. Daily Habits Widget */}
      <div className="border border-border/80 bg-background dark:bg-[#151E3D]/40 p-6 rounded-3xl space-y-4 shadow-sm">
        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">Calm Habits</h5>
        <div className="space-y-2">
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-border/80 text-left text-xs transition-colors hover:bg-[#A3B19B]/5"
            >
              <span className={habit.checked ? "line-through text-muted-foreground" : "font-medium"}>
                {habit.name}
              </span>
              <span className={`size-4 rounded-full border flex items-center justify-center ${
                habit.checked ? "bg-[#A3B19B] border-[#A3B19B]" : "border-border"
              }`}>
                {habit.checked && <span className="size-1.5 bg-white rounded-full" />}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Quote of the Day */}
      <div className="border border-border/80 bg-[#A3B19B]/10 dark:bg-white/5 p-6 rounded-3xl shadow-sm text-center italic text-xs text-muted-foreground leading-relaxed">
        "Sitting near the ocean on a quiet morning, planning your day without distractions."
      </div>
    </div>
  );
}
