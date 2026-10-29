"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [{"href":"/","label":"Check"},{"href":"/method","label":"Method and accuracy"}];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] backdrop-blur-xl" style={{ background: "#041012cc" }}>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-y-2 px-4 py-3">
        <Link href="/" className="font-display flex items-center gap-2.5 text-lg font-semibold">
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400/50 motion-reduce:animate-none" />
            <span className="relative inline-block h-2 w-2 rounded-full bg-teal-300" />
          </span>
          Scam Shield
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-1 text-sm">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path === l.href || path.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 transition-colors ${active ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/#check" className="ml-2 rounded-full bg-teal-300 px-4 py-1.5 font-semibold text-zinc-950 transition hover:bg-teal-200">
            Check a message
          </Link>
        </nav>
      </div>
    </header>
  );
}
