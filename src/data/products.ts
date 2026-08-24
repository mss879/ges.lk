/**
 * Products page content.
 *
 * The page is organised into three brand-led categories (Inverters, Solar
 * Panels, Cables) plus a set of standalone "Other Products" cards, matching
 * the structure the client specified.
 *
 * NOTE: the product photography is generic, unbranded studio imagery — it
 * represents the product type, not a specific manufacturer SKU. Swap in
 * official manufacturer photography before launch, and have the brand briefs
 * reviewed against each manufacturer's approved wording.
 */

export interface ProductCard {
  name: string;
  desc: string;
  image: string;
}

export interface BrandCategory {
  id: string;
  index: string;
  /** Product category, e.g. "Inverters" */
  category: string;
  /** Brand that category is led by, e.g. "SAJ" */
  brand: string;
  /** Flagged as the headline brand for its category */
  primary?: boolean;
  brief: string;
  products: ProductCard[];
}

export const brandCategories: BrandCategory[] = [
  {
    id: "inverters",
    index: "01",
    category: "Inverters",
    brand: "SAJ",
    primary: true,
    brief:
      "SAJ is an established global manufacturer of solar inverters and energy-storage systems, with a range spanning single-phase residential units through to high-capacity commercial three-phase inverters. SAJ is our main inverter brand — the default specification across GES installations, backed by full warranty support and remote monitoring.",
    products: [
      {
        name: "On-Grid Inverter",
        desc: "Single-phase grid-tied inverter for residential rooftops, with built-in generation monitoring.",
        image: "/products/saj-on-grid.webp",
      },
      {
        name: "Hybrid Inverter",
        desc: "Combines solar, battery and grid in a single unit, switching to backup automatically during an outage.",
        image: "/products/saj-hybrid.webp",
      },
      {
        name: "Three-Phase Inverter",
        desc: "Higher-capacity three-phase unit built for commercial and industrial arrays.",
        image: "/products/saj-three-phase.webp",
      },
    ],
  },
  {
    id: "solar-panels",
    index: "02",
    category: "Solar Panels",
    brand: "Haitai Solar",
    brief:
      "Haitai Solar manufactures crystalline-silicon photovoltaic modules for residential, commercial and utility-scale projects. We supply their monocrystalline, N-type and bifacial ranges — selected for consistent output and durable framing in Sri Lanka's high-irradiance, high-humidity conditions.",
    products: [
      {
        name: "Monocrystalline Module",
        desc: "High-efficiency mono panel for residential and commercial rooftop systems.",
        image: "/products/haitai-mono.webp",
      },
      {
        name: "N-Type Module",
        desc: "Full-black N-type cells with improved low-light and high-temperature performance.",
        image: "/products/haitai-topcon.webp",
      },
      {
        name: "Bifacial Double-Glass Module",
        desc: "Captures reflected light from the rear face for extra yield on flat roofs and ground mounts.",
        image: "/products/haitai-bifacial.webp",
      },
    ],
  },
  {
    id: "cables",
    index: "03",
    category: "Cables",
    brand: "Solen Cable",
    brief:
      "Solen supplies solar-rated DC and AC cabling engineered for permanent outdoor installation. We use their cable throughout our PV projects — array wiring, inverter connections and system earthing — for UV-stable insulation and low-loss tinned copper conductors.",
    products: [
      {
        name: "Solar DC Cable",
        desc: "UV-stable, double-insulated DC cable rated for permanent outdoor PV array wiring.",
        image: "/products/solen-dc.webp",
      },
      {
        name: "AC Power Cable",
        desc: "Low-voltage AC cabling for inverter-to-distribution-board runs.",
        image: "/products/solen-ac.webp",
      },
      {
        name: "Earthing & Bonding Cable",
        desc: "Green/yellow earth cable for array frame bonding and system earthing.",
        image: "/products/solen-earth.webp",
      },
    ],
  },
];

export const otherProducts: ProductCard[] = [
  {
    name: "Switchgear",
    desc: "Protection and power distribution — breakers, isolators and combiner assemblies.",
    image: "/products/switchgear.webp",
  },
  {
    name: "Enclosures",
    desc: "Weatherproof housings and cabinets for outdoor electrical equipment.",
    image: "/products/enclosures.webp",
  },
  {
    name: "Aluminium Accessories",
    desc: "Mounting rails, clamps and brackets for secure, corrosion-resistant panel installation.",
    image: "/products/aluminium-accessories.webp",
  },
];
