import { z } from "zod";
import { supabaseService } from "../../../lib/supabase";

const Body = z.object({
  experiment: z.literal("hero_v1"),
  variant: z.enum(["A", "B"]),
  event: z.enum(["exposure", "check_started", "check_completed"]),
});

// Light per-instance limit so one visitor cannot flood the counters.
const hits = new Map<string, { n: number; reset: number }>();
function allowed(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) { hits.set(ip, { n: 1, reset: now + 60_000 }); return true; }
  h.n += 1;
  return h.n <= 30;
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allowed(ip)) return new Response(null, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new Response(null, { status: 400 });
  const { experiment, variant, event } = parsed.data;
  try {
    await supabaseService().rpc("bump_ss_ab", { p_experiment: experiment, p_variant: variant, p_event: event });
  } catch {
    /* counting is best-effort */
  }
  return new Response(null, { status: 204 });
}
