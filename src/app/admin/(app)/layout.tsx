import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminShell from "../AdminShell";

/**
 * Guards every authenticated admin page.
 *
 * proxy.ts already turns anonymous visitors away; this repeats the check on the
 * server (defence in depth) and additionally verifies the signed-in user is on
 * the admin_users allow-list, which the proxy cannot do cheaply.
 */
export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) redirect("/admin/login");

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const supabase = await createClient();
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h1 className="font-display text-xl font-black text-stone-900">Access not granted</h1>
          <p className="mt-3 text-sm text-stone-600 leading-relaxed">
            You are signed in as <span className="font-bold">{user.email}</span>, but this account is
            not on the admin list. Add it with the INSERT at the bottom of
            <code className="mx-1 rounded bg-stone-100 px-1.5 py-0.5 text-[12px]">
              0001_admin_auth.sql
            </code>
            and reload.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-block rounded-full bg-stone-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
