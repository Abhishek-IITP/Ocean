"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { HeroLoopController } from "./useHeroLoopController";

const HeroLoopContext = createContext<HeroLoopController | null>(null);

type HeroLoopProviderProps = {
  value: HeroLoopController;
  children: ReactNode;
};

/**
 * Shares the one `useHeroLoopController()` instance down to every workspace
 * and feed component without prop-drilling `progress` through each layer.
 */
export function HeroLoopProvider({ value, children }: HeroLoopProviderProps) {
  return <HeroLoopContext.Provider value={value}>{children}</HeroLoopContext.Provider>;
}

export function useHeroLoop(): HeroLoopController {
  const controller = useContext(HeroLoopContext);
  if (!controller) {
    throw new Error("useHeroLoop must be used within a HeroLoopProvider");
  }
  return controller;
}
