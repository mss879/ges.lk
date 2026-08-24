import Link from "next/link";
import { Inbox, KanbanSquare, FolderKanban, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Inquiry, PipelineStage } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  sub,
  href,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  sub?: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:border-[#00AC4E]/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00AC4E]/10 text-[#00AC4E]">
          <Icon className="h-5 w-5" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-stone-300 transition-colors group-hover:text-[#00AC4E]" />
      </div>
      <p className="mt-4 font-display text-3xl font-black tracking-tight text-stone-900">{value}</p>
      <p className="mt-0.5 text-sm font-bold text-stone-700">{label}</p>
      {sub && <p className="mt-0.5 text-xs font-semibold text-stone-400">{sub}</p>}
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [inquiriesTotal, inquiriesNew, leadsTotal, projectsTotal, projectsResidential, projectsCommercial] =
    await Promise.all([
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("category", "residential"),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("category", "commercial"),
    ]);

  const { data: recent } = await supabase
    .from("inquiries")
    .select("id, name, email, subject, status, created_at")
    .order("created_at", { ascending: false })
    .limit(6);

  // Lead counts per stage of the default pipeline.
  const { data: defaultPipeline } = await supabase
    .from("pipelines")
    .select("id, name")
    .eq("is_default", true)
    .maybeSingle();

  let stages: (Pick<PipelineStage, "id" | "name"> & { count: number })[] = [];
  if (defaultPipeline) {
    const { data: stageRows } = await supabase
      .from("pipeline_stages")
      .select("id, name, position")
      .eq("pipeline_id", defaultPipeline.id)
      .order("position");

    if (stageRows?.length) {
      const counts = await Promise.all(
        stageRows.map((s) =>
          supabase.from("leads").select("*", { count: "exact", head: true }).eq("stage_id", s.id)
        )
      );
      stages = stageRows.map((s, i) => ({ id: s.id, name: s.name, count: counts[i].count ?? 0 }));
    }
  }

  const recentInquiries = (recent ?? []) as Pick<
    Inquiry,
    "id" | "name" | "email" | "subject" | "status" | "created_at"
  >[];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-black tracking-tight text-stone-900">Dashboard</h1>
      <p className="mt-1 text-sm font-medium text-stone-500">
        Everything coming through the website, at a glance.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Inquiries"
          value={inquiriesTotal.count ?? 0}
          sub={`${inquiriesNew.count ?? 0} new and unread`}
          href="/admin/inquiries"
          icon={Inbox}
        />
        <StatCard
          label="Leads in CRM"
          value={leadsTotal.count ?? 0}
          sub={defaultPipeline?.name ?? "No pipeline yet"}
          href="/admin/crm"
          icon={KanbanSquare}
        />
        <StatCard
          label="Projects"
          value={projectsTotal.count ?? 0}
          sub={`${projectsResidential.count ?? 0} residential · ${projectsCommercial.count ?? 0} commercial`}
          href="/admin/projects"
          icon={FolderKanban}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* pipeline snapshot */}
        <section className="lg:col-span-2 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-stone-900">Pipeline</h2>
          <p className="text-xs font-semibold text-stone-400">{defaultPipeline?.name ?? "—"}</p>
          <ul className="mt-4 flex flex-col gap-2">
            {stages.length === 0 && (
              <li className="text-xs font-semibold text-stone-400">No stages configured yet.</li>
            )}
            {stages.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3">
                <span className="truncate text-xs font-bold text-stone-600">{s.name}</span>
                <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-black text-stone-700">
                  {s.count}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* recent inquiries */}
        <section className="lg:col-span-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-stone-900">Latest inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs font-bold text-[#00AC4E] hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 flex flex-col divide-y divide-stone-100">
            {recentInquiries.length === 0 && (
              <li className="py-3 text-xs font-semibold text-stone-400">
                No inquiries yet — submissions from the website contact form land here.
              </li>
            )}
            {recentInquiries.map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-stone-800">{q.name}</p>
                  <p className="truncate text-[11px] font-semibold text-stone-400">
                    {q.subject || q.email}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    q.status === "new"
                      ? "bg-[#00AC4E]/10 text-[#00AC4E]"
                      : q.status === "converted"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {q.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
