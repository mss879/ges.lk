import { ogImage } from "@/lib/og/template";

export const alt = "GES — solar energy solutions in Sri Lanka";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return ogImage({ eyebrow: "Solar energy · Sri Lanka", title: "Solar power systems, engineered to last" });
}
