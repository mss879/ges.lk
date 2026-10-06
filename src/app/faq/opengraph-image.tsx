import { ogImage } from "@/lib/og/template";

export const alt = "Solar FAQ — GES Sri Lanka";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return ogImage({ eyebrow: "FAQ", title: "Your solar questions, answered" });
}
