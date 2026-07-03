"use client";

import { useEffect, useState } from "react";
import {
  CloudSun,
  Droplets,
  MapPin,
  Moon,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";

interface Weather {
  temp: number;
  humidity: number;
  wind: number;
  code: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  place: string;
}

const CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Storm w/ hail",
};

function fmtTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function Weather() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "denied" | "error">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;

    async function load(lat: number, lon: number) {
      try {
        const wx = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=auto`
        ).then((r) => r.json());

        let place = "Your location";
        try {
          const geo = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          ).then((r) => r.json());
          place =
            geo.city || geo.locality || geo.principalSubdivision || place;
        } catch {
          /* keep default */
        }

        if (cancelled) return;
        setWeather({
          temp: Math.round(wx.current.temperature_2m),
          humidity: wx.current.relative_humidity_2m,
          wind: Math.round(wx.current.wind_speed_10m),
          code: wx.current.weather_code,
          isDay: wx.current.is_day === 1,
          sunrise: wx.daily.sunrise?.[0] ?? "",
          sunset: wx.daily.sunset?.[0] ?? "",
          place,
        });
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => load(pos.coords.latitude, pos.coords.longitude),
      () => !cancelled && setStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 30 * 60 * 1000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <span className="flex items-center gap-2 text-sm font-bold">
          <CloudSun className="size-4 text-clay" /> Weather
        </span>
        {weather && (
          <span className="font-serif text-2xl font-bold">{weather.temp}°C</span>
        )}
      </div>

      {status === "loading" && (
        <p className="pt-4 text-xs text-muted-foreground">Reading the sky…</p>
      )}
      {status === "denied" && (
        <p className="pt-4 text-xs text-muted-foreground">
          Enable location access to see your local weather.
        </p>
      )}
      {status === "error" && (
        <p className="pt-4 text-xs text-muted-foreground">
          Couldn&apos;t reach the weather service right now.
        </p>
      )}

      {weather && status === "ready" && (
        <>
          <div className="flex items-center justify-between pt-3">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" /> {weather.place}
            </span>
            <span className="text-xs font-medium text-sage-deep">
              {CODES[weather.code] ?? "—"}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-y-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Droplets className="size-3.5" /> {weather.humidity}% humidity
            </span>
            <span className="flex items-center gap-1.5">
              <Wind className="size-3.5" /> {weather.wind} km/h
            </span>
            <span className="flex items-center gap-1.5">
              <Sunrise className="size-3.5" /> {fmtTime(weather.sunrise)}
            </span>
            <span className="flex items-center gap-1.5">
              {weather.isDay ? (
                <Sunset className="size-3.5" />
              ) : (
                <Moon className="size-3.5" />
              )}{" "}
              {fmtTime(weather.sunset)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
