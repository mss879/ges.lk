"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Search, BookOpen, Clock, Calendar } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import type { PostSummary } from "@/lib/blog/types";
import { formatPostDate, formatReadTime, initials } from "@/lib/blog/format";

/**
 * Interactive part of /blog: category tabs, search, the featured post and the
 * grid. Posts arrive from the server page, so every card is in the HTML.
 */
export default function BlogIndexClient({ posts }: { posts: PostSummary[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Categories come from the posts themselves, in order of first appearance.
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c))))],
    [posts],
  );

  const query = searchQuery.toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(query) || (post.excerpt ?? "").toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // The featured post (or else the newest) leads the default view.
  const isDefaultView = searchQuery === "" && selectedCategory === "All";
  const featuredPost = isDefaultView ? (posts.find((p) => p.featured) ?? posts[0] ?? null) : null;
  const gridPosts = featuredPost ? filteredPosts.filter((p) => p.id !== featuredPost.id) : filteredPosts;

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-clip">
      <SiteNav active="blog" />

      {/* Hero Header Section */}
      <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-stone-50 to-[#f8f9fa] border-b border-stone-200/50 relative overflow-hidden shrink-0">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary-green/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-green/5 border border-primary-green/20 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-primary-green mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-green animate-pulse"></span>
            GES Engineering Insights
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-900 leading-none">
            Knowledge & <span className="text-primary-green">Green Tech</span>
          </h1>
          <p className="mt-6 text-stone-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Explore comprehensive analysis, case studies, and strategic engineering frameworks covering solar yields, battery storage, and national grids.
          </p>
        </div>
      </section>

      {/* Filter & Search Control Panel */}
      <section className="w-full py-8 border-b border-stone-200/40 sticky top-[64px] xl:top-[72px] z-40 bg-[#f8f9fa]/90 backdrop-blur-md shrink-0">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none whitespace-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary-green text-white border-primary-green shadow-md shadow-primary-green/10 -translate-y-0.5"
                    : "bg-white text-stone-600 border-stone-200/80 hover:border-primary-green/30 hover:text-primary-green hover:-translate-y-0.5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:max-w-xs shadow-sm rounded-xl">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              aria-label="Search articles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200/80 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold placeholder-stone-400 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* Article Showcase and Grid */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-6 py-12 flex flex-col gap-16">

        {filteredPosts.length === 0 && (
          <div className="w-full text-center py-20 bg-white border border-stone-200/50 rounded-[28px] shadow-sm">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-stone-800">
              {posts.length === 0 ? "Articles are on their way" : "No articles found"}
            </h2>
            <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
              {posts.length === 0
                ? "Our engineers are writing the first articles. Check back soon."
                : `We couldn't find any articles matching "${searchQuery}" under ${selectedCategory}. Try resetting your filters.`}
            </p>
            {posts.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-6 bg-stone-900 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Featured Article Card */}
        {featuredPost && (
          <div className="w-full bg-white border border-stone-200/60 rounded-[32px] overflow-hidden shadow-[0_15px_40px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative h-[300px] sm:h-[400px] lg:h-[460px] overflow-hidden bg-stone-100">
                {featuredPost.cover_url && (
                  <Image
                    src={featuredPost.cover_url}
                    alt={featuredPost.cover_alt || featuredPost.title}
                    fill
                    fetchPriority="high"
                    loading="eager"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {featuredPost.category && (
                  <span className="absolute top-6 left-6 bg-green-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md">
                    {featuredPost.category}
                  </span>
                )}
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4 text-xs font-bold text-stone-400 font-mono tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatPostDate(featuredPost.published_at)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-stone-300" />
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatReadTime(featuredPost.reading_minutes)}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                    <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>

                  {featuredPost.excerpt && (
                    <p className="text-stone-500 text-sm sm:text-base leading-relaxed font-medium">{featuredPost.excerpt}</p>
                  )}

                  {(featuredPost.metrics ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {featuredPost.metrics.map((m, i) => (
                        <div key={i} className="bg-stone-50 border border-stone-200/50 px-3 py-1.5 rounded-xl flex flex-col text-left">
                          <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-widest leading-none">{m.label}</span>
                          <span className="text-xs font-black text-stone-700 tracking-tight mt-1">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-6 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center font-bold text-green-700 shadow-sm text-sm">
                      {initials(featuredPost.author_name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-extrabold text-stone-800 leading-none">{featuredPost.author_name}</span>
                      {featuredPost.author_role && (
                        <span className="text-[10px] font-bold text-stone-400 tracking-wider mt-1">{featuredPost.author_role}</span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    aria-label={`Read: ${featuredPost.title}`}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-stone-50 group-hover:bg-green-600 text-stone-600 group-hover:text-white border border-stone-200/60 group-hover:border-green-600 shadow-sm transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        {gridPosts.length > 0 && (
          <div className="flex flex-col gap-8">
            {featuredPost && (
              <h2 className="font-display text-xl sm:text-2xl font-black text-stone-900 border-b border-stone-200/50 pb-3 flex items-center gap-2">
                <span>Recent Insight Articles</span>
                <span className="bg-stone-100 text-stone-500 font-bold font-mono text-xs px-2 py-0.5 rounded-md">{gridPosts.length}</span>
              </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {gridPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-stone-200/60 rounded-[28px] overflow-hidden shadow-[0_10px_25px_-12px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_-8px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col justify-between"
                >
                  <div className="flex flex-col">
                    <div className="relative h-[200px] sm:h-[220px] overflow-hidden bg-stone-100">
                      {post.cover_url && (
                        <Image
                          src={post.cover_url}
                          alt={post.cover_alt || post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 46vw, 30vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      {post.category && (
                        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-stone-200/40 text-stone-700 font-bold text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-stone-400 font-mono tracking-wider leading-none">
                        <span>{formatPostDate(post.published_at)}</span>
                        <span className="w-1 h-1 rounded-full bg-stone-300" />
                        <span>{formatReadTime(post.reading_minutes)}</span>
                      </div>

                      <h3 className="font-display text-lg sm:text-xl font-extrabold text-stone-900 group-hover:text-primary-green transition-colors duration-300 leading-snug">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      {post.excerpt && (
                        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium line-clamp-3">{post.excerpt}</p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-green/5 border border-primary-green/20 flex items-center justify-center font-bold text-primary-green text-xs">
                        {initials(post.author_name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold text-stone-800 leading-none">{post.author_name}</span>
                        {post.author_role && (
                          <span className="text-[9px] font-bold text-stone-400 tracking-wider mt-1">{post.author_role.split(",")[0]}</span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-xs font-bold text-stone-600 group-hover:text-primary-green transition-colors cursor-pointer"
                    >
                      <span>Read Insight</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
