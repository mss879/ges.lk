import { NextResponse } from "next/server";

import { isChatConfigured } from "@/lib/chat/config";
import { getAgentContext } from "@/lib/chat/context";
import type { ChatPublicConfig } from "@/lib/chat/types";
import { DEFAULT_AGENT_SETTINGS } from "@/lib/solar/settings";

/**
 * What the chat widget shows before the first message: whether the agent is
 * switched on, its name, greeting and suggested questions.
 *
 * Dynamic (it reads the database), but cached at the CDN for a minute so page
 * views don't each hit a function — an admin's change shows within ~60s.
 */
export const dynamic = "force-dynamic";

const CACHE = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
  "Netlify-CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
};

export async function GET() {
  if (!isChatConfigured) {
    const off: ChatPublicConfig = { enabled: false, agentName: "", greeting: "", suggestions: [] };
    return NextResponse.json(off, { headers: CACHE });
  }
  try {
    const { settings } = await getAgentContext();
    const config: ChatPublicConfig = {
      enabled: settings.is_enabled,
      agentName: settings.agent_name || DEFAULT_AGENT_SETTINGS.agent_name,
      greeting: settings.greeting || DEFAULT_AGENT_SETTINGS.greeting,
      suggestions: (settings.suggested_questions ?? []).filter(Boolean).slice(0, 4),
    };
    return NextResponse.json(config, { headers: CACHE });
  } catch (error) {
    console.error("[chat] config failed:", error);
    return NextResponse.json({ enabled: false, agentName: "", greeting: "", suggestions: [] } satisfies ChatPublicConfig, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
