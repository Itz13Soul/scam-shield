import type { Metadata } from "next";
import AdminLogin from "../../components/AdminLogin";
import EvalRunner from "../../components/EvalRunner";
import { adminConfigured, isAdmin } from "../../lib/admin";

export const metadata: Metadata = { title: "Console", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminConfigured()) {
    return <main className="mx-auto w-full max-w-md px-4 py-10 text-sm text-zinc-400">Admin access is not configured on this deployment.</main>;
  }
  return <main className="mx-auto w-full max-w-3xl px-4 pb-10">{(await isAdmin()) ? <EvalRunner /> : <AdminLogin />}</main>;
}
