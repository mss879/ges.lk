import { ogImage } from "@/lib/og/template";

export const alt = "GES privacy policy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return ogImage({ eyebrow: "Privacy", title: "How GES handles your information" });
}
