import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/admin/result";
import type { KnowledgeRow } from "@/lib/chat/types";
import { faqs } from "@/data/faqs";
import { maintenanceServices } from "@/data/maintenance";
import { brandCategories, otherProducts } from "@/data/products";
import { solutionsDataList } from "@/data/solutions";
import KnowledgeClient from "./KnowledgeClient";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const supabase = await createClient();
  const [{ data, error }, projects, posts] = await Promise.all([
    supabase.from("ai_knowledge").select("*").order("position").order("created_at"),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
  ]);

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        {friendlyError(error)}
      </p>
    );
  }

  const automatic = [
    { label: "Company details", detail: "Address, phone, email, opening hours, certifications and awards" },
    { label: "Solutions", detail: `${solutionsDataList.length} solutions (on-grid, hybrid, off-grid, BESS, MTG, fuel cell, composting, EV)` },
    { label: "Products", detail: `${brandCategories.length} brand ranges + ${otherProducts.length} other product lines` },
    { label: "Maintenance services", detail: `${maintenanceServices.length} services` },
    { label: "FAQ", detail: `${faqs.length} questions and answers` },
    { label: "Projects", detail: `${projects.count ?? 0} published projects (residential customers are never named)` },
    { label: "Blog", detail: `The latest ${Math.min(15, posts.count ?? 0)} published articles, with links` },
  ];

  return <KnowledgeClient initial={(data ?? []) as KnowledgeRow[]} automatic={automatic} />;
}
