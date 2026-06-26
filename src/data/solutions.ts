export interface SolutionItem {
  slug: string;
  title: string;
  tag: string;
  eyebrow: string;
  desc: string;
  features: string[];
  diagram?: "on-grid" | "off-grid" | "hybrid" | "bess";
  iconName: "solar" | "power" | "hydrogen" | "waste" | "ev" | "battery";
}

export const solutionsDataList: SolutionItem[] = [
  {
    slug: "on-grid",
    title: "On-Grid Solar",
    tag: "01 / Solar",
    eyebrow: "Solar",
    desc: "A solar power system connected to the utility grid — allowing you to use solar energy during the day and draw electricity from the grid when needed.",
    features: ["Use solar power by day", "Draw from grid at night", "Net-metering & export ready", "Lowest upfront investment"],
    diagram: "on-grid",
    iconName: "solar",
  },
  {
    slug: "off-grid",
    title: "Off-Grid Solar",
    tag: "02 / Solar",
    eyebrow: "Solar",
    desc: "A standalone solar system with battery storage that operates independently of the utility grid — providing power in remote or grid-unavailable locations.",
    features: ["Battery storage included", "Complete grid independence", "Ideal for remote sites", "Uninterrupted day & night supply"],
    diagram: "off-grid",
    iconName: "solar",
  },
  {
    slug: "hybrid",
    title: "Hybrid Solar",
    tag: "03 / Solar",
    eyebrow: "Solar",
    desc: "A smart solar solution that combines grid connectivity with battery storage — ensuring reliable power supply and enhanced energy independence.",
    features: ["Grid + battery combined", "Automatic backup on outage", "Maximum energy independence", "Smart load management"],
    diagram: "hybrid",
    iconName: "solar",
  },
  {
    slug: "bess",
    title: "BESS Storage",
    tag: "04 / Solar",
    eyebrow: "Solar",
    desc: "An advanced energy storage solution that stores excess electricity for later use — improving energy efficiency, backup power availability and grid stability.",
    features: ["Store excess electricity", "Backup power on demand", "Improved grid stability", "Higher self-consumption"],
    diagram: "bess",
    iconName: "battery",
  },
  {
    slug: "mtg",
    title: "MTG — Micro Turbine Generator",
    tag: "05 / Power",
    eyebrow: "Power Generation",
    desc: "A compact and efficient power generation system that converts fuel into electricity with low emissions and high reliability. Micro Turbine Generators are ideal for commercial, industrial and distributed energy applications, providing continuous and dependable power.",
    features: ["Low emissions", "Continuous & dependable", "Commercial & industrial scale", "High reliability operation"],
    iconName: "power",
  },
  {
    slug: "fuel-cell",
    title: "Fuel Cell (SFC)",
    tag: "06 / Hydrogen",
    eyebrow: "Hydrogen Energy",
    desc: "A clean and efficient energy solution that converts hydrogen into electricity with minimal emissions. SFC fuel cells provide reliable, quiet and sustainable power for a wide range of residential, commercial and industrial applications.",
    features: ["Minimal emissions", "Quiet operation", "Residential to industrial", "Quiet, sustainable power"],
    iconName: "hydrogen",
  },
  {
    slug: "composting",
    title: "Composted Machine",
    tag: "07 / Waste",
    eyebrow: "Waste Management",
    desc: "An eco-friendly waste management solution that converts organic waste into nutrient-rich compost quickly and efficiently. Composting machines help reduce waste, minimize environmental impact and support sustainable waste recycling practices.",
    features: ["Organic waste to compost", "Reduces landfill waste", "Sustainable recycling", "Eco-friendly conversion"],
    iconName: "waste",
  },
  {
    slug: "ev-charging",
    title: "Moreday EV Charger",
    tag: "08 / EV",
    eyebrow: "EV Charging",
    desc: "Fast, safe and intelligent EV charging solutions for homes, businesses and public charging networks.",
    features: ["Fast charging", "Safe & intelligent", "Home, business & public", "Premium Moreday brand components"],
    iconName: "ev",
  },
];

export interface SolutionCategory {
  slug: string;
  name: string;
  id: string;
  eyebrow: string;
  desc: string;
  subItemSlugs: string[];
  iconName: "solar" | "power" | "hydrogen" | "waste" | "ev" | "battery";
}

export const categoriesDataList: SolutionCategory[] = [
  {
    slug: "solar",
    name: "Solar Energy",
    id: "solar",
    eyebrow: "Category / Solar",
    desc: "Harness clean, abundant energy from the sun with our cutting-edge solar power systems designed for residential, commercial, and industrial scaling.",
    subItemSlugs: ["on-grid", "off-grid", "hybrid", "bess"],
    iconName: "solar"
  },
  {
    slug: "power",
    name: "Power Generation",
    id: "power",
    eyebrow: "Category / Power",
    desc: "Highly efficient, continuous distributed power generation technologies designed to reduce energy costs and emissions.",
    subItemSlugs: ["mtg"],
    iconName: "power"
  },
  {
    slug: "hydrogen",
    name: "Hydrogen Energy",
    id: "hydrogen",
    eyebrow: "Category / Hydrogen",
    desc: "Clean and sustainable hydrogen fuel cell technologies delivering silent, emission-free power for industrial and commercial operations.",
    subItemSlugs: ["fuel-cell"],
    iconName: "hydrogen"
  },
  {
    slug: "waste",
    name: "Waste Management",
    id: "waste",
    eyebrow: "Category / Waste",
    desc: "Eco-friendly organic waste conversion systems promoting circular economy practices and minimizing landfill impacts.",
    subItemSlugs: ["composting"],
    iconName: "waste"
  },
  {
    slug: "ev",
    name: "EV Charging",
    id: "ev",
    eyebrow: "Category / EV",
    desc: "Fast, intelligent, and highly reliable electric vehicle charging infrastructure for homes, businesses, and public networks.",
    subItemSlugs: ["ev-charging"],
    iconName: "ev"
  }
];
