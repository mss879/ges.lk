"use client";

import { useMemo, useState } from "react";
import { Lock, Plus, Pencil, Trash2, X, Mail, Phone, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Lead, Pipeline, PipelineStage } from "@/lib/supabase/types";

export default function CrmBoard({
  initialPipelines,
  initialStages,
  initialLeads,
}: {
  initialPipelines: Pipeline[];
  initialStages: PipelineStage[];
  initialLeads: Lead[];
}) {
  const [pipelines, setPipelines] = useState(initialPipelines);
  const [stages, setStages] = useState(initialStages);
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(
    initialPipelines.find((p) => p.is_default)?.id ?? initialPipelines[0]?.id ?? null
  );
  const [dragging, setDragging] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "" });

  const supabase = createClient();
  const active = pipelines.find((p) => p.id === activeId) ?? null;
  const activeStages = useMemo(
    () => stages.filter((s) => s.pipeline_id === activeId).sort((a, b) => a.position - b.position),
    [stages, activeId]
  );

  const fail = (e: { message: string } | null) => {
    if (e) setError(e.message);
    return Boolean(e);
  };

  /* ----------------------------------------------------------- pipelines */

  const addPipeline = async () => {
    const name = prompt("New pipeline name")?.trim();
    if (!name) return;
    const { data, error: e } = await supabase
      .from("pipelines")
      .insert({ name, position: pipelines.length })
      .select()
      .single();
    if (fail(e) || !data) return;

    // A pipeline is useless without a column — give it a first stage.
    const { data: stage } = await supabase
      .from("pipeline_stages")
      .insert({ pipeline_id: data.id, name: "New", position: 0 })
      .select()
      .single();

    setPipelines((p) => [...p, data as Pipeline]);
    if (stage) setStages((s) => [...s, stage as PipelineStage]);
    setActiveId(data.id);
  };

  const renamePipeline = async (p: Pipeline) => {
    const name = prompt("Rename pipeline", p.name)?.trim();
    if (!name || name === p.name) return;
    const { error: e } = await supabase.from("pipelines").update({ name }).eq("id", p.id);
    if (fail(e)) return;
    setPipelines((prev) => prev.map((x) => (x.id === p.id ? { ...x, name } : x)));
  };

  const deletePipeline = async (p: Pipeline) => {
    if (p.is_default) return;
    if (!confirm(`Delete "${p.name}" and all of its stages and leads?`)) return;
    const { error: e } = await supabase.from("pipelines").delete().eq("id", p.id);
    if (fail(e)) return;
    setPipelines((prev) => prev.filter((x) => x.id !== p.id));
    setStages((prev) => prev.filter((s) => s.pipeline_id !== p.id));
    setLeads((prev) => prev.filter((l) => l.pipeline_id !== p.id));
    setActiveId(pipelines.find((x) => x.id !== p.id)?.id ?? null);
  };

  /* -------------------------------------------------------------- stages */

  const addStage = async () => {
    if (!activeId) return;
    const name = prompt("New stage name")?.trim();
    if (!name) return;
    const { data, error: e } = await supabase
      .from("pipeline_stages")
      .insert({ pipeline_id: activeId, name, position: activeStages.length })
      .select()
      .single();
    if (fail(e) || !data) return;
    setStages((s) => [...s, data as PipelineStage]);
  };

  const renameStage = async (stage: PipelineStage) => {
    const name = prompt("Rename stage", stage.name)?.trim();
    if (!name || name === stage.name) return;
    const { error: e } = await supabase.from("pipeline_stages").update({ name }).eq("id", stage.id);
    if (fail(e)) return;
    setStages((prev) => prev.map((s) => (s.id === stage.id ? { ...s, name } : s)));
  };

  const deleteStage = async (stage: PipelineStage) => {
    if (stage.is_default) return;
    const count = leads.filter((l) => l.stage_id === stage.id).length;
    if (!confirm(count ? `Delete "${stage.name}" and its ${count} lead(s)?` : `Delete "${stage.name}"?`))
      return;
    const { error: e } = await supabase.from("pipeline_stages").delete().eq("id", stage.id);
    if (fail(e)) return;
    setStages((prev) => prev.filter((s) => s.id !== stage.id));
    setLeads((prev) => prev.filter((l) => l.stage_id !== stage.id));
  };

  /* --------------------------------------------------------------- leads */

  const createLead = async (stageId: string) => {
    if (!activeId || !newLead.name.trim()) return;
    const position = leads.filter((l) => l.stage_id === stageId).length;
    const { data, error: e } = await supabase
      .from("leads")
      .insert({
        pipeline_id: activeId,
        stage_id: stageId,
        name: newLead.name.trim(),
        email: newLead.email.trim() || null,
        phone: newLead.phone.trim() || null,
        position,
      })
      .select()
      .single();
    if (fail(e) || !data) return;
    setLeads((prev) => [...prev, data as Lead]);
    setNewLead({ name: "", email: "", phone: "" });
    setAddingTo(null);
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error: e } = await supabase.from("leads").delete().eq("id", id);
    if (fail(e)) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const moveLead = async (leadId: string, stageId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage_id === stageId) return;

    const position = leads.filter((l) => l.stage_id === stageId).length;
    // Optimistic: move the card now, roll back if the write fails.
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage_id: stageId, position } : l)));

    const { error: e } = await supabase
      .from("leads")
      .update({ stage_id: stageId, position })
      .eq("id", leadId);

    if (e) {
      setError(e.message);
      setLeads((prev) => prev.map((l) => (l.id === leadId ? lead : l)));
    }
  };

  /* -------------------------------------------------------------- render */

  if (pipelines.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-stone-500">
          No pipelines yet. Run migration <code className="rounded bg-stone-100 px-1">0003_crm.sql</code> to
          seed the default pipeline, or add one now.
        </p>
        <button
          onClick={addPipeline}
          className="mt-4 rounded-full bg-[#00AC4E] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white cursor-pointer"
        >
          Add pipeline
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
          <p className="text-xs font-semibold text-red-700">{error}</p>
          <button onClick={() => setError(null)} aria-label="Dismiss" className="cursor-pointer">
            <X className="h-3.5 w-3.5 text-red-400" />
          </button>
        </div>
      )}

      {/* pipeline tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {pipelines.map((p) => (
          <div
            key={p.id}
            className={`group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
              p.id === activeId
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            <button onClick={() => setActiveId(p.id)} className="cursor-pointer">
              {p.name}
            </button>
            {p.is_default && <Lock className="h-3 w-3 opacity-60" aria-label="Default pipeline" />}
            {p.id === activeId && (
              <>
                <button onClick={() => renamePipeline(p)} aria-label="Rename pipeline" className="cursor-pointer">
                  <Pencil className="h-3 w-3 opacity-70 hover:opacity-100" />
                </button>
                {!p.is_default && (
                  <button onClick={() => deletePipeline(p)} aria-label="Delete pipeline" className="cursor-pointer">
                    <Trash2 className="h-3 w-3 opacity-70 hover:opacity-100" />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
        <button
          onClick={addPipeline}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-stone-300 px-3.5 py-1.5 text-xs font-bold text-stone-500 hover:border-[#00AC4E] hover:text-[#00AC4E] transition-colors cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          Pipeline
        </button>
      </div>

      {/* board */}
      <div className="mt-5 flex gap-4 overflow-x-auto pb-4">
        {activeStages.map((stage) => {
          const items = leads
            .filter((l) => l.stage_id === stage.id)
            .sort((a, b) => a.position - b.position);
          return (
            <div
              key={stage.id}
              onDragOver={(e) => {
                e.preventDefault();
                setDropTarget(stage.id);
              }}
              onDragLeave={() => setDropTarget((t) => (t === stage.id ? null : t))}
              onDrop={(e) => {
                e.preventDefault();
                setDropTarget(null);
                if (dragging) moveLead(dragging, stage.id);
                setDragging(null);
              }}
              className={`flex w-72 shrink-0 flex-col rounded-2xl border bg-stone-50/80 transition-colors ${
                dropTarget === stage.id ? "border-[#00AC4E] bg-[#00AC4E]/5" : "border-stone-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2 border-b border-stone-200/70 px-3.5 py-2.5">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate text-xs font-black uppercase tracking-wider text-stone-700">
                    {stage.name}
                  </span>
                  {stage.is_default && <Lock className="h-3 w-3 shrink-0 text-stone-400" />}
                  <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-stone-500">
                    {items.length}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => renameStage(stage)} aria-label="Rename stage" className="cursor-pointer">
                    <Pencil className="h-3 w-3 text-stone-400 hover:text-stone-700" />
                  </button>
                  {!stage.is_default && (
                    <button onClick={() => deleteStage(stage)} aria-label="Delete stage" className="cursor-pointer">
                      <Trash2 className="h-3 w-3 text-stone-400 hover:text-red-600" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-2.5">
                {items.map((lead) => (
                  <article
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragging(lead.id)}
                    onDragEnd={() => {
                      setDragging(null);
                      setDropTarget(null);
                    }}
                    className={`group cursor-grab rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition-opacity active:cursor-grabbing ${
                      dragging === lead.id ? "opacity-40" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 truncate text-xs font-black text-stone-900">{lead.name}</p>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => deleteLead(lead.id)}
                          aria-label={`Delete ${lead.name}`}
                          className="opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3 text-stone-400 hover:text-red-600" />
                        </button>
                        <GripVertical className="h-3.5 w-3.5 text-stone-300" />
                      </div>
                    </div>
                    {lead.subject && (
                      <p className="mt-1 line-clamp-2 text-[11px] font-semibold text-stone-500">
                        {lead.subject}
                      </p>
                    )}
                    <div className="mt-2 flex flex-col gap-0.5">
                      {lead.email && (
                        <span className="inline-flex items-center gap-1.5 truncate text-[10px] font-bold text-stone-400">
                          <Mail className="h-2.5 w-2.5 shrink-0" />
                          {lead.email}
                        </span>
                      )}
                      {lead.phone && (
                        <span className="inline-flex items-center gap-1.5 truncate text-[10px] font-bold text-stone-400">
                          <Phone className="h-2.5 w-2.5 shrink-0" />
                          {lead.phone}
                        </span>
                      )}
                    </div>
                    {lead.inquiry_id && (
                      <span className="mt-2 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-600">
                        From inquiry
                      </span>
                    )}
                  </article>
                ))}

                {addingTo === stage.id ? (
                  <div className="flex flex-col gap-1.5 rounded-xl border border-stone-200 bg-white p-2.5">
                    <input
                      autoFocus
                      placeholder="Name"
                      value={newLead.name}
                      onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                      className="rounded-lg border border-stone-200 px-2 py-1.5 text-[11px] font-semibold focus:border-[#00AC4E] focus:outline-none"
                    />
                    <input
                      placeholder="Email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      className="rounded-lg border border-stone-200 px-2 py-1.5 text-[11px] font-semibold focus:border-[#00AC4E] focus:outline-none"
                    />
                    <input
                      placeholder="Phone"
                      value={newLead.phone}
                      onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                      className="rounded-lg border border-stone-200 px-2 py-1.5 text-[11px] font-semibold focus:border-[#00AC4E] focus:outline-none"
                    />
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => createLead(stage.id)}
                        className="flex-1 rounded-lg bg-[#00AC4E] py-1.5 text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddingTo(null)}
                        className="rounded-lg border border-stone-200 px-2.5 py-1.5 text-[10px] font-bold text-stone-500 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddingTo(stage.id);
                      setNewLead({ name: "", email: "", phone: "" });
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 py-2 text-[11px] font-bold text-stone-400 transition-colors hover:border-[#00AC4E] hover:text-[#00AC4E] cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Add lead
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {active && (
          <button
            onClick={addStage}
            className="flex h-fit w-56 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-dashed border-stone-300 py-3 text-xs font-bold text-stone-400 transition-colors hover:border-[#00AC4E] hover:text-[#00AC4E] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add stage
          </button>
        )}
      </div>
    </div>
  );
}
