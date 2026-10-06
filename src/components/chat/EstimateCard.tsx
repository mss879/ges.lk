import type { EstimateResult } from "@/lib/solar/types";

const fmt = (n: number) => n.toLocaleString("en-US");

/**
 * The calculator's result as a compact card under the assistant's reply —
 * shared by the website widget and the admin transcript/"Try it" views.
 */
export default function EstimateCard({ estimate, compact = false }: { estimate: EstimateResult; compact?: boolean }) {
  const e = estimate;
  const rows: { label: string; value: string; strong?: boolean }[] = [
    { label: "Panels", value: `${e.panels} × ${e.panelWatt} W`, strong: true },
    { label: "System size", value: `${e.systemKwp} kWp`, strong: true },
    { label: "Generation", value: `~${fmt(e.monthlyGenerationUnits)} units/month` },
    { label: "Roof needed", value: `~${fmt(e.roofNeededSqft)} sq ft` },
    { label: "Inverter", value: `${e.inverterKw} kW` },
  ];
  if (e.battery) rows.push({ label: "Battery", value: `${e.battery.capacityKwh} kWh (${e.battery.backupHours} h backup)` });
  if (e.coveragePct !== null) rows.push({ label: "Covers", value: `${e.coveragePct}% of your usage` });
  if (e.monthlySavingsLkr !== null) {
    rows.push({ label: e.monthlyUsageUnits !== null ? "Est. savings" : "Value of units", value: `~LKR ${fmt(e.monthlySavingsLkr)}/month` });
  }
  if (e.price) rows.push({ label: "Indicative price", value: `LKR ${fmt(e.price.minLkr)} – ${fmt(e.price.maxLkr)}`, strong: true });
  if (e.paybackYears) rows.push({ label: "Payback", value: `~${e.paybackYears.min}–${e.paybackYears.max} years` });

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-[#00AC4E]/25 bg-white text-stone-800 shadow-sm">
      <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#00AC4E] to-[#019544] px-3.5 py-2 text-white">
        <span className="text-[10px] font-black uppercase tracking-widest">Solar estimate</span>
        <span className="text-[10px] font-bold capitalize opacity-90">
          {e.systemType} · {e.propertyType}
        </span>
      </div>
      <dl className={`grid grid-cols-2 gap-x-3 gap-y-2 px-3.5 py-3 ${compact ? "text-[11px]" : "text-xs"}`}>
        {rows.map((r) => (
          <div key={r.label} className="min-w-0">
            <dt className="text-[9px] font-extrabold uppercase tracking-widest text-stone-400">{r.label}</dt>
            <dd className={`truncate ${r.strong ? "font-black text-[#007a37]" : "font-bold text-stone-700"}`}>{r.value}</dd>
          </div>
        ))}
      </dl>
      {e.roofLimited && (
        <p className="mx-3.5 mb-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold text-amber-800">
          Limited by roof space — the roof can&apos;t fit a system for your whole usage.
        </p>
      )}
      <p className="border-t border-stone-100 px-3.5 py-2 text-[10px] font-semibold leading-snug text-stone-400">
        Approximate. A GES site assessment confirms the exact design and price.
      </p>
    </div>
  );
}
