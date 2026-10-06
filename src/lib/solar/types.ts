export type SystemType = "on-grid" | "hybrid" | "off-grid";
export type PropertyType = "home" | "business";
export type AreaUnit = "sqft" | "sqm";

/**
 * One block of an electricity tariff. `upTo` is the cumulative unit (kWh)
 * where the block ends; null means "and above". `fixed` is the monthly fixed
 * charge that applies when consumption ends in this block.
 */
export interface TariffBlock {
  upTo: number | null;
  rate: number;
  fixed?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

/** Everything the client controls from /admin/ai-agent/calculator. */
export interface CalculatorSettings {
  panelWatt: number;
  panelLengthM: number;
  panelWidthM: number;
  /** Share of a stated roof area that can actually carry panels (setbacks, walkways, shade). */
  usableRoofRatio: number;
  /** Units (kWh) one kWp produces per month, on average. */
  monthlyYieldPerKwp: number;
  /** Optional domestic block tariff (households above 60 units/month). Empty → average tariff. */
  tariffBlocks: TariffBlock[];
  avgTariffDomestic: number;
  avgTariffCommercial: number;
  /** LKR paid per exported unit. Null → exports aren't valued or quoted. */
  exportRate: number | null;
  dcAcRatio: number;
  inverterSizesKw: number[];
  batteryUnitKwh: number;
  batteryDod: number;
  co2KgPerKwh: number;
  showPrices: boolean;
  /** LKR per kWp by system type, plus LKR per kWh of battery. */
  pricing: {
    onGrid?: PriceRange;
    hybrid?: PriceRange;
    offGrid?: PriceRange;
    batteryPerKwh?: PriceRange;
  };
}

export interface EstimateInput {
  roofArea?: number | null;
  areaUnit?: AreaUnit;
  monthlyUnits?: number | null;
  monthlyBill?: number | null;
  propertyType?: PropertyType;
  systemType?: SystemType;
  backupHours?: number | null;
  essentialLoadKw?: number | null;
}

export interface EstimateResult {
  ok: true;
  basis: "roof" | "usage" | "roof+usage";
  systemType: SystemType;
  propertyType: PropertyType;
  panels: number;
  panelWatt: number;
  systemKwp: number;
  /** Roof the system needs, including spacing. */
  roofNeededSqm: number;
  roofNeededSqft: number;
  /** How many panels the stated roof could hold, if a roof size was given. */
  maxPanelsOnRoof: number | null;
  monthlyUsageUnits: number | null;
  usageFromBill: boolean;
  monthlyGenerationUnits: number;
  annualGenerationUnits: number;
  /** Share of monthly usage the system covers, if usage is known. */
  coveragePct: number | null;
  /** True when the roof can't fit a system big enough for the whole bill. */
  roofLimited: boolean;
  inverterKw: number;
  battery: { modules: number; capacityKwh: number; backupHours: number; loadKw: number } | null;
  billBeforeLkr: number | null;
  billAfterLkr: number | null;
  monthlySavingsLkr: number | null;
  annualSavingsLkr: number | null;
  exportUnits: number | null;
  exportIncomeLkr: number | null;
  co2TonnesPerYear: number;
  price: { minLkr: number; maxLkr: number } | null;
  paybackYears: { min: number; max: number } | null;
  assumptions: string[];
  disclaimer: string;
}

export type EstimateOutcome = EstimateResult | { ok: false; error: string };
