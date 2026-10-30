import { supabaseService } from "../lib/supabase";
import { compare, type Arm } from "../lib/abstats";

export default async function AbResults() {
  const { data, error } = await supabaseService().from("ss_ab").select("variant,event,count").eq("experiment", "hero_v1");
  if (error) return <p className="mt-8 text-sm text-red-300">A/B results could not be loaded.</p>;
  const arms: Record<"A" | "B", Arm> = { A: { exposure: 0, check_started: 0, check_completed: 0 }, B: { exposure: 0, check_started: 0, check_completed: 0 } };
  for (const r of data ?? []) {
    const v = r.variant as "A" | "B"; const e = r.event as keyof Arm;
    if (arms[v] && e in arms[v]) arms[v][e] += r.count as number;
  }
  const s = compare(arms.A, arms.B);
  const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">Landing-page A/B test (hero_v1)</h2>
      <p className="mt-1 text-sm text-zinc-400">A: “A cloned voice can sound real…” · B: “Got a suspicious call or message?…” Conversion = visitors who start a check.</p>
      <table className="mt-4 w-full text-sm">
        <thead className="text-left text-zinc-400"><tr><th>Variant</th><th>Visitors</th><th>Started a check</th><th>Completed</th><th>Conversion</th></tr></thead>
        <tbody>
          {(["A", "B"] as const).map((v) => (
            <tr key={v} className="border-t border-white/10">
              <td className="py-2">{v}</td><td>{arms[v].exposure}</td><td>{arms[v].check_started}</td><td>{arms[v].check_completed}</td>
              <td>{pct(v === "A" ? s.ra : s.rb)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-sm text-zinc-300">
        {s.enough
          ? `B vs A: ${s.lift === null ? "n/a" : (s.lift >= 0 ? "+" : "") + pct(s.lift)} relative change, p = ${s.p.toFixed(3)} (${s.p < 0.05 ? "significant at 5%" : "not significant yet"}).`
          : "Not enough data yet: wait for at least 100 visitors per variant before reading the result."}
      </p>
    </section>
  );
}
