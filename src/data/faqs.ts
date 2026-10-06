/**
 * The FAQ — one source for the /faq page, its FAQPage structured data and the
 * AI agent's knowledge, so all three always say the same thing.
 */

export type FaqCategory = "General" | "Technical" | "Financial" | "Grid Connection";

export interface Faq {
  question: string;
  answer: string;
  category: FaqCategory;
}

export const FAQ_CATEGORIES: ("All" | FaqCategory)[] = ["All", "General", "Technical", "Financial", "Grid Connection"];

export const faqs: Faq[] = [
  {
    question: "How does a solar system work?",
    answer: "Solar panels capture sunlight and convert it into DC electricity, which an inverter converts into AC electricity to power your home or business. Excess energy can be stored in batteries or fed back to the grid depending on your system configuration.",
    category: "General",
  },
  {
    question: "What type of system is right for me?",
    answer: "The ideal system depends on your energy consumption patterns, roof space, and local grid stability. Our engineers conduct a feasibility study and recommend either an On-Grid system (best for cost offsets), Off-Grid (complete independence), or a Hybrid system (best for backup power and savings).",
    category: "General",
  },
  {
    question: "What is the warranty period?",
    answer: "We offer premium warranty coverage: a 25-year linear performance warranty on solar PV modules, a 5-to-10-year warranty on smart grid-tied or hybrid inverters, and up to a 10-year warranty on Lithium LFP battery cells. Specific terms vary by product to ensure long-term peace of mind.",
    category: "General",
  },
  {
    question: "How much can I save on electricity?",
    answer: "Savings vary based on your average consumption tariff, roof orientation, and system capacity. With recent tariff adjustments in Sri Lanka, most residential and commercial owners see a reduction of 70% to 100% in their utility bills, turning electricity from an ongoing operational cost into a self-funding asset.",
    category: "Financial",
  },
  {
    question: "What happens on cloudy days?",
    answer: "Solar panels do not require direct hot sunlight and continue to generate electricity using ambient daylight even on overcast or rainy days, though generation efficiency is reduced. In a hybrid or grid-connected system, battery storage or utility power automatically bridges any deficit seamlessly.",
    category: "Technical",
  },
  {
    question: "How do I maintain my solar system?",
    answer: "Solar PV installations require minimal upkeep. We recommend dry cleaning or soft washing with low-TDS water every 3 to 6 months to prevent monsoonal dust or soot buildup from reducing yields. Our operations and maintenance (O&M) packages include regular thermal imaging and string diagnostics.",
    category: "Technical",
  },
  {
    question: "What grid-connection schemes are available in Sri Lanka?",
    answer: "Under the Ceylon Electricity Board (CEB) and LECO 'Soorya Bala Sangramaya' program, three options are available: Net Metering (offset imports; surplus exports carry forward as energy credits), Net Accounting (surplus exports are purchased by the utility at a fixed tariff), and Net Plus (100% of solar generation is exported directly to the grid).",
    category: "Grid Connection",
  },
  {
    question: "Can solar power my home or office during a blackout?",
    answer: "Yes, provided you install a Hybrid or Off-Grid solar system configured with battery storage. Standard On-Grid systems are legally required to shut down during grid outages (anti-islanding protection) to prevent feeding live currents back into dead utility lines, ensuring grid repair technicians are safe.",
    category: "Technical",
  },
  {
    question: "How long does the installation and CEB grid clearance take?",
    answer: "A standard residential installation is completed by our technicians in 2 to 3 days on-site. The grid interconnection approvals—including feasibility study, power purchase agreements (PPA), and bi-directional smart meter installation by the CEB/LECO—typically take between 3 to 6 weeks. Our team manages this entire workflow for you.",
    category: "General",
  },
  {
    question: "What is the typical payback period for a solar installation in Sri Lanka?",
    answer: "With current commercial and domestic utility rates, typical simple payback periods are between 2.5 to 4 years. Given a performance life exceeding 25 years, a solar system represents an extremely secure financial investment, offering an average Internal Rate of Return (IRR) of 20% to 25%.",
    category: "Financial",
  },
];
