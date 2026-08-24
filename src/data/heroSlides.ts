/**
 * Homepage hero slider content.
 *
 * Deliberately kept as the single source of truth for the hero slides so the
 * storage layer can move to Supabase later without touching any UI code:
 * swap the body of `getHeroSlides()` for a query against a `hero_slides`
 * table (and make it async) while keeping the `HeroSlide` shape identical.
 * The admin edit / delete / replace screen should write to that same table.
 */

export type HeroSlide = {
  /** Stable key — becomes the Supabase row id when the backend lands. */
  id: string;
  /** Public path today; becomes a Supabase Storage public URL later. */
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "saj-wall",
    src: "/hero-slider1_saj_wall.webp",
    alt: "Wall-mounted hybrid solar inverter beside a matching lithium battery storage unit in a modern utility room.",
    eyebrow: "Home Energy Storage",
    title: "SAJ for Wall",
    description:
      "Compact wall-mounted hybrid inverters and battery storage that keep your home powered around the clock.",
    href: "/products",
  },
  {
    id: "commercial-solar",
    src: "/hero-slider2_commercial_solar.webp",
    alt: "Aerial view of a large commercial rooftop solar array on an industrial warehouse surrounded by palm trees.",
    eyebrow: "Commercial & Industrial",
    title: "Commercial Solar",
    description:
      "Utility-grade rooftop arrays engineered, installed and maintained for Sri Lankan industry.",
    href: "/solutions",
  },
  {
    id: "ev-charging",
    src: "/hero-slider3_ev_charging.webp",
    alt: "Modern solar-canopy electric vehicle charging station with a white car plugged in and charging.",
    eyebrow: "Clean Mobility",
    title: "EV Charging Stations",
    description:
      "Solar-powered charging infrastructure for homes, fleets and commercial forecourts.",
    href: "/solutions",
  },
];

export function getHeroSlides(): HeroSlide[] {
  return heroSlides;
}
