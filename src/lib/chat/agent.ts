import "server-only";

import { generateText, isStepCount, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

import { estimateSolarSystem } from "@/lib/solar/estimate";
import { toCalculatorSettings } from "@/lib/solar/settings";
import type { EstimateResult } from "@/lib/solar/types";
import { buildSystemPrompt } from "./knowledge";
import type { AgentContext } from "./context";
import { captureLead, saveEstimate } from "./store";
import { CHAT_MODEL, CHAT_PROVIDER, MODEL_TIMEOUT_MS, OPENAI_API_KEY } from "./config";
import type { ChatMessageRow, ChatSessionRow } from "./types";

/**
 * The model call and its two tools (AI SDK v7, as in the Makro build).
 *
 * `generateText` runs exactly ONE step unless `stopWhen` says otherwise. A tool
 * turn needs at least three: the model deciding to call it, the call, and the
 * reply that uses the result — without `stopWhen` the tool fires but the reply
 * comes back empty. Five leaves room for an estimate and a lead in one turn.
 */

export interface AgentReply {
  text: string;
  estimate: EstimateResult | null;
  lead: { leadId: string; duplicate: boolean } | null;
  leadError: string | null;
}

/** One line describing an estimate — for transcripts, CRM notes and history replay. */
export function describeEstimate(e: EstimateResult): string {
  const parts = [
    `${e.panels} × ${e.panelWatt} W panels = ${e.systemKwp} kWp ${e.systemType} (${e.propertyType})`,
    `~${e.monthlyGenerationUnits} units/month`,
    `inverter ${e.inverterKw} kW`,
  ];
  if (e.monthlyUsageUnits !== null) parts.push(`usage ~${e.monthlyUsageUnits} units/month (${e.coveragePct}% covered)`);
  if (e.roofLimited) parts.push("limited by roof space");
  if (e.battery) parts.push(`battery ${e.battery.capacityKwh} kWh (${e.battery.modules} × module)`);
  if (e.monthlySavingsLkr !== null) parts.push(`saves ~LKR ${e.monthlySavingsLkr.toLocaleString("en-US")}/month`);
  if (e.price) parts.push(`price LKR ${e.price.minLkr.toLocaleString("en-US")}–${e.price.maxLkr.toLocaleString("en-US")}`);
  return parts.join(" · ");
}

const ESTIMATE_DESCRIPTION = `Estimate a solar PV system for this visitor with GES's calculator. Use it for ANY question about how many panels, what system size, generation, savings, battery size or payback.

Give at least one of roofArea, monthlyUnits or monthlyBill. Use the visitor's own numbers; don't guess missing ones. Sri Lankans usually give roof sizes in square feet. The result is shown to the visitor as a card — summarise only the headline in your reply.`;

const LEAD_DESCRIPTION = `Save this visitor as a lead in the GES CRM so the team can call them back (site assessment, quote, callback).

Call ONLY when you have their name AND phone number AND they agreed to be contacted — and only once per conversation. Never use placeholders or guessed details; ask instead.`;

function toModelMessages(history: ChatMessageRow[]) {
  return history.map((m) => ({
    role: m.role,
    // The model only sees text, so remind it of numbers it showed in a card.
    content: m.meta?.estimate ? `${m.content}\n\n[Estimate card shown: ${describeEstimate(m.meta.estimate)}]` : m.content,
  }));
}

function leadNotes(
  session: ChatSessionRow,
  input: { town?: string; propertyType?: string; interest?: string; preferredContactTime?: string; summary?: string; email?: string },
  estimate: EstimateResult | null,
) {
  return [
    `Captured by the website AI agent. Chat: /admin/ai-agent/conversations/${session.id}`,
    input.interest && `Interest: ${input.interest}`,
    (input.propertyType || input.town) && `Property: ${[input.propertyType, input.town].filter(Boolean).join(" · ")}`,
    input.preferredContactTime && `Best time to contact: ${input.preferredContactTime}`,
    input.summary && `Summary: ${input.summary}`,
    estimate && `Estimate given (approx.): ${describeEstimate(estimate)}`,
    "Agreed in the chat to be contacted by GES.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function runAgent(session: ChatSessionRow, history: ChatMessageRow[], ctx: AgentContext): Promise<AgentReply> {
  if (CHAT_PROVIDER === "stub") return runStub(session, history, ctx);

  const calc = toCalculatorSettings(ctx.settings);
  let estimate: EstimateResult | null = null;
  let lead: AgentReply["lead"] = null;
  let leadError: string | null = null;

  const openai = createOpenAI({ apiKey: OPENAI_API_KEY });

  const result = await generateText({
    model: openai(CHAT_MODEL),
    instructions: buildSystemPrompt(ctx),
    messages: toModelMessages(history),
    stopWhen: isStepCount(5),
    maxOutputTokens: 700,
    temperature: 0.4,
    abortSignal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
    // Don't let OpenAI retain conversations (see /privacy-policy).
    providerOptions: { openai: { store: false } },
    tools: {
      estimateSolarSystem: tool({
        description: ESTIMATE_DESCRIPTION,
        inputSchema: z.object({
          roofArea: z.number().positive().optional().describe("Roof area available for panels."),
          areaUnit: z.enum(["sqft", "sqm"]).optional().describe("Unit of roofArea. Default sqft."),
          monthlyUnits: z.number().positive().optional().describe("Monthly electricity use in units (kWh), from the CEB/LECO bill."),
          monthlyBill: z.number().positive().optional().describe("Monthly electricity bill in LKR, when units aren't known."),
          propertyType: z.enum(["home", "business"]).optional(),
          systemType: z
            .enum(["on-grid", "hybrid", "off-grid"])
            .optional()
            .describe("on-grid (default), hybrid (grid + battery backup) or off-grid (no grid)."),
          backupHours: z.number().positive().max(48).optional().describe("Hours of battery backup wanted (hybrid/off-grid)."),
          essentialLoadKw: z.number().positive().max(500).optional().describe("Load to keep running on battery, in kW."),
        }),
        execute: async (input) => {
          const outcome = estimateSolarSystem(input, calc);
          if (outcome.ok) {
            estimate = outcome;
            await saveEstimate(session.id, outcome).catch((e) => console.error("[chat] saveEstimate", e));
          }
          return outcome;
        },
      }),
      captureLead: tool({
        description: LEAD_DESCRIPTION,
        inputSchema: z.object({
          name: z.string().min(2).describe("The visitor's name, as they gave it."),
          phone: z.string().min(6).describe("Their phone number exactly as typed, including any country code."),
          email: z.string().optional().describe("Only if they volunteered one."),
          town: z.string().optional().describe("Their town or district, if mentioned."),
          propertyType: z.enum(["home", "business"]).optional(),
          interest: z.string().optional().describe("A few words, e.g. 'On-grid solar for a home', 'Hybrid with backup', 'Maintenance'."),
          preferredContactTime: z.string().optional(),
          summary: z.string().optional().describe("1–3 sentences on what they need, so the team can call with context."),
        }),
        execute: async (input) => {
          if (input.phone.replace(/\D/g, "").length < 9) {
            return { success: false, message: "That phone number looks incomplete. Ask the visitor to check it." };
          }
          const latest = estimate ?? session.estimate ?? null;
          const outcome = await captureLead(session.id, {
            name: input.name,
            phone: input.phone,
            email: input.email ?? null,
            subject: latest
              ? `AI chat · ~${latest.systemKwp} kWp ${latest.systemType} ${latest.propertyType}`
              : `AI chat · ${input.interest || "Solar enquiry"}`,
            notes: leadNotes(session, input, latest),
          });
          if (!outcome.ok) {
            leadError = outcome.reason;
            // The model is told the save failed but not why — a database error
            // is not something to relay into a customer conversation.
            return {
              success: false,
              message: "The details could not be recorded. Apologise briefly and give the phone number 076 533 2332 and email info@ges.lk instead.",
            };
          }
          lead = { leadId: outcome.leadId, duplicate: outcome.duplicate };
          return {
            success: true,
            message: outcome.duplicate
              ? "Already recorded earlier in this conversation — do not ask for details again, and don't say new details were passed on. The team can read this conversation."
              : "Recorded. Confirm warmly in one sentence that the GES team will be in touch.",
          };
        },
      }),
    },
  });

  return { text: result.text.trim(), estimate, lead, leadError };
}

/**
 * Deterministic stand-in for the model, enabled with CHAT_PROVIDER=stub. It
 * exercises the real code paths (estimate tool, CRM write) without an API key.
 */
async function runStub(session: ChatSessionRow, history: ChatMessageRow[], ctx: AgentContext): Promise<AgentReply> {
  const last = [...history].reverse().find((t) => t.role === "user")?.content ?? "";
  const calc = toCalculatorSettings(ctx.settings);

  const phone = last.match(/\+?\d[\d\s().-]{7,}\d/)?.[0]?.trim();
  const name = last.match(/(?:i(?:'|’)?m|i am|my name is|name(?:'|’)?s|this is|name:)\s+([a-z][a-z' -]{1,40}?)(?=[,.]|\s+(?:and|my|phone|number|on)\b|$)/i)?.[1]?.trim();
  if (phone && name) {
    const outcome = await captureLead(session.id, {
      name,
      phone,
      subject: "AI chat · Solar enquiry (stub)",
      notes: leadNotes(session, { summary: `[stub provider] ${last}`.slice(0, 500) }, session.estimate ?? null),
    });
    if (!outcome.ok) return { text: "Sorry — I couldn't record those details. Please call 076 533 2332.", estimate: null, lead: null, leadError: outcome.reason };
    return {
      text: outcome.duplicate ? "I already have your details — the team will be in touch." : `Thank you, ${name}. The GES team will call you shortly.`,
      estimate: null,
      lead: { leadId: outcome.leadId, duplicate: outcome.duplicate },
      leadError: null,
    };
  }

  const area = last.match(/(\d[\d,.]*)\s*(sq\.?\s*ft|sqft|square\s*feet|ft2|sq\.?\s*m|sqm|m2|square\s*met)/i);
  const units = last.match(/(\d[\d,.]*)\s*(units|kwh)/i);
  const bill = last.match(/(?:rs\.?|lkr)\s*(\d[\d,.]*)/i);
  if (area || units || bill) {
    const n = (s?: string) => (s ? Number(s.replace(/,/g, "")) : undefined);
    const outcome = estimateSolarSystem(
      {
        roofArea: n(area?.[1]),
        areaUnit: area && /m/i.test(area[2]) && !/ft|feet/i.test(area[2]) ? "sqm" : "sqft",
        monthlyUnits: n(units?.[1]),
        monthlyBill: n(bill?.[1]),
        systemType: /hybrid|backup/i.test(last) ? "hybrid" : /off.?grid/i.test(last) ? "off-grid" : "on-grid",
      },
      calc,
    );
    if (outcome.ok) {
      await saveEstimate(session.id, outcome).catch(() => {});
      return {
        text: `[stub] That's about **${outcome.panels} panels (${outcome.systemKwp} kWp)**, generating roughly **${outcome.monthlyGenerationUnits} units a month**. Would you like the team to arrange a site assessment?`,
        estimate: outcome,
        lead: null,
        leadError: null,
      };
    }
    return { text: `[stub] ${outcome.error}`, estimate: null, lead: null, leadError: null };
  }

  return {
    text: "[stub] GES designs and installs on-grid, hybrid and off-grid solar systems across Sri Lanka. Tell me your roof size or monthly units and I'll estimate a system.",
    estimate: null,
    lead: null,
    leadError: null,
  };
}
