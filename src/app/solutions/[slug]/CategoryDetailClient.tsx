"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import WebGLBackground from "@/app/components/WebGLBackground";
import { SolutionCategory, categoriesDataList, solutionsDataList } from "@/data/solutions";

const Icon = ({ d, className = "w-6 h-6" }: { d: React.ReactNode; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const ic = {
  solar: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </>
  ),
  power: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />,
  hydrogen: (
    <>
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7Z" />
    </>
  ),
  waste: (
    <>
      <path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L7.2 9.5" />
      <path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7l-1.2-2.1M14 16l-3 3 3 3" />
      <path d="m9.3 5.8 1.1-1.9a1.8 1.8 0 0 1 3.1 0l3.9 6.8M9.3 5.8 3.1 10.6" />
    </>
  ),
  ev: (
    <>
      <path d="M7 17h10M5 21V7a2 2 0 0 1 2-2h4l3 3v13M5 13h9" />
      <path d="M18 8v4a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-2l-2-2" />
    </>
  ),
  battery: (
    <>
      <rect x="2" y="7" width="16" height="10" rx="2" />
      <path d="M22 11v2M6 11v2M10 11v2" />
    </>
  ),
};

export default function CategoryDetailClient({ category }: { category: SolutionCategory }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .fromTo(".hero-eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.1)
        .fromTo(".hero-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.2)
        .fromTo(".hero-sub", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.4);
    }, root);
    return () => ctx.revert();
  }, [category]);

  const subSolutions = solutionsDataList.filter((s) => category.subItemSlugs.includes(s.slug));
  const otherCategories = categoriesDataList.filter((c) => c.slug !== category.slug);

  return (
    <div ref={root} className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      <SiteNav active="solutions" />

      {/* HERO */}
      <section className="relative w-full min-h-[50vh] flex items-center overflow-hidden bg-[#04140b] py-20">
        <div className="absolute inset-0 z-0"><WebGLBackground variant="dark" /></div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#04140b] via-[#04140b]/40 to-[#04140b]/70" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-12 lg:px-20 w-full pt-12">
          <span className="hero-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#e2ff3a] mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2ff3a] animate-pulse" />
            {category.eyebrow}
          </span>
          <h1 className="hero-title font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl">
            {category.name}
          </h1>
          <p className="hero-sub mt-4 text-white/70 font-medium text-sm sm:text-base leading-relaxed max-w-2xl">
            Explore dedicated GES clean-energy solutions and systems
          </p>
        </div>
      </section>

      {/* CONTENT & SUB-ITEMS GRID */}
      <section className="relative w-full bg-white py-16 sm:py-24 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-14">
          
          <div className="flex flex-col gap-4 max-w-3xl">
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-stone-950">
              Overview
            </h2>
            <p className="text-stone-600 font-medium text-sm sm:text-base leading-relaxed">
              {category.desc}
            </p>
          </div>

          <div className="border-t border-stone-100/80 pt-12">
            <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-stone-950 mb-8">
              Available Solutions under {category.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {subSolutions.map((s) => (
                <div
                  key={s.slug}
                  className="flex flex-col justify-between rounded-[28px] bg-stone-50 border border-stone-200/60 hover:border-[#00AC4E]/30 hover:bg-white hover:shadow-xl transition-all duration-300 p-8 sm:p-10 shadow-sm"
                >
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[11px] font-extrabold text-[#00AC4E] tracking-widest uppercase">{s.tag}</span>
                    <h4 className="font-display text-lg sm:text-xl font-black tracking-tight text-stone-950 leading-tight">{s.title}</h4>
                    <p className="text-stone-600 font-medium text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                    <ul className="flex flex-col gap-2 mt-2">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-stone-700">
                          <span className="mt-0.5 w-4 h-4 rounded-full bg-[#00AC4E]/10 flex items-center justify-center shrink-0">
                            <svg className="w-2.5 h-2.5 text-[#00AC4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={`/solutions/${s.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-[#00AC4E] font-bold text-sm hover:gap-3 transition-all w-fit group/btn"
                  >
                    View Details for {s.title}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE OTHER CATEGORIES */}
      <section className="relative w-full bg-[#f8f9fa] py-20 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="max-w-[1240px] mx-auto">
          <div className="mb-10 text-center sm:text-left">
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase block mb-2">/ MORE PILLARS /</span>
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-stone-950">
              Explore Our Other Categories
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/solutions/${c.slug}`}
                className="group relative rounded-[20px] bg-white border border-stone-200/60 p-5 hover:border-[#00AC4E]/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col gap-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E]">
                  <Icon d={ic[c.iconName]} className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{c.eyebrow}</span>
                  <h3 className="font-display text-base font-black text-stone-900 group-hover:text-[#00AC4E] transition-colors leading-tight mt-0.5">{c.name}</h3>
                </div>
                <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-stone-300 group-hover:text-[#00AC4E] transition-all group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
