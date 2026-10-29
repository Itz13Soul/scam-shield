import type { Metadata } from "next";
import { rulesOnlyLevels, scoreLevels } from "../../lib/metrics";
import type { Level } from "../../lib/rules";
import { CASES } from "../../lib/testset";
import { supabaseAnon } from "../../lib/supabase";

export const metadata: Metadata = { title: "Method and accuracy | Scam Shield" };
export const revalidate = 300;

const pct = (v: number | null) => (v === null ? "n/a" : `${Math.round(v * 100)}%`);

function Table({ title, s }: { title: string; s: ReturnType<typeof scoreLevels> }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm">
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 space-y-1">
        <li className="flex justify-between"><span>Cases</span><span className="tabular-nums">{s.n} ({s.scams} scam, {s.legit} genuine)</span></li>
        <li className="flex justify-between font-medium"><span>Scams caught (recall)</span><span className="tabular-nums">{pct(s.recall)}</span></li>
        <li className="flex justify-between font-medium"><span>Genuine messages wrongly flagged</span><span className="tabular-nums">{pct(s.falseAlarm)}</span></li>
        <li className="flex justify-between"><span>&ldquo;High risk&rdquo; verdicts that were scams</span><span className="tabular-nums">{pct(s.highPrecision)}</span></li>
      </ul>
    </div>
  );
}

export default async function Method() {
  const db = supabaseAnon();
  const { data } = db ? await db.from("ss_evals").select("case_id, level, model") : { data: [] };
  const rows = (data ?? []) as { case_id: string; level: Level; model: string }[];
  const combined = scoreLevels(new Map(rows.map((r) => [r.case_id, r.level])));
  const rulesOnly = scoreLevels(rulesOnlyLevels());
  const models = [...new Set(rows.map((r) => r.model))];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-10">
      <h1 className="text-3xl font-semibold tracking-tight">How it works, and how it is measured</h1>

      <h2 className="mt-8 text-xl font-semibold">What it does</h2>
      <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
        <li>A recording is transcribed in Hindi, Hinglish or English. A pasted message is used as it is.</li>
        <li>A language model judges the script: urgency, a claimed authority, a demand for money, an OTP or a remote-access app, and secrecy. Every flagged trait must quote words that exist in the text, or it is dropped in code.</li>
        <li>Separate fixed rules look for known patterns, such as digital arrest and safe-account transfers. A warning such as &ldquo;do not share your OTP&rdquo; does not trigger them.</li>
        <li>The final risk is the higher of the two. The wording is never &ldquo;safe&rdquo;: the lowest level is &ldquo;no scam traits found&rdquo;.</li>
      </ol>

      <h2 className="mt-8 text-xl font-semibold">Measured on {CASES.length} labelled cases</h2>
      <p className="mt-2 text-sm text-zinc-400">
        {CASES.length} short texts written and labelled by the developer: half scam scripts and half genuine messages, in English, Hinglish and Hindi. Genuine cases include real-style bank alerts and police awareness notices that contain scam words on purpose.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Table title="Pattern rules alone (no model)" s={rulesOnly} />
        {combined.n === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm text-zinc-300">Model plus rules: the evaluation has not been run yet, so no score is reported.</div>
        ) : (
          <Table title="Model plus rules (what you use)" s={combined} />
        )}
      </div>
      {models.length > 0 && <p className="mt-2 text-xs text-zinc-500">Model: {models.join(", ")}.</p>}

      <h2 className="mt-8 text-xl font-semibold">Limits</h2>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-zinc-300">
        <li>The test set is small and synthetic. It is not a sample of real scam traffic, so real-world accuracy will be lower. Treat the scores as an early baseline.</li>
        <li>This version does not detect cloned or deepfake voices. It reads what is said, not how it sounds. Audio deepfake scoring and the WhatsApp bot are planned and not claimed here.</li>
        <li>The pattern rules were written by the same developer who wrote the test cases, so the rules-only score is likely optimistic. A held-out set from another author is needed for a fair figure.</li>
        <li>Transcription can mishear Hindi or noisy audio, and the verdict depends on the transcript. In testing, the transcriber invented short phrases from a silent clip, so silent recordings are rejected before transcription (in the browser and, for WAV files, on the server) and the page always shows the transcript for you to check.</li>
        <li>A scammer who avoids these patterns can pass. Never treat &ldquo;no scam traits found&rdquo; as proof of safety. Verify through a number you already trust, and report fraud at 1930.</li>
        <li>Not legal advice. A probability, not proof. Uploaded audio and pasted text are processed to produce the verdict and are not stored.</li>
      </ul>
    </main>
  );
}
