import { ogImage } from "@/lib/og/template";

export const alt = "About Green Engineering Systems (GES)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return ogImage({ eyebrow: "About us", title: "10+ years powering Sri Lanka with clean energy" });
}
