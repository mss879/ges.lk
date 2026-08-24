/**
 * Editable image slots for the Homepage and About pages.
 *
 * This is the single source of truth: the admin CMS renders these slots, the
 * pages resolve them, and supabase/migrations/0009_seed_site_images.sql seeds
 * the same keys with the `defaultUrl` values below. Keep the keys stable —
 * they are the primary lookup in the site_images table.
 */

export type SitePage = "homepage" | "about";

export interface SiteImageSlot {
  /** Stable identifier, unique within its page. */
  key: string;
  page: SitePage;
  /** Shown in the admin. */
  label: string;
  /** Where it appears, for context in the admin. */
  section: string;
  /** Shipped image used when nothing has been uploaded yet. */
  defaultUrl: string;
  /** Roughly how the slot renders, so the admin can preview at the right shape. */
  aspect: "wide" | "portrait" | "banner";
  position: number;
}

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  // ---------------------------------------------------------------- homepage
  {
    key: "hero_slide_1",
    page: "homepage",
    label: "Hero slide 1 — SAJ for Wall",
    section: "Hero slider",
    defaultUrl: "/hero-slider1_saj_wall.webp",
    aspect: "wide",
    position: 0,
  },
  {
    key: "hero_slide_2",
    page: "homepage",
    label: "Hero slide 2 — Commercial Solar",
    section: "Hero slider",
    defaultUrl: "/hero-slider2_commercial_solar.webp",
    aspect: "wide",
    position: 1,
  },
  {
    key: "hero_slide_3",
    page: "homepage",
    label: "Hero slide 3 — EV Charging",
    section: "Hero slider",
    defaultUrl: "/hero-slider3_ev_charging.webp",
    aspect: "wide",
    position: 2,
  },
  {
    key: "home_collage_1",
    page: "homepage",
    label: "Collage — Engineering office",
    section: "About Us section",
    defaultUrl: "/about_us_office_v6.webp",
    aspect: "portrait",
    position: 3,
  },
  {
    key: "home_collage_2",
    page: "homepage",
    label: "Collage — Engineers on site",
    section: "About Us section",
    defaultUrl: "/about_us_engineers_v6.webp",
    aspect: "portrait",
    position: 4,
  },
  {
    key: "home_collage_3",
    page: "homepage",
    label: "Collage — Battery & inverter room",
    section: "About Us section",
    defaultUrl: "/about_us_tech_v7.webp",
    aspect: "portrait",
    position: 5,
  },
  {
    key: "home_collage_4",
    page: "homepage",
    label: "Collage — Sustainable building",
    section: "About Us section",
    defaultUrl: "/about_us_building_v7.webp",
    aspect: "portrait",
    position: 6,
  },

  // ------------------------------------------------------------------- about
  {
    key: "about_overview_1",
    page: "about",
    label: "Collage — Colombo office",
    section: "Company overview",
    defaultUrl: "/about_office_2026.webp",
    aspect: "portrait",
    position: 0,
  },
  {
    key: "about_overview_2",
    page: "about",
    label: "Collage — Technicians on a rooftop",
    section: "Company overview",
    defaultUrl: "/about_engineers_2026.webp",
    aspect: "portrait",
    position: 1,
  },
  {
    key: "about_overview_3",
    page: "about",
    label: "Collage — Battery storage room",
    section: "Company overview",
    defaultUrl: "/about_tech_2026.webp",
    aspect: "portrait",
    position: 2,
  },
  {
    key: "about_overview_4",
    page: "about",
    label: "Collage — Green facade building",
    section: "Company overview",
    defaultUrl: "/about_building_2026.webp",
    aspect: "portrait",
    position: 3,
  },
  {
    key: "about_history",
    page: "about",
    label: "Our History — team portrait",
    section: "Our history",
    defaultUrl: "/about_history_lk_2026.webp",
    aspect: "portrait",
    position: 4,
  },
  {
    key: "about_vision",
    page: "about",
    label: "Our Vision — tea terraces banner",
    section: "Mission & vision",
    defaultUrl: "/about_terraces_2026.webp",
    aspect: "banner",
    position: 5,
  },
  {
    key: "about_sustainability",
    page: "about",
    label: "Sustainability — engineer at dusk",
    section: "Sustainability commitment",
    defaultUrl: "/about_values_2026.webp",
    aspect: "portrait",
    position: 6,
  },
];

export function slotsForPage(page: SitePage): SiteImageSlot[] {
  return SITE_IMAGE_SLOTS.filter((s) => s.page === page).sort((a, b) => a.position - b.position);
}

/** key -> defaultUrl, used as the fallback when the backend is unavailable. */
export function defaultImageMap(page: SitePage): Record<string, string> {
  return Object.fromEntries(slotsForPage(page).map((s) => [s.key, s.defaultUrl]));
}

export type SiteImageMap = Record<string, string>;
