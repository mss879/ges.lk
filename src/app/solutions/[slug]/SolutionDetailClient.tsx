"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import WebGLBackground from "@/app/components/WebGLBackground";
import SolarDiagram from "@/app/components/SolarDiagram";
import { SolutionItem, solutionsDataList } from "@/data/solutions";

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

function VideoFrame({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="relative w-full aspect-video rounded-[28px] overflow-hidden border border-stone-200/60 bg-gradient-to-br from-[#08150c] via-[#0c2417] to-[#04140b] shadow-xl group">
      <div className="absolute inset-0 opacity-[0.08] text-[#00E676] flex items-center justify-center">
        <div className="w-1/2 h-1/2">
          <Icon d={icon} className="w-full h-full" />
        </div>
      </div>
      <div className="absolute inset-0 grid-background opacity-30" />
      {/* play button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#e2ff3a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Play className="w-6 h-6 text-[#04140b] fill-[#04140b] translate-x-0.5" />
        </div>
        <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-3 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e2ff3a] animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-widest text-white/80">Video coming soon</span>
      </div>
    </div>
  );
}

export default function SolutionDetailClient({ solution }: { solution: SolutionItem }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .fromTo(".hero-eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.1)
        .fromTo(".hero-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.2)
        .fromTo(".hero-sub", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.4);
    }, root);
    return () => ctx.revert();
  }, [solution]);

  const otherSolutions = solutionsDataList.filter((s) => s.slug !== solution.slug);

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
            {solution.eyebrow}
          </span>
          <h1 className="hero-title font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl">
            {solution.title}
          </h1>
          <p className="hero-sub mt-4 text-white/70 font-medium text-sm sm:text-base leading-relaxed max-w-2xl">
            {solution.tag} · Dedicated GES Energy System Solution
          </p>
        </div>
      </section>

      {/* CONTENT & GRAPHICS */}
      <section className="relative w-full bg-white py-16 sm:py-24 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Copy */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-stone-950">
              Overview & Specifications
            </h2>
            <p className="text-stone-600 font-medium text-sm sm:text-base leading-relaxed">
              {solution.desc}
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <h3 className="font-display text-base font-bold text-stone-900 uppercase tracking-wider">
                Key Benefits & Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {solution.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm font-semibold text-stone-700">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-[#00AC4E]/10 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-[#00AC4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-3.5 bg-stone-950 hover:bg-[#00AC4E] text-white font-bold rounded-full pl-5 pr-1.5 py-1.5 shadow-[0_4px_18px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all duration-300 group w-fit"
            >
              <span className="tracking-wide text-xs uppercase tracking-widest">Enquire about this solution</span>
              <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </span>
            </Link>
          </div>

          {/* Right Column: Visual Component */}
          <div className="lg:col-span-6">
            {solution.diagram ? (
              <div className="rounded-[24px] bg-gradient-to-br from-stone-50 to-white border border-stone-200/60 p-5 sm:p-7 shadow-sm">
                <SolarDiagram type={solution.diagram} />
                <p className="text-center text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 mt-2">Live energy flow diagram</p>
              </div>
            ) : (
              <VideoFrame icon={ic[solution.iconName]} label={solution.title} />
            )}
          </div>
        </div>
      </section>

      {/* OTHER SOLUTIONS NAVIGATION */}
      <section className="relative w-full bg-[#f8f9fa] py-20 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="max-w-[1240px] mx-auto">
          <div className="mb-10 text-center sm:text-left">
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase block mb-2">/ MORE OPTIONS /</span>
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-stone-950">
              Explore Our Other Solutions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherSolutions.slice(0, 4).map((s) => (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                className="group relative rounded-[20px] bg-white border border-stone-200/60 p-5 hover:border-[#00AC4E]/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col gap-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E]">
                  <Icon d={ic[s.iconName]} className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{s.eyebrow}</span>
                  <h3 className="font-display text-base font-black text-stone-900 group-hover:text-[#00AC4E] transition-colors leading-tight mt-0.5">{s.title}</h3>
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
