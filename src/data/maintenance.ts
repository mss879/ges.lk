/**
 * Maintenance & after-sales services content.
 *
 * NOTE ON MEDIA: the client asked for real photographs and video of GES
 * technicians at actual customer sites. The images referenced here are
 * stand-ins so the layout is complete — replace them with real site photos,
 * and drop a real clip at `maintenanceVideo` to turn the main visual into a
 * player (the component already handles both cases).
 */

export type MaintenanceIcon =
  | "inspection"
  | "preventive"
  | "troubleshooting"
  | "inverter"
  | "cleaning"
  | "monitoring"
  | "upgrades";

export interface MaintenanceService {
  name: string;
  desc: string;
  icon: MaintenanceIcon;
}

export const maintenanceServices: MaintenanceService[] = [
  {
    name: "Solar System Inspection",
    desc: "Full visual and electrical check of panels, wiring, mounting and protection devices.",
    icon: "inspection",
  },
  {
    name: "Preventive Maintenance",
    desc: "Scheduled servicing that catches wear and faults before they cost you generation.",
    icon: "preventive",
  },
  {
    name: "Fault Troubleshooting",
    desc: "Rapid diagnosis and repair when output drops or the system reports an error.",
    icon: "troubleshooting",
  },
  {
    name: "Inverter Servicing",
    desc: "Cleaning, firmware checks and error resolution to keep conversion efficiency high.",
    icon: "inverter",
  },
  {
    name: "Solar Panel Cleaning",
    desc: "Safe removal of dust, salt and bird soiling that quietly reduces panel yield.",
    icon: "cleaning",
  },
  {
    name: "Performance Monitoring",
    desc: "Ongoing tracking of generation data so underperformance is spotted early.",
    icon: "monitoring",
  },
  {
    name: "System Upgrades & Repairs",
    desc: "Capacity expansion, battery additions and component replacement as needs change.",
    icon: "upgrades",
  },
];

export interface OnSiteActivity {
  label: string;
  image: string;
}

/** Actual on-site work shown alongside the service list. */
export const onSiteActivities: OnSiteActivity[] = [
  { label: "Panel cleaning", image: "/maintenance/cleaning.webp" },
  { label: "System inspection", image: "/maintenance/inspection.webp" },
  { label: "Electrical checking", image: "/maintenance/electrical.webp" },
  { label: "Inverter servicing", image: "/maintenance/inverter.webp" },
  { label: "Troubleshooting", image: "/maintenance/troubleshooting.webp" },
];

/**
 * Main visual for the maintenance section.
 *
 * Set `maintenanceVideo` to a path such as "/maintenance/service-team.mp4"
 * once a real clip of the service team is available — the section renders a
 * video player when it is set and the poster image on its own when it is not.
 */
export const maintenanceVideo: string | null = null;
export const maintenancePoster = "/maintenance/service-team.webp";
