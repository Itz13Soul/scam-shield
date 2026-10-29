import { z } from "zod";
import { isAdmin } from "../../../../lib/admin";
import { analyze } from "../../../../lib/analyze";
import { CASES } from "../../../../lib/testset";
import { supabaseService } from "../../../../lib/supabase";

export const maxDuration = 60;

const Body = z.object({ from: z.number().int().min(0).max(CASES.length), count: z.number().int().min(1).max(3) });

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorised." }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request." }, { status: 400 });
  const slice = CASES.slice(parsed.data.from, parsed.data.from + parsed.data.count);
  const db = supabaseService();
  const model = process.env.GEMINI_MODEL ?? "unknown";
  const { data: done } = await db.from("ss_evals").select("case_id").in("case_id", slice.map((c) => c.id));
  const have = new Set((done ?? []).map((r: { case_id: string }) => r.case_id));
  const results = await Promise.all(
    slice.map(async (c) => {
      if (have.has(c.id)) return { id: c.id, ok: true, level: null, error: undefined };
      try {
        const a = await analyze(c.text);
        const { error } = await db
          .from("ss_evals")
          .upsert({ case_id: c.id, level: a.level, model_level: a.modelLevel, rule_level: a.ruleLevel, model });
        return { id: c.id, ok: !error, level: a.level, error: error?.message };
      } catch (err) {
        return { id: c.id, ok: false, level: null, error: String(err).slice(0, 200) };
      }
    }),
  );
  return Response.json({ next: parsed.data.from + slice.length, total: CASES.length, results });
}
