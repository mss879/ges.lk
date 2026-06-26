"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import WebGLBackground from "@/app/components/WebGLBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

const categories = [
  { icon: ic.solar, name: "Solar", items: ["On-Grid", "Off-Grid", "Hybrid", "BESS"], href: "/solutions/solar" },
  { icon: ic.power, name: "Power Generation", items: ["MTG"], href: "/solutions/power" },
  { icon: ic.hydrogen, name: "Hydrogen Energy", items: ["Fuel Cell (SFC)"], href: "/solutions/hydrogen" },
  { icon: ic.waste, name: "Waste Management", items: ["Composting Machine"], href: "/solutions/waste" },
  { icon: ic.ev, name: "EV Charging", items: ["Moreday"], href: "/solutions/ev" },
];

const solarSolutions = [
  {
    id: "on-grid",
    tag: "01 / Solar",
    title: "On-Grid Solar",
    desc: "A solar power system connected to the utility grid — allowing you to use solar energy during the day and draw electricity from the grid when needed.",
    diagram: "on-grid" as const,
    features: ["Use solar power by day", "Draw from grid at night", "Net-metering & export ready", "Lowest upfront investment"],
  },
  {
    id: "off-grid",
    tag: "02 / Solar",
    title: "Off-Grid Solar",
    desc: "A standalone solar system with battery storage that operates independently of the utility grid — providing power in remote or grid-unavailable locations.",
    diagram: "off-grid" as const,
    features: ["Battery storage included", "Complete grid independence", "Ideal for remote sites", "Uninterrupted day & night supply"],
  },
  {
    id: "hybrid",
    tag: "03 / Solar",
    title: "Hybrid Solar",
    desc: "A smart solar solution that combines grid connectivity with battery storage — ensuring reliable power supply and enhanced energy independence.",
    diagram: "hybrid" as const,
    features: ["Grid + battery combined", "Automatic backup on outage", "Maximum energy independence", "Smart load management"],
  },
  {
    id: "bess",
    tag: "04 / Solar",
    title: "BESS — Battery Energy Storage",
    desc: "An advanced energy storage solution that stores excess electricity for later use — improving energy efficiency, backup power availability and grid stability.",
    diagram: "bess" as const,
    features: ["Store excess electricity", "Backup power on demand", "Improved grid stability", "Higher self-consumption"],
  },
];

const mediaSolutions = [
  {
    id: "mtg",
    icon: ic.power,
    eyebrow: "Power Generation",
    title: "MTG — Micro Turbine Generator",
    desc: "A compact and efficient power generation system that converts fuel into electricity with low emissions and high reliability. Micro Turbine Generators are ideal for commercial, industrial and distributed energy applications, providing continuous and dependable power.",
    features: ["Low emissions", "Continuous & dependable", "Commercial & industrial scale"],
  },
  {
    id: "fuel-cell",
    icon: ic.hydrogen,
    eyebrow: "Hydrogen Energy",
    title: "Fuel Cell (SFC)",
    desc: "A clean and efficient energy solution that converts hydrogen into electricity with minimal emissions. SFC fuel cells provide reliable, quiet and sustainable power for a wide range of residential, commercial and industrial applications.",
    features: ["Minimal emissions", "Quiet operation", "Residential to industrial"],
  },
  {
    id: "composting",
    icon: ic.waste,
    eyebrow: "Waste Management",
    title: "Composting Machine",
    desc: "An eco-friendly waste management solution that converts organic waste into nutrient-rich compost quickly and efficiently. Composting machines help reduce waste, minimize environmental impact and support sustainable waste recycling practices.",
    features: ["Organic waste to compost", "Reduces landfill waste", "Sustainable recycling"],
  },
  {
    id: "ev-charging",
    icon: ic.ev,
    eyebrow: "EV Charging",
    title: "Moreday EV Charger",
    desc: "Fast, safe and intelligent EV charging solutions for homes, businesses and public charging networks.",
    features: ["Fast charging", "Safe & intelligent", "Home, business & public"],
  },
];



export default function SolutionsClient() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .fromTo(".hero-eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.1)
        .fromTo(".hero-line", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.2)
        .fromTo(".hero-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.6)
        .fromTo(".hero-chip", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07 }, 0.8);

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(el, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-group").forEach((group) => {
        gsap.fromTo(group.querySelectorAll(".reveal-item"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: group, start: "top 82%" } });
      });
    }, root);
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { ctx.revert(); clearTimeout(t); };
  }, []);

  return (
    <div ref={root} className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      <SiteNav active="solutions" />

      {/* HERO */}
      <section className="relative w-full min-h-[78vh] flex items-center overflow-hidden bg-[#04140b]">
        <div className="absolute inset-0 z-0"><WebGLBackground variant="dark" /></div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#04140b] via-[#04140b]/40 to-[#04140b]/70" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-12 lg:px-20 py-28 w-full">
          <span className="hero-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#e2ff3a] mb-7 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2ff3a] animate-pulse" />
            Our Solutions
          </span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.02] max-w-4xl">
            <span className="hero-line block">A complete</span>
            <span className="hero-line block"><span className="text-[#00E676]">clean-energy</span> ecosystem.</span>
          </h1>
          <p className="hero-sub mt-8 text-white/70 font-medium text-base sm:text-lg leading-relaxed max-w-2xl">
            From rooftop solar and battery storage to hydrogen, micro-turbines, waste-to-compost and EV charging — one
            engineering partner for every step of your energy transition.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link key={c.name} href={c.href} className="hero-chip inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-bold rounded-full px-4 py-2 backdrop-blur-md transition-all">
                <span className="text-[#e2ff3a]"><Icon d={c.icon} className="w-4 h-4" /></span>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OVERVIEW / STRUCTURE */}
      <section className="relative w-full bg-white py-24 md:py-28 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center text-center mb-14 reveal">
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4">/ SOLUTION FAMILIES /</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-950 leading-tight max-w-3xl">
              Five pillars. One integrated energy strategy.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 reveal-group">
            {categories.map((c) => (
              <Link key={c.name} href={c.href} className="reveal-item group relative rounded-[24px] bg-stone-50 border border-stone-200/60 p-6 hover:border-[#00AC4E]/30 hover:-translate-y-1.5 hover:bg-white transition-all duration-300 flex flex-col gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E]">
                  <Icon d={c.icon} className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-black tracking-tight text-stone-900 group-hover:text-[#00AC4E] transition-colors leading-tight">{c.name}</h3>
                <ul className="flex flex-col gap-1.5 mt-auto">
                  {c.items.map((it) => (
                    <li key={it} className="text-xs font-bold text-stone-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00AC4E]" />
                      {it}
                    </li>
                  ))}
                </ul>
                <ArrowUpRight className="absolute top-6 right-6 w-4 h-4 text-stone-300 group-hover:text-[#00AC4E] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SOLAR */}
      <section id="solar" className="relative w-full bg-[#f8f9fa] py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden scroll-mt-24">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00AC4E]/[0.04] rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center gap-4 mb-16 reveal">
            <div className="w-12 h-12 rounded-2xl bg-[#00AC4E] flex items-center justify-center text-white shadow-lg shadow-[#00AC4E]/20">
              <Icon d={ic.solar} className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ SOLAR /</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-950 leading-none">Solar Power Systems</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {solarSolutions.map((s) => (
              <div
                key={s.id}
                id={s.id}
                className="reveal flex flex-col justify-between rounded-[28px] bg-white border border-stone-200/60 hover:border-[#00AC4E]/30 hover:shadow-xl transition-all duration-300 p-8 sm:p-10 shadow-sm"
              >
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[11px] font-extrabold text-[#00AC4E] tracking-widest uppercase">{s.tag}</span>
                  <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-stone-950 leading-tight">{s.title}</h3>
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
                  href={`/solutions/${s.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-[#00AC4E] font-bold text-sm hover:gap-3 transition-all w-fit group/btn"
                >
                  Explore {s.title}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEDIA SOLUTIONS (MTG, Fuel Cell, Composting, EV) */}
      <section className="relative w-full bg-white py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col items-center text-center mb-16 reveal">
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4">/ ALTERNATIVE ENERGY & SUSTAINABILITY /</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-950 leading-tight max-w-3xl">
              Advanced Solutions for a Net-Zero Future
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {mediaSolutions.map((m) => (
              <div
                key={m.id}
                id={m.id}
                className="reveal flex flex-col justify-between rounded-[28px] bg-white border border-stone-200/60 hover:border-[#00AC4E]/30 hover:shadow-xl transition-all duration-300 p-8 sm:p-10 shadow-sm"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E]">
                      <Icon d={m.icon} className="w-5 h-5" />
                    </div>
                    <span className="text-[#00AC4E] font-mono text-[11px] font-bold tracking-[0.2em] uppercase">/ {m.eyebrow} /</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-stone-950 leading-tight">{m.title}</h3>
                  <p className="text-stone-600 font-medium text-xs sm:text-sm leading-relaxed">{m.desc}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {m.features.map((f) => (
                      <span key={f} className="px-3 py-1 rounded-full bg-stone-100 border border-stone-200/60 text-stone-700 text-[10px] sm:text-xs font-bold">{f}</span>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/solutions/${m.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-[#00AC4E] font-bold text-sm hover:gap-3 transition-all w-fit group/btn"
                >
                  Explore {m.title}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full bg-[#f8f9fa] py-24 md:py-28 px-6 sm:px-12 lg:px-20 overflow-hidden">
        <div className="max-w-[1240px] mx-auto reveal">
          <div className="relative rounded-[36px] bg-gradient-to-r from-[#012716] to-[#023f24] border border-[#00AC4E]/20 shadow-2xl p-8 sm:p-12 lg:p-16 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#00AC4E]/20 rounded-full blur-[100px]" />
            <div className="relative z-10 flex flex-col gap-4 text-center lg:text-left">
              <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight max-w-2xl">
                Not sure which solution fits your needs?
              </h3>
              <p className="text-white/70 font-medium text-sm sm:text-base max-w-xl">
                Our engineers will assess your site and design the optimal mix of solar, storage and generation.
              </p>
            </div>
            <Link href="/contact" className="relative z-10 inline-flex items-center gap-3 bg-[#e2ff3a] text-[#012716] hover:bg-white font-bold rounded-full pl-7 pr-2 py-2.5 shadow-lg active:scale-[0.98] transition-all duration-300 group shrink-0">
              <span className="tracking-wide">Talk to an Engineer</span>
              <span className="w-9 h-9 rounded-full bg-[#012716] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
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
