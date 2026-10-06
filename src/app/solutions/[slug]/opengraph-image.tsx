import { categoriesDataList, solutionsDataList } from "@/data/solutions";
import { DEFAULT_PHOTO, ogImage } from "@/lib/og/template";

// Pre-render a card for every solution and category at build time.
export function generateStaticParams() {
  return [...solutionsDataList.map((s) => ({ slug: s.slug })), ...categoriesDataList.map((c) => ({ slug: c.slug }))];
}

export const alt = "GES Sri Lanka — clean energy solution";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const solution = solutionsDataList.find((s) => s.slug === slug);
  if (solution) {
    // Solar systems get the rooftop photo; the others (MTG, fuel cell,
    // composting, EV) get the ribbon card — their photos are WebP, which
    // next/og can't draw.
    const isSolar = categoriesDataList.find((c) => c.slug === "solar")?.subItemSlugs.includes(solution.slug);
    return ogImage({
      eyebrow: solution.eyebrow,
      title: solution.title,
      photo: isSolar ? DEFAULT_PHOTO : null,
    });
  }

  const category = categoriesDataList.find((c) => c.slug === slug);
  return ogImage({
    eyebrow: "Solutions",
    title: category ? `${category.name} solutions` : "Clean energy solutions",
    photo: category?.slug === "solar" ? DEFAULT_PHOTO : null,
  });
}
