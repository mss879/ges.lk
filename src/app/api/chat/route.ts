import { NextResponse, type NextRequest } from "next/server";

import { runAgent } from "@/lib/chat/agent";
import { isChatConfigured, MAX_MESSAGE_LENGTH } from "@/lib/chat/config";
import { getAgentContext } from "@/lib/chat/context";
import { dailyCapReached, sessionLimitReason, tooManyNewSessions, visitorHashes } from "@/lib/chat/rate-limit";
import {
  appendMessage,
  createSession,
  getHistory,
  getSessionForVisitor,
  getTranscriptForVisitor,
  toTurn,
} from "@/lib/chat/store";
import type { ChatMessageMeta } from "@/lib/chat/types";

/**
 * The widget's endpoint (ported from the Makro build).
 *
 *   POST — send a message, get the reply. Auth is the (sessionId, token) pair
 *          (src/lib/chat/store.ts); a request with no session starts one.
 *   GET  — the transcript for (sessionId, token), to restore the widget after
 *          a reload.
 *
 * The server loads the conversation history itself, so a visitor can't put
 * words in the assistant's mouth by editing what their browser sends.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const FALLBACK_PHONE = "076 533 2332";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  if (!isChatConfigured) return json({ error: "The assistant is not available right now." }, 503);
  const params = request.nextUrl.searchParams;
  try {
    const messages = await getTranscriptForVisitor(params.get("sessionId"), params.get("token"));
    if (!messages) return json({ error: "This conversation has expired." }, 404);
    return json({ messages });
  } catch (error) {
    console.error("[chat] GET failed:", error);
    return json({ error: "Couldn't load the conversation." }, 500);
  }
}

export async function POST(request: NextRequest) {
  if (!isChatConfigured) {
    return json({ error: `The assistant is not available right now. Please call ${FALLBACK_PHONE}.` }, 503);
  }

  let body: { sessionId?: unknown; token?: unknown; message?: unknown; path?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Malformed request." }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return json({ error: "Type a message first." }, 400);
  if (message.length > MAX_MESSAGE_LENGTH) {
    return json({ error: `Please keep it under ${MAX_MESSAGE_LENGTH} characters.` }, 400);
  }

  try {
    const ctx = await getAgentContext();
    if (!ctx.settings.is_enabled) {
      return json({ error: `The assistant is offline right now. Please call ${FALLBACK_PHONE} or use the contact form.` }, 503);
    }
    if (await dailyCapReached(ctx.settings.daily_message_cap)) {
      return json({ error: `The assistant is very busy today. Please call ${FALLBACK_PHONE} or use the contact form.` }, 429);
    }

    const { ipHash, visitorHash } = visitorHashes(request.headers);
    const hasSession = typeof body.sessionId === "string" && typeof body.token === "string";

    let session;
    if (hasSession) {
      session = await getSessionForVisitor(body.sessionId, body.token);
      // Unknown id, or a token that doesn't match it — the same answer for both.
      if (!session) return json({ error: "This conversation has expired." }, 404);
    } else {
      if (await tooManyNewSessions(ipHash)) {
        return json({ error: "Too many new conversations from your connection. Please try again later." }, 429);
      }
      session = await createSession({
        visitorHash,
        ipHash,
        startedPath: typeof body.path === "string" ? body.path.slice(0, 512) : null,
        userAgent: request.headers.get("user-agent")?.slice(0, 400) ?? null,
      });
    }

    const limited = sessionLimitReason(session);
    if (limited) return json({ error: limited }, 429);

    await appendMessage(session.id, "user", message);
    const history = await getHistory(session.id);

    let text: string;
    const meta: ChatMessageMeta = {};
    try {
      const reply = await runAgent(session, history, ctx);
      if (reply.leadError) {
        // Worth a server log even though the visitor is answered gracefully —
        // a lead that failed to save is a lost sale.
        console.error("[chat] lead capture failed:", reply.leadError);
      }
      if (reply.estimate) meta.estimate = reply.estimate;
      if (reply.lead) {
        meta.leadCaptured = !reply.lead.duplicate;
        meta.leadId = reply.lead.leadId;
        meta.duplicateLead = reply.lead.duplicate;
      }
      text =
        reply.text ||
        (reply.lead
          ? "Thank you — the GES team will be in touch shortly. Is there anything else I can help with?"
          : "Thanks! Could you tell me a little more so I can help?");
    } catch (error) {
      const timedOut = error instanceof Error && /abort|timeout/i.test(`${error.name} ${error.message}`);
      console.error("[chat] model call failed:", error);
      text = timedOut
        ? `Sorry, that took too long. Please try again — or call us on ${FALLBACK_PHONE}.`
        : `Sorry, I'm having trouble answering right now. Please try again, or call us on ${FALLBACK_PHONE}.`;
    }

    const stored = await appendMessage(session.id, "assistant", text, Object.keys(meta).length ? meta : null);

    return json({ sessionId: session.id, token: session.token, messages: [toTurn(stored)] });
  } catch (error) {
    console.error("[chat] POST failed:", error);
    return json({ error: "Something went wrong on our side. Please try again." }, 500);
  }
}
