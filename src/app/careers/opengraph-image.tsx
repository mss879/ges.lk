import { ogImage } from "@/lib/og/template";

export const alt = "Careers at GES";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return ogImage({ eyebrow: "Careers", title: "Build a career in clean energy" });
}
