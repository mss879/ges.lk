import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { solutionsDataList, categoriesDataList } from "@/data/solutions";
import SolutionDetailClient from "./SolutionDetailClient";
import CategoryDetailClient from "./CategoryDetailClient";

export function generateStaticParams() {
  const solutionSlugs = solutionsDataList.map((sol) => ({
    slug: sol.slug,
  }));
  const categorySlugs = categoriesDataList.map((cat) => ({
    slug: cat.slug,
  }));
  return [...solutionSlugs, ...categorySlugs];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const solution = solutionsDataList.find((s) => s.slug === slug);
  if (solution) {
    return {
      title: `${solution.title} | GES Sri Lanka`,
      description: solution.desc,
    };
  }

  const category = categoriesDataList.find((c) => c.slug === slug);
  if (category) {
    return {
      title: `${category.name} Solutions | GES Sri Lanka`,
      description: category.desc,
    };
  }

  return {};
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;
  
  const solution = solutionsDataList.find((s) => s.slug === slug);
  if (solution) {
    return <SolutionDetailClient solution={solution} />;
  }

  const category = categoriesDataList.find((c) => c.slug === slug);
  if (category) {
    return <CategoryDetailClient category={category} />;
  }

  notFound();
}
