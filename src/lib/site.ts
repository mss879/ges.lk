/**
 * The one place GES's public business details live.
 *
 * Footers, the contact page, structured data (JSON-LD), the sitemap and the AI
 * agent all read from here, so the name / address / phone Google sees stays
 * identical everywhere — mismatched NAP details are what local search punishes.
 * These match the Google Business Profile the client confirmed (Oct 2026).
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.ges.lk").replace(/\/+$/, "");

/** Absolute URL for a site path, e.g. absoluteUrl("/blog") → https://www.ges.lk/blog */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const site = {
  url: SITE_URL,
  name: "GES",
  brandName: "Green Engineering Systems",
  legalName: "Green Engineering Systems (Pvt) Ltd",
  /** Title suffix used by the root layout's title template. */
  titleSuffix: "GES Sri Lanka",
  defaultTitle: "Solar Panel Installation in Sri Lanka | GES — Green Engineering Systems",
  description:
    "Green Engineering Systems (GES) designs, installs and maintains on-grid, hybrid and off-grid solar power systems, battery storage and EV charging across Sri Lanka. 10+ years, 1,200+ installations.",
  email: "info@ges.lk",
  phone: {
    display: "076 533 2332",
    international: "+94 76 533 2332",
    tel: "+94765332332",
  },
  whatsapp: "https://wa.me/94765332332",
  address: {
    street: "No 12, Thorana Junction, Kandy Rd",
    locality: "Kelaniya",
    region: "Western Province",
    postalCode: "11600",
    country: "LK",
    countryName: "Sri Lanka",
    display: "No 12, Thorana Junction, Kandy Rd, Kelaniya 11600, Sri Lanka",
  },
  registeredOffice: "B/255, Wedamulla Lane, Waragoda, Kelaniya 11600, Sri Lanka",
  mapUrl: "https://maps.google.com/?q=Thorana+Junction,+Kandy+Road,+Kelaniya",
  /** Opening hours. `opens`/`closes` are 24h for schema.org; `display` is for people. */
  hours: [
    {
      label: "Monday – Friday",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "17:00",
      display: "8:30 AM – 5:00 PM",
    },
    {
      label: "Saturday",
      days: ["Saturday"],
      opens: "08:30",
      closes: "13:30",
      display: "8:30 AM – 1:30 PM",
    },
  ],
  closedLabel: { label: "Sunday", display: "Closed" },
  /**
   * Public social profiles. Left empty until the client supplies real URLs —
   * empty entries are hidden in the footers and left out of `sameAs`.
   */
  social: {
    facebook: "https://www.facebook.com/geslk",
    instagram: "",
    linkedin: "",
    x: "",
    youtube: "",
  },
  stats: { years: "10+", installations: "1,200+" },
  certifications: ["ISO 9001:2015 certified quality management", "Registered with the Sri Lanka Sustainable Energy Authority (SLSEA)"],
  awards: [
    "IESL Silver Award 2025 — Best Display of Engineering Services (techno Sri Lanka 2025)",
    "IESL Bronze Award 2023 — Best Display & Demonstration of Engineering Products (techno Sri Lanka 2023)",
    "IESL Bronze Award 2015 — Best Display of Imported Product (National Engineering and Technology Exhibition 2015)",
  ],
  areaServed: "Sri Lanka",
  logo: "/brand/ges-logo.png",
  creator: { name: "ARC AI", url: "https://www.arcai.agency" },
} as const;

/** Social links that actually have a URL, for footers and `sameAs`. */
export function activeSocialLinks() {
  return (Object.entries(site.social) as [keyof typeof site.social, string][])
    .filter(([, url]) => Boolean(url))
    .map(([network, url]) => ({ network, url }));
}
