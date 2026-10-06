import { ogImage } from "@/lib/og/template";

export const alt = "GES solar products";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return ogImage({ eyebrow: "Products", title: "Haitai panels, SAJ inverters & Solen solar cables" });
}
