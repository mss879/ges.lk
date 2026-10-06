import { ogImage } from "@/lib/og/template";

export const alt = "GES solar maintenance and repair";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return ogImage({ eyebrow: "Maintenance", title: "Solar & generator servicing, islandwide" });
}
