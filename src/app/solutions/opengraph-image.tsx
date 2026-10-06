import { ogImage } from "@/lib/og/template";

export const alt = "GES solar and clean energy solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return ogImage({ eyebrow: "Solutions", title: "On-grid, hybrid, off-grid solar & battery storage" });
}
