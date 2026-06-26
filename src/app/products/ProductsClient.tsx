"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, PackageCheck } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import WebGLBackground from "@/app/components/WebGLBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Icon = ({ d, className = "w-7 h-7" }: { d: React.ReactNode; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const products = [
  {
    name: "Solar Panels",
    tagline: "High-efficiency monocrystalline modules",
    brands: ["JA Solar", "TW Solar"],
    icon: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="1" />
        <path d="M9 4v13M15 4v13M3 8.5h18M3 13h18M12 17v3M9 20h6" />
      </>
    ),
  },
  {
    name: "Inverters",
    tagline: "Smart grid-tied & hybrid inverters",
    brands: ["SAJ", "SUNWAYS", "SOLIS"],
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 15c0-3 2.5-3 4 0s4 3 4 0" />
        <path d="M8 7h8" />
      </>
    ),
  },
  {
    name: "Switchgears",
    tagline: "Protection & power distribution",
    brands: ["Moreday"],
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <circle cx="15.5" cy="15" r="1.5" />
        <path d="M8.5 11v5M15.5 13V8" />
      </>
    ),
  },
  {
    name: "Cables",
    tagline: "Solar-rated DC/AC cabling",
    brands: ["Solen"],
    icon: (
      <>
        <path d="M4 4v5a4 4 0 0 0 4 4h8a4 4 0 0 1 4 4v3" />
        <path d="M2 4h4M18 20h4" />
        <circle cx="4" cy="4" r="0" />
      </>
    ),
  },
  {
    name: "Aluminum",
    tagline: "Mounting structures & framing",
    brands: ["Swisstek", "Alumex"],
    icon: (
      <>
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 7v6l9 4 9-4V7M3 13l9 4 9-4" />
      </>
    ),
  },
  {
    name: "Enclosures",
    tagline: "Weatherproof housings & cabinets",
    brands: ["Moreday"],
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M4 9h16M9 13h6" />
        <circle cx="15.5" cy="6" r="0.6" fill="currentColor" />
      </>
    ),
  },
];

export default function ProductsClient() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .fromTo(".hero-eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.1)
        .fromTo(".hero-line", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.2)
        .fromTo(".hero-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.6);

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(el, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-group").forEach((group) => {
        gsap.fromTo(group.querySelectorAll(".reveal-item"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: group, start: "top 82%" } });
      });
    }, root);
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { ctx.revert(); clearTimeout(t); };
  }, []);

  return (
    <div ref={root} className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      <SiteNav active="products" />

      {/* HERO */}
      <section className="relative w-full min-h-[68vh] flex items-center overflow-hidden bg-[#04140b]">
        <div className="absolute inset-0 z-0"><WebGLBackground variant="dark" /></div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#04140b] via-[#04140b]/40 to-[#04140b]/70" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-12 lg:px-20 py-28 w-full">
          <span className="hero-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#e2ff3a] mb-7 backdrop-blur-md">
            <PackageCheck className="w-3.5 h-3.5" /> Installation &amp; Retail
          </span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.02] max-w-4xl">
            <span className="hero-line block">Premium products,</span>
            <span className="hero-line block"><span className="text-[#00E676]">tier-one</span> brands.</span>
          </h1>
          <p className="hero-sub mt-8 text-white/70 font-medium text-base sm:text-lg leading-relaxed max-w-2xl">
            We supply and install only trusted, certified components — sourced from leading global and local
            manufacturers — so every system we deliver is built to perform and built to last.
          </p>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="relative w-full bg-white py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00AC4E]/[0.04] rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 reveal">
            <div className="flex items-center gap-4">
              <div className="w-[3px] h-10 bg-[#00AC4E] shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ WHAT WE SUPPLY /</span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-900 leading-none">Products & Brands</h2>
              </div>
            </div>
            <p className="text-stone-500 text-sm sm:text-base font-semibold max-w-md md:text-right leading-relaxed">
              Available for both project installation and direct retail purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 reveal-group">
            {products.map((p, i) => (
              <div
                key={p.name}
                className="reveal-item group relative rounded-[28px] bg-stone-50 border border-stone-200/60 p-7 shadow-lg shadow-stone-100/50 hover:border-[#00AC4E]/30 hover:bg-white hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-5 min-h-[230px]"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E]">
                    <Icon d={p.icon} className="w-7 h-7" />
                  </div>
                  <span className="font-mono text-lg font-bold text-stone-200 group-hover:text-[#00AC4E]/50 transition-colors">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-xl font-black tracking-tight text-stone-900 group-hover:text-[#00AC4E] transition-colors">{p.name}</h3>
                  <p className="text-stone-500 text-sm font-medium leading-relaxed">{p.tagline}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-stone-200/60">
                  {p.brands.map((b) => (
                    <span key={b} className="px-3 py-1.5 rounded-full bg-white border border-stone-200/80 text-stone-700 text-xs font-bold shadow-sm">{b}</span>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00AC4E] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-[28px]" />
              </div>
            ))}
          </div>

          {/* retail note */}
          <div className="mt-10 reveal rounded-[28px] bg-gradient-to-r from-[#012716] to-[#023f24] border border-[#00AC4E]/20 shadow-xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#e2ff3a] shrink-0">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight">Buying components for your own project?</h3>
                <p className="text-white/70 text-sm font-medium max-w-2xl">We offer competitive retail pricing on all products above — with genuine warranties and expert advice.</p>
              </div>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-3 bg-[#e2ff3a] text-[#012716] hover:bg-white font-bold rounded-full pl-6 pr-2 py-2 shadow-lg active:scale-[0.98] transition-all duration-300 group shrink-0">
              <span className="text-sm tracking-wide">Request a Quote</span>
              <span className="w-8 h-8 rounded-full bg-[#012716] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4 text-[#e2ff3a] stroke-[2.5]" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
