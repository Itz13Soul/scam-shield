import Link from "next/link";

const LINKS = [
  { href: "/", label: "Check" },
  { href: "/method", label: "Method and accuracy" },
];

export default function Nav() {
  return (
    <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-y-2 px-4 py-5">
      <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-teal-400 shadow-[0_0_12px_2px_rgba(45,212,191,0.7)]" />
        Scam Shield
      </Link>
      <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-5 text-sm text-zinc-300">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="transition-colors hover:text-zinc-100">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
