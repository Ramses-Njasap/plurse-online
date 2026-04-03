// useDetectedPlatform.ts
// ─────────────────────────────────────────────────────────────────────────────
// Detects the user's OS at runtime using the browser's navigator APIs.
// Priority: navigator.userAgentData (modern) → navigator.userAgent (fallback).
// Returns a PlatformId — never hardcoded, always runtime-derived.
// Defaults to "windows" only if detection genuinely fails.

"use client";

import { useEffect, useState } from "react";
import type { PlatformId } from "@/data/download/download";

function detectPlatform(): PlatformId {
  if (typeof navigator === "undefined") return "windows"; // SSR safety

  // ── Method 1: navigator.userAgentData (Chrome 90+, Edge 90+) ──
  const uaData = (navigator as Navigator & {
    userAgentData?: { platform?: string };
  }).userAgentData;

  if (uaData?.platform) {
    const p = uaData.platform.toLowerCase();
    if (p.includes("win"))   return "windows";
    if (p.includes("mac"))   return "macos";
    if (p.includes("linux")) return "linux";
  }

  // ── Method 2: navigator.userAgent string parsing (universal fallback) ──
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win"))                          return "windows";
  if (ua.includes("mac") || ua.includes("iphone") || ua.includes("ipad")) return "macos";
  if (ua.includes("linux") || ua.includes("android"))                      return "linux";

  // ── Method 3: navigator.platform (deprecated but broad support) ──
  const platform = (navigator.platform ?? "").toLowerCase();
  if (platform.startsWith("win"))   return "windows";
  if (platform.startsWith("mac"))   return "macos";
  if (platform.startsWith("linux")) return "linux";

  // Final fallback
  return "windows";
}

export function useDetectedPlatform(): PlatformId {
  // Start with "windows" on server, replace with real detection on client
  const [platform, setPlatform] = useState<PlatformId>("windows");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  return platform;
}