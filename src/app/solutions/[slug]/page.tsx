import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { solutionsDataList, categoriesDataList } from "@/data/solutions";
import SolutionDetailClient from "./SolutionDetailClient";
import CategoryDetailClient from "./CategoryDetailClient";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph, serviceSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  const solutionSlugs = solutionsDataList.map((sol) => ({
    slug: sol.slug,
  }));
  const categorySlugs = categoriesDataList.map((cat) => ({
    slug: cat.slug,
  }));
  return [...solutionSlugs, ...categorySlugs];
}

// Only the slugs above exist; anything else is a real 404.
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const solution = solutionsDataList.find((s) => s.slug === slug);
  if (solution) {
    return pageMetadata({
      title: `${solution.title} in Sri Lanka`,
      description: solution.desc,
      path: `/solutions/${solution.slug}`,
    });
  }

  const category = categoriesDataList.find((c) => c.slug === slug);
  if (category) {
    return pageMetadata({
      title: `${category.name} Solutions in Sri Lanka`,
      description: category.desc,
      path: `/solutions/${category.slug}`,
    });
  }

  return {};
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;

  const solution = solutionsDataList.find((s) => s.slug === slug);
  if (solution) {
    const category = categoriesDataList.find((c) => c.subItemSlugs.includes(solution.slug));
    return (
      <>
        <JsonLd
          data={jsonLdGraph(
            breadcrumbSchema([
              { name: "Solutions", path: "/solutions" },
              ...(category ? [{ name: category.name, path: `/solutions/${category.slug}` }] : []),
              { name: solution.title, path: `/solutions/${solution.slug}` },
            ]),
            serviceSchema({
              name: solution.title,
              description: solution.desc,
              path: `/solutions/${solution.slug}`,
              image: solution.image ?? null,
              category: category?.name,
            }),
          )}
        />
        <SolutionDetailClient solution={solution} />
      </>
    );
  }

  const category = categoriesDataList.find((c) => c.slug === slug);
  if (category) {
    return (
      <>
        <JsonLd
          data={jsonLdGraph(
            breadcrumbSchema([
              { name: "Solutions", path: "/solutions" },
              { name: category.name, path: `/solutions/${category.slug}` },
            ]),
          )}
        />
        <CategoryDetailClient category={category} />
      </>
    );
  }

  notFound();
}
