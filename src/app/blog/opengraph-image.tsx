import { ogImage } from "@/lib/og/template";

export const alt = "GES blog — clean energy and engineering insights";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return ogImage({ eyebrow: "Blog", title: "Clean energy & engineering insights" });
}
