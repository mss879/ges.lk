import { ogImage } from "@/lib/og/template";

export const alt = "GES solar installation projects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return ogImage({ eyebrow: "Projects", title: "1,200+ solar installations across Sri Lanka" });
}
