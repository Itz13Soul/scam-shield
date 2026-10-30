"use client";
import { track } from "./track";

// Landing-page A/B test. A visitor is randomly assigned A or B once and keeps it.
// Counts are first-party and anonymous: only experiment, variant, event and day are stored.
export const EXPERIMENT = "hero_v1";
export type Variant = "A" | "B";
export type AbEvent = "exposure" | "check_started" | "check_completed";

export function getVariant(): Variant {
  const key = `ab:${EXPERIMENT}`;
  try {
    const v = localStorage.getItem(key);
    if (v === "A" || v === "B") return v;
    const pick: Variant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem(key, pick);
    return pick;
  } catch {
    return "A";
  }
}

export function logAb(event: AbEvent, variant: Variant = getVariant()) {
  if (event === "exposure") {
    try {
      const k = `ab-exposed:${EXPERIMENT}`;
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
    } catch {
      /* ignore */
    }
  }
  fetch("/api/ab", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ experiment: EXPERIMENT, variant, event }),
    keepalive: true,
  }).catch(() => {});
  track(`ab_${event}`, { experiment: EXPERIMENT, variant });
}
