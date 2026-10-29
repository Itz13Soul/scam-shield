import { isAdmin } from "../../../../lib/admin";
import { supabaseService } from "../../../../lib/supabase";

export async function POST() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorised." }, { status: 401 });
  const { error } = await supabaseService().from("ss_evals").delete().neq("case_id", "");
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
