import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_AGENT_SETTINGS } from "@/lib/solar/settings";
import type { AgentSettingsRow, KnowledgeRow } from "./types";

/**
 * Everything the agent knows that lives in the database: the client's settings
 * and knowledge entries, plus the live projects list and recent blog articles.
 * Memoised per server instance for a minute — admin edits reach the agent
 * within 60 seconds without a database round-trip on every message.
 */

export interface ProjectFact {
  name: string;
  location: string | null;
  capacity: string | null;
  category: "residential" | "commercial";
}

export interface PostFact {
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
}

export interface AgentContext {
  settings: AgentSettingsRow;
  knowledge: KnowledgeRow[];
  projects: ProjectFact[];
  posts: PostFact[];
}

const TTL_MS = 60_000;
let memo: { at: number; value: AgentContext } | null = null;

export async function getAgentContext(): Promise<AgentContext> {
  if (memo && Date.now() - memo.at < TTL_MS) return memo.value;

  const supabase = createAdminClient();
  if (!supabase) return { settings: DEFAULT_AGENT_SETTINGS, knowledge: [], projects: [], posts: [] };

  const [settings, knowledge, projects, posts] = await Promise.all([
    supabase.from("ai_agent_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("ai_knowledge").select("*").eq("is_active", true).order("position").order("created_at"),
    supabase.from("projects").select("name, location, capacity, category").eq("is_published", true).order("position"),
    supabase
      .from("blog_posts")
      .select("title, slug, excerpt, category")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(15),
  ]);

  if (settings.error) console.error("[chat] settings unavailable, using defaults:", settings.error.message);

  const value: AgentContext = {
    settings: { ...DEFAULT_AGENT_SETTINGS, ...((settings.data as Partial<AgentSettingsRow> | null) ?? {}) },
    knowledge: (knowledge.data as KnowledgeRow[] | null) ?? [],
    projects: (projects.data as ProjectFact[] | null) ?? [],
    posts: (posts.data as PostFact[] | null) ?? [],
  };
  memo = { at: Date.now(), value };
  return value;
}

/** Drops the memo (after an admin save in the same instance). */
export function forgetAgentContext() {
  memo = null;
}
