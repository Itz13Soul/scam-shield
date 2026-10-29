"use client";

import { useState } from "react";

export default function EvalRunner() {
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setLog([]);
    let from = 0;
    let total = 1;
    while (from < total) {
      try {
        const res = await fetch("/api/admin/eval-batch", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ from, count: 4 }) });
        const data = (await res.json().catch(() => null)) as { next?: number; total?: number; results?: { id: string; ok: boolean; error?: string }[]; error?: string } | null;
        if (!res.ok || !data || data.next === undefined) {
          setLog((l) => [...l, `Stopped at ${from}: ${data?.error ?? "server error"}`]);
          break;
        }
        total = data.total ?? total;
        const failed = (data.results ?? []).filter((r) => !r.ok);
        setLog((l) => [...l, `${data.next}/${total} done${failed.length ? `, failed: ${failed.map((f) => `${f.id} (${f.error})`).join("; ")}` : ""}`]);
        if (failed.length) break;
        from = data.next;
      } catch {
        setLog((l) => [...l, `Network error at ${from}`]);
        break;
      }
    }
    setBusy(false);
  }

  async function clear() {
    const res = await fetch("/api/admin/clear", { method: "POST" });
    setLog([res.ok ? "Cleared stored results." : "Clear failed."]);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Evaluation console</h1>
      <p className="text-sm text-zinc-400">Runs the full check on every labelled test case and stores the verdicts used by the Method page.</p>
      <div className="flex gap-2">
        <button onClick={run} disabled={busy} className="rounded-lg bg-teal-400 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-40">
          {busy ? "Running..." : "Run evaluation"}
        </button>
        <button onClick={clear} disabled={busy} className="rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-300 disabled:opacity-40">
          Clear results
        </button>
      </div>
      <ul className="space-y-1 text-sm text-zinc-300">
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
