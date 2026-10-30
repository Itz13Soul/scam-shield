"use client";
import { useEffect, useSyncExternalStore } from "react";
import { getVariant, logAb, type Variant } from "../lib/ab";

const COPY: Record<Variant, { h: string; p: string }> = {
  A: {
    h: "A cloned voice can sound real. The script gives it away.",
    p: "Paste a suspicious message or upload a call recording. Get a plain verdict in Hindi or English, the lines that look like a scam, and what to do next.",
  },
  B: {
    h: "Got a suspicious call or message? Check it before you reply.",
    p: "Paste the message or upload the recording. In seconds you get a plain verdict in Hindi or English, the exact lines that look like a scam, and what to do next.",
  },
};

const noop = () => () => {};

export default function HeroAB() {
  // Variant comes from localStorage, so it is only known in the browser.
  const v = useSyncExternalStore<Variant | null>(noop, getVariant, () => null);
  useEffect(() => {
    if (v) logAb("exposure", v);
  }, [v]);
  const c = COPY[v ?? "A"];
  return (
    <div style={{ visibility: v ? "visible" : "hidden" }}>
      <h1 className="font-display hero-in text-4xl font-semibold leading-[1.1] sm:text-5xl">{c.h}</h1>
      <p className="hero-in mt-5 max-w-xl text-lg text-zinc-300" style={{ animationDelay: "100ms" }}>{c.p}</p>
    </div>
  );
}
