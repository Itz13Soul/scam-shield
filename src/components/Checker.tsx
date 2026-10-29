"use client";

import { useState } from "react";
import type { Analysis } from "../lib/analyze";
import { ruleFloor, ruleHits, type RuleHit } from "../lib/rules";

type Result = { transcript: string | null; language: string | null; analysis: Analysis };

const EXAMPLES = [
  "मैं सीबीआई से बोल रहा हूँ। आपको डिजिटल अरेस्ट किया जाता है। किसी को मत बताइए और तुरंत वीडियो कॉल पर आइए।",
  "Sir aapka bank account block ho jayega. KYC update ke liye abhi apna OTP bataiye, ye urgent hai.",
  "Your OTP for login is 482913. Do not share this OTP with anyone. Bank staff never ask for your OTP.",
];

const LEVEL = {
  high: { en: "High risk: this follows a scam script", hi: "ज्यादा खतरा: यह ठगी की स्क्रिप्ट जैसा है", tone: "border-red-400/50 bg-red-500/10 text-red-100", dot: "bg-red-400" },
  suspicious: { en: "Suspicious: some scam traits found", hi: "संदिग्ध: ठगी के कुछ लक्षण मिले", tone: "border-orange-400/50 bg-orange-500/10 text-orange-100", dot: "bg-orange-400" },
  none: { en: "No scam traits found. This is not a guarantee of safety", hi: "ठगी के लक्षण नहीं मिले। इसका मतलब पूरी सुरक्षा की गारंटी नहीं है", tone: "border-teal-400/40 bg-teal-500/10 text-teal-100", dot: "bg-teal-400" },
} as const;

const SIGNAL_LABEL: Record<string, { en: string; hi: string }> = {
  urgency: { en: "Urgency", hi: "जल्दबाजी" },
  impersonation: { en: "Claims to be an authority", hi: "अधिकारी बनने का दावा" },
  payment_request: { en: "Asks for money", hi: "पैसे की मांग" },
  otp_request: { en: "Asks for OTP, PIN or code", hi: "ओटीपी, पिन या कोड की मांग" },
  isolation: { en: "Asks for secrecy", hi: "गोपनीयता की मांग" },
  threat: { en: "Threat", hi: "धमकी" },
  remote_access: { en: "Remote access app", hi: "रिमोट एक्सेस ऐप" },
  too_good_to_be_true: { en: "Too good to be true", hi: "बहुत अच्छा ऑफर" },
};

async function hasSound(file: File): Promise<boolean | null> {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();
    const buf = await ctx.decodeAudioData(await file.arrayBuffer());
    void ctx.close();
    let peak = 0;
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < d.length; i += 16) peak = Math.max(peak, Math.abs(d[i]));
    }
    return peak > 0.02;
  } catch {
    return null;
  }
}

export default function Checker() {
  const [mode, setMode] = useState<"text" | "audio">("text");
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [quick, setQuick] = useState<RuleHit[] | null>(null);
  const [elapsed, setElapsed] = useState(0);

  async function run() {
    setBusy(true);
    setError("");
    setResult(null);
    setElapsed(0);
    setQuick(mode === "text" ? ruleHits(text) : null);
    const timer = setInterval(() => setElapsed((n) => n + 1), 1000);
    try {
      let res: Response;
      if (mode === "audio" && file) {
        if ((await hasSound(file)) === false) {
          setError("No sound was detected in this recording. Please upload a clearer file.");
          clearInterval(timer);
          setBusy(false);
          return;
        }
        const fd = new FormData();
        fd.append("audio", file);
        res = await fetch("/api/check", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/check", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
      }
      const data = (await res.json().catch(() => ({ error: "The server took too long. Please try again." }))) as Partial<Result> & { error?: string };
      if (!res.ok || !data.analysis) setError(data.error ?? "Something went wrong.");
      else setResult({ transcript: data.transcript ?? null, language: data.language ?? null, analysis: data.analysis });
    } catch {
      setError("Network error.");
    } finally {
      clearInterval(timer);
      setBusy(false);
    }
  }

  const ready = mode === "audio" ? file !== null : text.trim().length >= 15;
  const a = result?.analysis;
  const L = a ? LEVEL[a.level] : null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex gap-1 rounded-lg bg-black/30 p-1">
          {(["text", "audio"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-md px-3 py-1.5 ${mode === m ? "bg-teal-400 font-semibold text-zinc-950" : "text-zinc-300"}`}>
              {m === "text" ? "Paste message" : "Upload recording"}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg bg-black/30 p-1">
          {(["en", "hi"] as const).map((l) => (
            <button key={l} type="button" onClick={() => setLang(l)} className={`rounded-md px-3 py-1.5 ${lang === l ? "bg-white/15 font-semibold" : "text-zinc-400"}`}>
              {l === "en" ? "English" : "हिंदी"}
            </button>
          ))}
        </div>
      </div>

      {mode === "text" ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={4000}
            rows={5}
            placeholder="Paste the SMS, WhatsApp message or call transcript here (Hindi, Hinglish or English)"
            className="mt-3 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-sm placeholder:text-zinc-500 focus:border-teal-400/60 focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" onClick={() => setText(ex)} className="max-w-full truncate rounded-full border border-white/15 px-3 py-1 text-left text-zinc-300 hover:border-teal-400/60">
                {ex}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-3 rounded-lg border border-dashed border-white/20 bg-black/20 p-5 text-sm">
          <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-teal-400 file:px-3 file:py-1.5 file:font-semibold file:text-zinc-950" />
          <p className="mt-2 text-xs text-zinc-500">Voice note or call recording, up to 3.5 MB (about two to three minutes). It is transcribed, checked and not stored.</p>
        </div>
      )}

      <button type="button" onClick={run} disabled={busy || !ready} className="mt-4 rounded-lg bg-teal-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-teal-300 disabled:opacity-40">
        {busy ? "Checking..." : "Check for a scam script"}
      </button>
      {busy && (
        <div className="mt-3 text-xs text-zinc-400" role="status">
          {quick && quick.length > 0 ? (
            <p className="rounded-lg border border-orange-400/40 bg-orange-500/10 p-3 text-orange-100">
              Quick scan already found {quick.length} scam {quick.length === 1 ? "trait" : "traits"} ({quick.map((h) => h.label).join(", ")}). Level so far: {ruleFloor(quick) === "high" ? "high risk" : "suspicious"}. Full check is running ({elapsed}s).
            </p>
          ) : (
            <p>{mode === "audio" ? "Transcribing and checking" : "Full check running"} ({elapsed}s). Most checks finish within 10 seconds.</p>
          )}
        </div>
      )}
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

      {a && L && (
        <div className="mt-5 space-y-4">
          <div className={`rounded-xl border p-4 ${L.tone}`}>
            <p className="flex items-center gap-2 font-semibold">
              <span className={`h-2.5 w-2.5 rounded-full ${L.dot}`} />
              {L[lang]}
            </p>
            <p className="mt-2 text-sm">{a.explanation[lang]}</p>
          </div>

          {result?.transcript && (
            <details className="rounded-lg bg-black/30 p-3 text-sm text-zinc-300">
              <summary className="cursor-pointer text-zinc-400">Transcript ({result.language})</summary>
              <p className="mt-2 whitespace-pre-wrap">{result.transcript}</p>
            </details>
          )}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Evidence from the text</h3>
            {a.signals.length === 0 && a.rules.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-400">No scam traits were quoted.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {a.signals.map((s, i) => (
                  <li key={i} className="rounded-lg bg-black/30 p-3">
                    <span className="mr-2 rounded-full bg-teal-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-200">{SIGNAL_LABEL[s.type]?.[lang] ?? s.type}</span>
                    <span className="text-zinc-300">&ldquo;{s.quote}&rdquo;</span>
                  </li>
                ))}
                {a.rules.map((r, i) => (
                  <li key={`r${i}`} className="rounded-lg bg-black/30 p-3 text-zinc-300">
                    <span className="mr-2 rounded-full bg-violet-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-200">Pattern rule</span>
                    {r.label}: &ldquo;{r.match}&rdquo;
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-zinc-500">Two independent checks: a language model and fixed pattern rules. The higher risk of the two is shown.</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{lang === "en" ? "What to do next" : "आगे क्या करें"}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-200">
              {a.nextSteps[lang].map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <p className="mt-3 rounded-lg bg-white/5 p-3 text-sm text-zinc-300">
              {lang === "en" ? "Report cyber fraud: call 1930 or visit cybercrime.gov.in. Always verify through a number you already trust." : "साइबर ठगी की शिकायत के लिए 1930 पर कॉल करें या cybercrime.gov.in पर जाएं। हमेशा किसी भरोसेमंद नंबर से पुष्टि करें।"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
