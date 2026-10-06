import type {
  CalculatorSettings,
  EstimateInput,
  EstimateOutcome,
  PriceRange,
  PropertyType,
  SystemType,
  TariffBlock,
} from "./types";

/**
 * The solar sizing calculator — a pure function, shared by the AI agent's
 * `estimateSolarSystem` tool and the admin "Try it" panel, so the numbers a
 * customer is told are exactly the numbers the client can check.
 *
 * Works from a roof area (sq ft or m²), monthly units, a monthly bill, or any
 * combination:
 *   • Roof only   → the largest system the roof can carry.
 *   • Usage only  → the system that covers the monthly units.
 *   • Both        → the usage-sized system, capped by what fits on the roof.
 * Off-grid systems are oversized 25% to cover battery losses and cloudy days.
 */

const SQFT_PER_SQM = 10.7639;
const OFF_GRID_OVERSIZE = 1.25;

export const ESTIMATE_DISCLAIMER =
  "This is an estimate for guidance only. The final design, output and price depend on roof orientation, shading, structure and the current CEB/LECO tariffs — a GES site assessment gives an exact design and quote.";

const round = (n: number, places = 0) => {
  const f = 10 ** places;
  return Math.round(n * f) / f;
};
const roundTo = (n: number, step: number) => Math.round(n / step) * step;
const lkr = (n: number) => `LKR ${Math.round(n).toLocaleString("en-US")}`;

/** Monthly bill for `units` under a block tariff (or the average tariff). */
export function billForUnits(units: number, settings: CalculatorSettings, property: PropertyType): number {
  if (units <= 0) return 0;
  const blocks = blocksFor(settings, property);
  if (!blocks) return units * avgTariff(settings, property);

  let cost = 0;
  let previous = 0;
  let fixed = 0;
  for (const block of blocks) {
    const ceiling = block.upTo ?? Number.POSITIVE_INFINITY;
    const inBlock = Math.max(0, Math.min(units, ceiling) - previous);
    cost += inBlock * block.rate;
    if (units > previous) fixed = block.fixed ?? 0;
    previous = ceiling;
    if (units <= ceiling) break;
  }
  return cost + fixed;
}

/** Inverse of billForUnits: the units that produce a given bill. */
export function unitsForBill(bill: number, settings: CalculatorSettings, property: PropertyType): number {
  if (bill <= 0) return 0;
  if (!blocksFor(settings, property)) return bill / avgTariff(settings, property);
  let lo = 0;
  let hi = 200_000;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (billForUnits(mid, settings, property) < bill) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function blocksFor(settings: CalculatorSettings, property: PropertyType): TariffBlock[] | null {
  if (property !== "home") return null;
  const blocks = (settings.tariffBlocks ?? []).filter((b) => Number.isFinite(b.rate) && b.rate >= 0);
  if (blocks.length === 0) return null;
  return [...blocks].sort((a, b) => (a.upTo ?? Infinity) - (b.upTo ?? Infinity));
}

function avgTariff(settings: CalculatorSettings, property: PropertyType) {
  return property === "business" ? settings.avgTariffCommercial : settings.avgTariffDomestic;
}

function priceFor(settings: CalculatorSettings, system: SystemType): PriceRange | undefined {
  const p = settings.pricing ?? {};
  return system === "hybrid" ? p.hybrid : system === "off-grid" ? p.offGrid : p.onGrid;
}

export function estimateSolarSystem(input: EstimateInput, settings: CalculatorSettings): EstimateOutcome {
  const property: PropertyType = input.propertyType === "business" ? "business" : "home";
  const system: SystemType = input.systemType ?? "on-grid";

  const roofArea = Number(input.roofArea) > 0 ? Number(input.roofArea) : null;
  const units = Number(input.monthlyUnits) > 0 ? Number(input.monthlyUnits) : null;
  const bill = Number(input.monthlyBill) > 0 ? Number(input.monthlyBill) : null;

  if (!roofArea && !units && !bill) {
    return { ok: false, error: "Need a roof area, monthly units (kWh) or a monthly bill to estimate." };
  }
  if ((roofArea ?? 0) > 2_000_000 || (units ?? 0) > 2_000_000 || (bill ?? 0) > 500_000_000) {
    return { ok: false, error: "Those numbers are too large for a rooftop estimate — the team will size a project that big individually." };
  }

  const panelArea = settings.panelLengthM * settings.panelWidthM;
  const panelKw = settings.panelWatt / 1000;

  // Roof capacity
  const roofSqm = roofArea ? (input.areaUnit === "sqm" ? roofArea : roofArea / SQFT_PER_SQM) : null;
  const maxPanelsOnRoof = roofSqm !== null ? Math.floor((roofSqm * settings.usableRoofRatio) / panelArea) : null;
  if (maxPanelsOnRoof !== null && maxPanelsOnRoof < 2 && !units && !bill) {
    return { ok: false, error: "That roof area is too small for a practical system (fewer than two panels fit)." };
  }

  // Usage
  const usageFromBill = !units && Boolean(bill);
  const monthlyUsage = units ?? (bill ? unitsForBill(bill, settings, property) : null);

  // Panels: usage-sized, capped by the roof
  const oversize = system === "off-grid" ? OFF_GRID_OVERSIZE : 1;
  const panelsForUsage =
    monthlyUsage !== null ? Math.max(1, Math.ceil(((monthlyUsage / settings.monthlyYieldPerKwp) * oversize) / panelKw)) : null;

  let panels: number;
  let basis: "roof" | "usage" | "roof+usage";
  if (panelsForUsage !== null && maxPanelsOnRoof !== null) {
    panels = Math.max(1, Math.min(panelsForUsage, maxPanelsOnRoof));
    basis = "roof+usage";
  } else if (panelsForUsage !== null) {
    panels = panelsForUsage;
    basis = "usage";
  } else {
    panels = maxPanelsOnRoof!;
    basis = "roof";
  }
  const roofLimited = panelsForUsage !== null && maxPanelsOnRoof !== null && maxPanelsOnRoof < panelsForUsage;

  const systemKwp = round(panels * panelKw, 2);
  const monthlyGeneration = systemKwp * settings.monthlyYieldPerKwp;
  const annualGeneration = monthlyGeneration * 12;
  const roofNeededSqm = (panels * panelArea) / settings.usableRoofRatio;

  // Inverter: next standard size at or above kWp ÷ DC/AC ratio
  const target = systemKwp / settings.dcAcRatio;
  const sizes = [...(settings.inverterSizesKw ?? [])].filter((s) => s > 0).sort((a, b) => a - b);
  const inverterKw = sizes.find((s) => s >= target - 0.05) ?? Math.ceil(target);

  // Battery for hybrid / off-grid
  let battery: { modules: number; capacityKwh: number; backupHours: number; loadKw: number } | null = null;
  if (system !== "on-grid") {
    const loadKw = Number(input.essentialLoadKw) > 0 ? Number(input.essentialLoadKw) : property === "business" ? 3 : 1;
    const hours = Number(input.backupHours) > 0 ? Number(input.backupHours) : system === "off-grid" ? 12 : 4;
    const neededKwh = (loadKw * hours) / settings.batteryDod;
    const modules = Math.max(1, Math.ceil(neededKwh / settings.batteryUnitKwh));
    battery = { modules, capacityKwh: round(modules * settings.batteryUnitKwh, 2), backupHours: hours, loadKw };
  }

  // Money
  let billBefore: number | null = null;
  let billAfter: number | null = null;
  let exportUnits: number | null = null;
  let exportIncome: number | null = null;
  let monthlySavings: number | null;
  if (monthlyUsage !== null) {
    billBefore = bill ?? billForUnits(monthlyUsage, settings, property);
    const remaining = Math.max(0, monthlyUsage - monthlyGeneration);
    billAfter = system === "off-grid" ? 0 : billForUnits(remaining, settings, property);
    exportUnits = system === "off-grid" ? 0 : Math.max(0, monthlyGeneration - monthlyUsage);
    exportIncome = settings.exportRate !== null && exportUnits > 0 ? exportUnits * settings.exportRate : null;
    monthlySavings = Math.max(0, billBefore - billAfter) + (exportIncome ?? 0);
  } else {
    // Roof-only: the value of the units at the average tariff.
    monthlySavings = monthlyGeneration * avgTariff(settings, property);
  }
  const annualSavings = monthlySavings * 12;

  // Price (only when the client has switched prices on and set a range)
  let price: { minLkr: number; maxLkr: number } | null = null;
  let payback: { min: number; max: number } | null = null;
  const range = priceFor(settings, system);
  if (settings.showPrices && range && range.min > 0 && range.max >= range.min) {
    let min = systemKwp * range.min;
    let max = systemKwp * range.max;
    const bat = settings.pricing?.batteryPerKwh;
    if (battery && bat && bat.min > 0) {
      min += battery.capacityKwh * bat.min;
      max += battery.capacityKwh * Math.max(bat.min, bat.max);
    }
    price = { minLkr: roundTo(min, 10_000), maxLkr: roundTo(max, 10_000) };
    if (annualSavings > 0) {
      payback = { min: round(price.minLkr / annualSavings, 1), max: round(price.maxLkr / annualSavings, 1) };
    }
  }

  const assumptions = [
    `${settings.panelWatt} W panels of ${settings.panelLengthM} × ${settings.panelWidthM} m`,
    `${Math.round(settings.usableRoofRatio * 100)}% of the roof usable for panels (setbacks, walkways, shade)`,
    `About ${settings.monthlyYieldPerKwp} units per kWp per month (Sri Lankan average)`,
    usageFromBill
      ? `Monthly usage worked out from the bill (${lkr(bill!)}) at ${
          blocksFor(settings, property) ? "the domestic block tariff" : `about LKR ${avgTariff(settings, property)} per unit`
        }`
      : monthlyUsage !== null
        ? `Bill savings at ${blocksFor(settings, property) ? "the domestic block tariff" : `about LKR ${avgTariff(settings, property)} per unit`}`
        : `Savings valued at about LKR ${avgTariff(settings, property)} per unit`,
    ...(system === "off-grid" ? ["Off-grid systems sized 25% above usage to cover battery losses and cloudy days"] : []),
    ...(battery ? [`Battery sized for ${battery.loadKw} kW of essential load for ${battery.backupHours} hours at ${Math.round(settings.batteryDod * 100)}% depth of discharge`] : []),
    ...(settings.exportRate !== null ? [`Exported units valued at LKR ${settings.exportRate} each`] : []),
  ];

  return {
    ok: true,
    basis,
    systemType: system,
    propertyType: property,
    panels,
    panelWatt: settings.panelWatt,
    systemKwp,
    roofNeededSqm: round(roofNeededSqm, 1),
    roofNeededSqft: Math.round(roofNeededSqm * SQFT_PER_SQM),
    maxPanelsOnRoof,
    monthlyUsageUnits: monthlyUsage !== null ? Math.round(monthlyUsage) : null,
    usageFromBill,
    monthlyGenerationUnits: Math.round(monthlyGeneration),
    annualGenerationUnits: Math.round(annualGeneration),
    coveragePct: monthlyUsage ? Math.min(100, Math.round((monthlyGeneration / monthlyUsage) * 100)) : null,
    roofLimited,
    inverterKw,
    battery,
    billBeforeLkr: billBefore !== null ? Math.round(billBefore) : null,
    billAfterLkr: billAfter !== null ? Math.round(billAfter) : null,
    monthlySavingsLkr: monthlySavings !== null ? roundTo(monthlySavings, 100) : null,
    annualSavingsLkr: roundTo(annualSavings, 1000),
    exportUnits: exportUnits !== null ? Math.round(exportUnits) : null,
    exportIncomeLkr: exportIncome !== null ? Math.round(exportIncome) : null,
    co2TonnesPerYear: round((annualGeneration * settings.co2KgPerKwh) / 1000, 1),
    price,
    paybackYears: payback,
    assumptions,
    disclaimer: ESTIMATE_DISCLAIMER,
  };
}
