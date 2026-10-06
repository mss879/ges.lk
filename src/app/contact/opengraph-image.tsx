import { ogImage } from "@/lib/og/template";

export const alt = "Contact GES";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return ogImage({ eyebrow: "Contact", title: "Talk to a solar engineer — 076 533 2332" });
}
