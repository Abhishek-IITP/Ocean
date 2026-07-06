"use client";

import { useEffect, useState, useRef } from "react";
import { Music, RefreshCw, HelpCircle, Link2, Sparkles, Play, Pause, Volume2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const PRESET_PLAYLISTS = [
  {
    name: "Ocean Waves",
    emoji: "🌊",
    type: "native" as const,
    url: "https://actions.google.com/sounds/v1/water/sea_waves.ogg",
  },
  {
    name: "Lofi Ambient",
    emoji: "☕",
    type: "native" as const,
    url: "https://actions.google.com/sounds/v1/music/ambient_music.ogg",
  },
  {
    name: "Kyoto Rain",
    emoji: "🌧️",
    type: "native" as const,
    url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg",
  },
];

/**
 * Converts Spotify and YouTube share links to iframe embed formats
 */
function getEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);

    // Spotify playlist/track/album parser
    if (url.hostname.includes("spotify.com")) {
      const path = url.pathname;
      if (path.startsWith("/playlist/")) {
        const id = path.split("/")[2];
        return `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
      }
      if (path.startsWith("/track/")) {
        const id = path.split("/")[2];
        return `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
      }
      if (path.startsWith("/album/")) {
        const id = path.split("/")[2];
        return `https://open.spotify.com/embed/album/${id}?utm_source=generator&theme=0`;
      }
    }

    // YouTube playlist/video parser
    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
      const listParam = url.searchParams.get("list");
      if (listParam) {
        return `https://www.youtube.com/embed/videoseries?list=${listParam}`;
      }
      const vParam = url.searchParams.get("v");
      if (vParam) {
        return `https://www.youtube.com/embed/${vParam}`;
      }
      if (url.hostname.includes("youtu.be")) {
        const id = url.pathname.slice(1);
        return `https://www.youtube.com/embed/${id}`;
      }
    }
  } catch (e) {
    if (rawUrl.includes("spotify.com/embed/") || rawUrl.includes("youtube.com/embed/")) {
      return rawUrl;
    }
  }

  return null;
}

export function FocusSoundscape() {
  const [mounted, setMounted] = useState(false);
  const [playlistInput, setPlaylistInput] = useState("");
  const [activeUrl, setActiveUrl] = useState<string>("");
  const [playerType, setPlayerType] = useState<"native" | "embed">("native");
  const [errorMsg, setErrorMsg] = useState("");

  // Native player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    setMounted(true);
    const savedUrl = localStorage.getItem("ocean_focus_playlist");
    const savedType = localStorage.getItem("ocean_focus_playlist_type") as "native" | "embed" | null;

    if (savedUrl && savedType) {
      setActiveUrl(savedUrl);
      setPlayerType(savedType);
      setPlaylistInput(savedUrl);
    } else {
      // Default to Ocean Waves preset
      setActiveUrl(PRESET_PLAYLISTS[0].url);
      setPlayerType("native");
      setPlaylistInput(PRESET_PLAYLISTS[0].url);
    }
  }, []);

  // Update volume on audio tag
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle playing source changes
  useEffect(() => {
    if (playerType === "native" && audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [activeUrl, playerType]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setErrorMsg("Could not play ambient stream. Try again."));
    }
  };

  const handleLoadPlaylist = (url: string) => {
    setErrorMsg("");
    if (!url.trim()) return;

    // Check if preset match first
    const preset = PRESET_PLAYLISTS.find(p => p.url === url);
    if (preset) {
      setPlayerType("native");
      setActiveUrl(url);
      localStorage.setItem("ocean_focus_playlist", url);
      localStorage.setItem("ocean_focus_playlist_type", "native");
      return;
    }

    const embed = getEmbedUrl(url);
    if (embed) {
      // Pause native player
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);

      setPlayerType("embed");
      setActiveUrl(url);
      localStorage.setItem("ocean_focus_playlist", url);
      localStorage.setItem("ocean_focus_playlist_type", "embed");
    } else {
      setErrorMsg("Link not recognized. Paste a standard Spotify or YouTube share URL.");
    }
  };

  const handleReset = () => {
    setErrorMsg("");
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);

    setPlayerType("native");
    setActiveUrl(PRESET_PLAYLISTS[0].url);
    setPlaylistInput(PRESET_PLAYLISTS[0].url);
    localStorage.removeItem("ocean_focus_playlist");
    localStorage.removeItem("ocean_focus_playlist_type");
  };

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-soft h-[360px] animate-pulse" />
    );
  }

  const embedUrl = getEmbedUrl(activeUrl);

  return (
    <div className="rounded-2xl border border-border/50 bg-card/90 backdrop-blur-md p-5 shadow-soft hover:shadow-medium transition-all duration-300 flex flex-col gap-4 select-none relative overflow-hidden group/card">
      
      {/* Decorative gradient overlay glow */}
      <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-sage-deep/5 rounded-full blur-2xl pointer-events-none group-hover/card:bg-sage-deep/10 transition-colors duration-500" />

      {/* Hidden native HTML5 Audio Player */}
      <audio
        ref={audioRef}
        src={playerType === "native" ? activeUrl : undefined}
        loop
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sage-deep/10 dark:bg-sage-deep/20 text-sage-deep">
            <Music className="size-4" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-foreground">Soundscape</h3>
            <p className="text-[9px] text-muted-foreground">Focus environment audio</p>
          </div>
        </div>

        {/* Audio Visualizer Bars */}
        <div className="flex items-center gap-1.5">
          {((playerType === "native" && isPlaying) || (playerType === "embed" && embedUrl)) && (
            <div className="flex items-end gap-[2px] h-3 px-2">
              <span className="w-[2px] h-full bg-sage-deep rounded-full animate-bounce [animation-duration:600ms]" />
              <span className="w-[2px] h-2/3 bg-sage-deep rounded-full animate-bounce [animation-duration:800ms] [animation-delay:150ms]" />
              <span className="w-[2px] h-4/5 bg-sage-deep rounded-full animate-bounce [animation-duration:500ms] [animation-delay:300ms]" />
            </div>
          )}
          <button
            onClick={handleReset}
            title="Reset to default waves"
            className="size-7 rounded-lg border border-border/60 bg-background/50 hover:bg-accent/60 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-deep/50 hover:scale-105 active:scale-95"
          >
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Preset tabs */}
      <div className="flex items-center gap-1.5 flex-wrap relative z-10">
        {PRESET_PLAYLISTS.map((p) => {
          const isActive = activeUrl === p.url && playerType === "native";
          return (
            <button
              key={p.name}
              onClick={() => {
                setPlaylistInput(p.url);
                handleLoadPlaylist(p.url);
              }}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 hover:-translate-y-px active:translate-y-px",
                isActive
                  ? "bg-sage-deep text-sage-deep-foreground border-sage-deep/10 shadow-xs"
                  : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground hover:bg-background/80"
              )}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Link Paste box */}
      <div className="flex items-center gap-2 relative z-10">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60" />
          <Input
            value={playlistInput}
            onChange={(e) => setPlaylistInput(e.target.value)}
            placeholder="Paste Spotify/YouTube link..."
            className="h-9 text-xs rounded-xl pl-9 focus-visible:ring-1 focus-visible:ring-sage-deep/50 bg-background/50 border-border/60 focus:bg-background"
          />
        </div>
        <Button
          size="sm"
          onClick={() => handleLoadPlaylist(playlistInput)}
          className="h-9 px-4 text-xs font-semibold rounded-xl bg-sage-deep hover:bg-sage-deep/90 text-sage-deep-foreground cursor-pointer transition-all duration-200 hover:-translate-y-px active:translate-y-px shadow-xs"
        >
          Load
        </Button>
      </div>

      {errorMsg && (
        <span className="text-[10px] font-semibold text-destructive leading-none -mt-1 block px-1 animate-pulse">
          {errorMsg}
        </span>
      )}

      {/* Interactive Sound Dashboard Player */}
      <div className="relative rounded-xl border border-border/80 bg-zinc-950 overflow-hidden h-[152px] w-full shadow-inner flex items-center justify-center">
        {/* Soft display screen gloss */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-10" />

        {playerType === "native" ? (
          /* A. Redesigned Premium 100% Ad-Free Native Ambient Player UI */
          <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-zinc-900/60 to-zinc-950 z-20">
            {/* Playing track details */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-sage-deep/80 block mb-0.5">
                  100% Ad-Free Ambient Stream
                </span>
                <span className="text-sm font-serif font-bold text-zinc-100 block">
                  {activeUrl.includes("sea_waves") && "Ocean Shoreline Waves"}
                  {activeUrl.includes("ambient_music") && "Zen Lofi Meditation"}
                  {activeUrl.includes("rain_heavy") && "Heavy Kyoto Rain"}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  Looped directly from secure Google Sound libraries
                </span>
              </div>
              <Music className={cn("size-5 text-sage-deep", isPlaying && "animate-spin [animation-duration:8s]")} />
            </div>

            {/* Play/Pause controls + volume slider */}
            <div className="flex items-center justify-between gap-4 border-t border-zinc-800/60 pt-3">
              {/* Play / Pause Action */}
              <button
                onClick={handlePlayPause}
                className={cn(
                  "size-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md",
                  isPlaying 
                    ? "bg-zinc-100 hover:bg-white text-zinc-950 scale-100 hover:scale-105 active:scale-95" 
                    : "bg-sage-deep hover:bg-sage-deep/90 text-white scale-100 hover:scale-105 active:scale-95"
                )}
              >
                {isPlaying ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4 ml-0.5" fill="currentColor" />}
              </button>

              {/* Custom volume control */}
              <div className="flex-1 flex items-center gap-2">
                <Volume2 className="size-4 text-zinc-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sage-deep focus:outline-none"
                />
                <span className="text-[9px] tabular-nums font-bold text-zinc-400 w-6 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* B. Standard Iframe Embed (Spotify/YouTube custom playlists) */
          embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="absolute inset-0 border-0 z-0 opacity-95 hover:opacity-100 transition-opacity duration-300"
              title="Focus Playlist Player"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 gap-2 text-muted-foreground/75 relative z-20">
              <HelpCircle className="size-7 text-muted-foreground/40" />
              <p className="text-xs font-bold text-foreground">No Playlist Loaded</p>
            </div>
          )
        )}
      </div>

      <p className="text-[9px] text-muted-foreground/80 leading-relaxed text-left flex items-start gap-1">
        <Sparkles className="size-3 text-sage-deep shrink-0 mt-[2px]" />
        <span>
          {playerType === "native" 
            ? "Presets bypass all ad blockers, login blocks, and interruptions using native audio loop pipes."
            : "Custom links utilize embedded standard players. Login to premium browser sessions for ad-free play."
          }
        </span>
      </p>
    </div>
  );
}
