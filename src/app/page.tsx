import HomeClient from "./HomeClient";
import { getSiteImages } from "@/lib/siteImages";

export default async function HomePage() {
  const images = await getSiteImages("homepage");
  return <HomeClient images={images} />;
}
