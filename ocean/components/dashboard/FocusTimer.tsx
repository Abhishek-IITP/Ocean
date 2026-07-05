"use client";

import { useEffect, useRef, useState, useTransition, useCallback } from "react";
import { createPortal } from "react-dom";
import { Pause, Play, RotateCcw, Maximize, X, Palette, Upload, Volume2 } from "lucide-react";
import { logFocusSession } from "@/app/lib/actions/focus";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "25m", minutes: 25 },
  { label: "45m", minutes: 45 },
  { label: "15m", minutes: 15 },
];

type BgTheme = "default" | "sage-grad" | "custom";

function playAlarmSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play a gentle 3-tone arpeggio Zen chime
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(start);
      osc.stop(start + duration);
    };

    // Play C5, E5, G5 arpeggio
    playTone(523.25, ctx.currentTime, 1.8);
    playTone(659.25, ctx.currentTime + 0.15, 1.8);
    playTone(783.99, ctx.currentTime + 0.3, 2.2);
  } catch (err) {
    console.error("Audio Context alarm failed to play:", err);
  }
}

export function FocusTimer({
  minutesToday = 0,
  sessionsToday = 0,
  compact = false,
}: {
  minutesToday?: number;
  sessionsToday?: number;
  compact?: boolean;
}) {
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Custom background themes
  const [bgTheme, setBgTheme] = useState<BgTheme>("default");
  const [customBg, setCustomBg] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);

  // Ref to ignore native fullscreen exits while file browser is open
  const ignoreFullscreenChange = useRef(false);

  const [, startTransition] = useTransition();
  const router = useRouter();
  const startedLabel = useRef<string>("");

  // Load custom settings on client mount
  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem("ocean-focus-theme") as BgTheme;
    const savedBg = localStorage.getItem("ocean-focus-custom-bg");
    if (savedTheme) setBgTheme(savedTheme);
    if (savedBg) setCustomBg(savedBg);
  }, []);

  // Listen to browser native fullscreen events to exit overlay when Esc is hit
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (ignoreFullscreenChange.current) return;
      if (!document.fullscreenElement) {
        setFullscreen(false);
        setShowSettings(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Exit fullscreen and log session when completed
  const handleSessionComplete = useCallback(() => {
    setRunning(false);
    
    // Auto exit native fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setFullscreen(false);
    
    // Play premium sound notification
    playAlarmSound();

    startTransition(async () => {
      await logFocusSession({ minutes: duration, label: startedLabel.current });
      toast.success("Focus session complete", {
        description: "Well done. Take a slow breath.",
      });
      router.refresh();
    });
  }, [duration, router]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(id);
          // Run outside setRemaining call to avoid React batch state update issues
          setTimeout(handleSessionComplete, 10);
          return duration * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, duration, handleSessionComplete]);

  function pick(mins: number) {
    setDuration(mins);
    setRemaining(mins * 60);
    setRunning(false);
  }

  // Toggle fullscreen mode
  function enterFullscreen() {
    setFullscreen(true);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  function exitFullscreen() {
    setFullscreen(false);
    setShowSettings(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  // Handle custom image uploads
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    ignoreFullscreenChange.current = true;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCustomBg(base64String);
      setBgTheme("custom");
      localStorage.setItem("ocean-focus-theme", "custom");
      localStorage.setItem("ocean-focus-custom-bg", base64String);
      toast.success("Background image updated");
      setShowSettings(false);

      // Re-engage native fullscreen check and request browser fullscreen again
      setTimeout(() => {
        ignoreFullscreenChange.current = false;
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      }, 300);
    };
    reader.readAsDataURL(file);
  }

  function changeTheme(theme: BgTheme) {
    setBgTheme(theme);
    localStorage.setItem("ocean-focus-theme", theme);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = 1 - remaining / (duration * 60);

  // SVG ring math
  const size = compact ? 96 : 120;
  const stroke = compact ? 5 : 6;
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  // Header / control buttons styling based on theme to prevent weird dark circle shadows on light backgrounds
  const controlBtnClass = cn(
    "rounded-full p-2.5 backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-1 cursor-pointer",
    bgTheme === "custom"
      ? "bg-white/10 hover:bg-white/20 text-white border border-white/20 focus-visible:ring-white"
      : "bg-card hover:bg-accent/40 text-foreground border border-border/50 focus-visible:ring-sage-deep/50"
  );

  // Render Portal modal content
  const fullscreenOverlay = fullscreen && (
    <div
      className={cn(
        "fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-all duration-700 bg-cover bg-center select-none w-screen h-screen",
        bgTheme === "default" && "bg-background text-foreground",
        bgTheme === "sage-grad" && "bg-gradient-to-tr from-sage-deep/15 via-accent/25 to-background text-foreground",
        bgTheme === "custom" && "text-white"
      )}
      style={
        bgTheme === "custom" && customBg
          ? { backgroundImage: `url(${customBg})` }
          : undefined
      }
    >
      {/* Gentle darkening overlay for custom image backgrounds */}
      {bgTheme === "custom" && (
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px] pointer-events-none" />
      )}

      {/* Top Control Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div>
          <span className="font-serif text-sm italic opacity-60">Ocean Focus Mode</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Palette settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={controlBtnClass}
              title="Configure Background"
            >
              <Palette className="size-4" />
            </button>

            {/* Floating settings popover */}
            {showSettings && (
              <div className="absolute right-0 mt-3 w-56 rounded-xl border border-border/50 bg-popover p-3 shadow-soft text-foreground text-left animate-in fade-in slide-in-from-top-3 duration-150">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Background theme</p>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => { changeTheme("default"); setShowSettings(false); }}
                    className={cn("w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer", bgTheme === "default" ? "bg-sage-deep/10 text-sage-deep font-semibold" : "hover:bg-accent/20")}
                  >
                    Default (Theme match)
                  </button>
                  <button
                    onClick={() => { changeTheme("sage-grad"); setShowSettings(false); }}
                    className={cn("w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer", bgTheme === "sage-grad" ? "bg-sage-deep/10 text-sage-deep font-semibold" : "hover:bg-accent/20")}
                  >
                    Sage Mist Gradient
                  </button>
                  <label className="flex items-center justify-between w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer hover:bg-accent/20">
                    <span>Custom Image</span>
                    <Upload className="size-3.5 text-muted-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      onClick={() => { ignoreFullscreenChange.current = true; }}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Close */}
          <button
            onClick={exitFullscreen}
            className={controlBtnClass}
            title="Exit fullscreen focus mode"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Huge Countdown Display */}
      <div className="relative z-10 text-center animate-rise">
        <h1 className="font-serif font-bold text-[18vw] leading-none tracking-tight tabular-nums select-all">
          {mm}:{ss}
        </h1>
        <p className="mt-4 text-sm md:text-base font-medium tracking-widest uppercase opacity-75">
          {running ? "Breathe slowly & remain focused" : "Session Paused"}
        </p>

        {/* Play/Pause controls in fullscreen */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            onClick={() => setRunning((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold transition-all cursor-pointer shadow-soft",
              bgTheme === "custom"
                ? "bg-white text-black hover:bg-white/90 hover:scale-105"
                : "bg-sage-deep text-white hover:bg-sage-deep/90 hover:scale-105"
            )}
          >
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
            {running ? "Pause Session" : "Resume Focus"}
          </button>
          <button
            onClick={() => {
              try {
                playAlarmSound();
                toast.success("Bell sound test played successfully.");
              } catch (e) {}
            }}
            className={controlBtnClass}
            title="Test Alarm Sound"
          >
            <Volume2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="rounded-2xl border border-border/50 bg-card shadow-soft">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-3.5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep/80">
            Focus
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {Math.round(minutesToday)}m · {sessionsToday} today
            </span>
            {!compact && (
              <button
                onClick={enterFullscreen}
                className="rounded-md p-1 text-muted-foreground/75 hover:bg-accent/30 hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50"
                title="Enter fullscreen focus mode"
              >
                <Maximize className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center px-5 py-5">
          {/* Watch face */}
          <div className="relative" style={{ width: size, height: size }}>
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="-rotate-90"
            >
              {/* Track */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                strokeWidth={stroke}
                className="stroke-border"
              />
              {/* Progress arc */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                strokeWidth={stroke}
                strokeLinecap="round"
                className={cn(
                  "stroke-sage-deep transition-[stroke-dashoffset] duration-1000 ease-linear",
                  running && "animate-pulse [animation-duration:3s]"
                )}
                strokeDasharray={c}
                strokeDashoffset={(1 - progress) * c}
              />
            </svg>
            {/* Timer display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn(
                "font-serif font-bold tabular-nums leading-none",
                compact ? "text-2xl" : "text-3xl"
              )}>
                {mm}:{ss}
              </span>
              {!compact && (
                <span className="mt-1 text-[10px] text-muted-foreground/70">
                  {running ? "in progress" : "ready"}
                </span>
              )}
            </div>
          </div>

          {/* Preset selector */}
          {!compact && (
            <div className="mt-4 flex gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.minutes}
                  onClick={() => pick(p.minutes)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer",
                    duration === p.minutes
                      ? "bg-sage-deep/10 text-sage-deep"
                      : "text-muted-foreground hover:bg-accent/25 hover:text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setRunning((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer",
                running
                  ? "bg-sage-deep/10 text-sage-deep hover:bg-sage-deep/15"
                  : "bg-sage-deep text-sage-deep-foreground hover:-translate-y-px hover:bg-sage-deep/90"
              )}
            >
              {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => pick(duration)}
              className="grid size-9 place-items-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-sage-deep/30 hover:bg-accent/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 cursor-pointer"
              aria-label="Reset"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Render overlay at root body using React Portals */}
      {isClient && fullscreen && createPortal(fullscreenOverlay, document.body)}
    </>
  );
}
