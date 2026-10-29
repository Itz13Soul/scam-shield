import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

const ITEMS = [
  "Messages and audio you submit are sent to Google's Gemini API to produce a verdict. They are not saved by this site.",
  "Please remove OTPs, passwords, card numbers and other secrets before pasting a message.",
  "No visitor input is written to a database.",
  "Page views are counted with Vercel Web Analytics, which is cookieless and reports aggregate traffic only. No advertising or cross-site tracking is used."
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <p className="mt-3 text-zinc-300">Scam Shield is a personal portfolio project by Divyansh Srivastava. This is what it does with data.</p>
      <ul className="mt-6 space-y-3 text-zinc-300">
        {ITEMS.map((t) => (
          <li key={t} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">{t}</li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-zinc-400">Questions or removal requests: divyanshsrivastava.1301@gmail.com. This page is a plain description of the project and is not legal advice.</p>
    </main>
  );
}
