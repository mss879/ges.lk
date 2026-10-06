import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, CheckCircle } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import JsonLd from "@/components/seo/JsonLd";
import ReadingProgress from "./ReadingProgress";
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from "@/lib/blog/queries";
import { formatPostDate, formatReadTime, initials } from "@/lib/blog/format";
import { renderArticle } from "@/lib/blog/render";
import { autoExcerpt, wordCount } from "@/lib/blog/text";
import { OG_BASE } from "@/lib/seo/metadata";
import { blogPostingSchema, breadcrumbSchema, jsonLdGraph } from "@/lib/seo/schema";

// Cached for an hour and refreshed immediately when an admin saves the post.
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getPostBySlug(slug);
  if (!post) return { title: "Article not found", robots: { index: false, follow: true } };

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || autoExcerpt(post.content, 160);
  const url = `/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    authors: [{ name: post.author_name }],
    openGraph: {
      ...OG_BASE,
      type: "article",
      url,
      title,
      description,
      ...(post.published_at ? { publishedTime: post.published_at } : {}),
      modifiedTime: post.updated_at,
      ...(post.category ? { section: post.category } : {}),
      authors: [post.author_name],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const { post, movedTo } = await getPostBySlug(slug);

  if (!post) {
    if (movedTo) permanentRedirect(`/blog/${movedTo}`);
    notFound();
  }

  const related = await getRelatedPosts(post);
  const description = post.seo_description || post.excerpt || autoExcerpt(post.content, 160);

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-clip">
      <JsonLd
        data={jsonLdGraph(
          breadcrumbSchema([
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          blogPostingSchema({
            slug: post.slug,
            title: post.title,
            description,
            image: post.cover_url,
            publishedAt: post.published_at,
            updatedAt: post.updated_at,
            authorName: post.author_name,
            category: post.category,
            wordCount: wordCount(post.content),
          }),
        )}
      />

      <ReadingProgress />
      <SiteNav active="blog" />

      {/* Hero Banner Header */}
      <section className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] shrink-0 bg-stone-900 overflow-hidden">
        {post.cover_url && (
          <Image
            src={post.cover_url}
            alt={post.cover_alt || post.title}
            fill
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            className="object-cover opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 max-w-[840px] mx-auto px-6 pb-8 sm:pb-12 text-white">
          <div className="flex flex-col gap-4">
            <Link
              href="/blog"
              className="self-start flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Insights</span>
            </Link>

            {post.category && (
              <span className="self-start bg-[#00AC4E] text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                {post.category}
              </span>
            )}

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black tracking-tight leading-tight mt-2">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-xs font-bold text-stone-300 font-mono tracking-wider pt-2">
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#00AC4E]" />
                  <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
                </span>
              )}
              <span className="w-1 h-1 rounded-full bg-stone-500" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#00AC4E]" />
                {formatReadTime(post.reading_minutes)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Reading Column */}
      <div className="w-full flex-1 max-w-[840px] mx-auto px-6 py-12">
        <article className="w-full flex flex-col">

          {/* Author Profile card */}
          <div className="flex items-center gap-4 bg-white border border-stone-200/50 rounded-2xl p-4 sm:p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-8">
            <div className="w-12 h-12 rounded-full bg-[#00AC4E]/5 border border-[#00AC4E]/20 flex items-center justify-center font-bold text-[#00AC4E] text-base shadow-sm">
              {initials(post.author_name)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold text-stone-900 leading-none">{post.author_name}</span>
              {post.author_role && (
                <span className="text-xs font-bold text-stone-400 tracking-wider mt-1">{post.author_role}</span>
              )}
            </div>
          </div>

          <div className="blog-prose">{renderArticle(post.content)}</div>

          {(post.metrics ?? []).length > 0 && (
            <div className="mt-12 bg-white border border-stone-200/60 rounded-[28px] p-6 sm:p-8 shadow-sm">
              <h2 className="font-display text-lg font-black text-stone-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#00AC4E]" />
                <span>Verified Clean Energy Impact Parameters</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {post.metrics.map((m, idx) => (
                  <div key={idx} className="bg-stone-50/80 border border-stone-200/40 rounded-2xl p-4 flex flex-col text-left">
                    <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest leading-none">{m.label}</span>
                    <span className="text-xl sm:text-2xl font-black text-[#00AC4E] tracking-tight mt-2">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultation CTA */}
          <div className="mt-12 w-full bg-stone-900 rounded-[32px] p-8 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,172,78,0.15)] group border border-stone-800">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00AC4E]/10 via-transparent to-transparent opacity-60"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#00AC4E]/20 rounded-full blur-[60px] group-hover:scale-110 transition-all duration-700"></div>

            <div className="relative z-10 max-w-xl flex flex-col">
              <span className="text-[#00AC4E] text-xs font-black uppercase tracking-widest mb-3">Consultation Desk</span>
              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Design Your High-Yield Energy Infrastructure
              </h2>
              <p className="mt-4 text-stone-400 text-xs sm:text-sm font-medium leading-relaxed">
                Ready to deploy smart microgrids, high-capacity battery walls, or grid-scale solar? Collaborate directly with our expert engineering team.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <Link
                  href="/contact"
                  className="bg-[#00AC4E] hover:bg-[#00AC4E]/90 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-md"
                >
                  Schedule Architecture Review
                </Link>
                <Link
                  href="/blog"
                  className="text-stone-300 hover:text-white text-xs font-bold uppercase tracking-widest border-b border-stone-700 hover:border-white py-1 transition-all"
                >
                  Back to All Insights
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display text-xl sm:text-2xl font-black text-stone-900 border-b border-stone-200/50 pb-3">
              Keep Reading
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="group bg-white border border-stone-200/60 rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all"
                >
                  <div className="relative h-32 bg-stone-100">
                    {item.cover_url && (
                      <Image
                        src={item.cover_url}
                        alt={item.cover_alt || item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 260px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    {item.category && (
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#00AC4E]">{item.category}</span>
                    )}
                    <h3 className="mt-1 font-display text-sm font-extrabold text-stone-900 leading-snug group-hover:text-[#00AC4E] transition-colors">
                      {item.title}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-stone-500">
                      Read <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
