"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import WebGLBackground from "@/app/components/WebGLBackground";
import CountUp from "@/components/CountUp";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Inline icon set (kept inline like the homepage to avoid icon-lib version risk) */
const icons: Record<string, React.ReactNode> = {
  leaf: (
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Zm0 0c0-4 0-7 9-9" />
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V18h6v-1.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  gauge: (
    <>
      <path d="M12 14l4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </>
  ),
  wallet: (
    <>
      <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5" />
      <path d="M16 12h.01" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 11 2 2 4-4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="1.5" />
      <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
      <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
    </>
  ),
  handshake: (
    <>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </>
  ),
  recycle: (
    <>
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12M14 16l-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598M9.344 5.811l1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843M13.378 9.633l4.096 1.098 1.097-4.096" />
    </>
  ),
  award: (
    <>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      <circle cx="12" cy="8" r="6" />
    </>
  ),
};

function Icon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

/* Green leaf-textured icon chip — the homepage's signature element */
function LeafChip({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const box = size === "lg" ? "w-14 h-14 rounded-2xl" : "w-12 h-12 rounded-2xl";
  const ic = size === "lg" ? "w-7 h-7" : "w-6 h-6";
  return (
    <div className={`${box} flex items-center justify-center relative overflow-hidden text-white shadow-md shadow-[#00AC4E]/10 shrink-0`}>
      <div className="absolute inset-0 z-0">
        <Image src="/leaf_drops.webp" alt="" fill sizes="56px" className="object-cover opacity-50 grayscale brightness-[0.8] contrast-[1.2]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#00AC4E] to-[#00AC4E]/85 z-10" />
      </div>
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_8px_rgba(255,255,255,0.4)] border border-white/10 z-20" />
      <div className="relative z-30 flex items-center justify-center">
        <Icon name={name} className={ic} />
      </div>
    </div>
  );
}

const values = [
  { icon: "leaf", title: "Sustainability Business Practices", desc: "With a carefully crafted business plan, we undertake every measure to ensure sustainable and ethical business practices." },
  { icon: "bulb", title: "Disciplined Entrepreneurship", desc: "Our “can do” attitude and innovation, combined with disciplined thinking and actions, are vital for success." },
  { icon: "users", title: "A Customer-Centric Approach", desc: "Inculcating a value-based business proposition, we ensure our business practices are well focused on the needs of our customers." },
  { icon: "gauge", title: "Business Efficiency", desc: "We believe in doing the right thing, in the right way, at the right time — aiming to deliver more than what is expected from our core business." },
  { icon: "wallet", title: "Value for Money", desc: "With inculcated values of innovation and stability, we ensure our products and services meet the requirements of our customers and business entities." },
  { icon: "shield", title: "Accountability", desc: "We believe that owning up to our actions is the best way to grow our business model and consolidate our footprint by capturing the hearts of our customers." },
];

const pillars = [
  { icon: "atom", title: "Science & Technology", desc: "Engineering rigour and the latest clean-energy technology behind every system we build." },
  { icon: "handshake", title: "Commitment", desc: "An unwavering promise of quality, reliability and customer satisfaction at every stage." },
  { icon: "globe", title: "Environment", desc: "A genuine responsibility to protect natural resources and accelerate the energy transition." },
];

const awards = [
  { src: "/award-1.png", tag: "Recognition" },
  { src: "/award-2.png", tag: "Recognition" },
  { src: "/award-3.png", tag: "Recognition" },
];

const partnerLogos = [
  "/logos-carosel/Asset-1@4x-3-scaled.webp",
  "/logos-carosel/Asset-3@4x-4-scaled.webp",
  "/logos-carosel/Asset-4-2@4x-scaled.webp",
  "/logos-carosel/Asset-3@4x-4-copy-scaled.webp",
];

export default function AboutClient() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .fromTo(".hero-eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.1)
        .fromTo(".hero-line", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.2)
        .fromTo(".hero-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.6)
        .fromTo(".hero-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.8)
        .fromTo(".hero-stat", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, 0.9);

      // Generic scroll reveals
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      // Staggered groups
      gsap.utils.toArray<HTMLElement>(".reveal-group").forEach((group) => {
        gsap.fromTo(
          group.querySelectorAll(".reveal-item"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: group, start: "top 80%" },
          }
        );
      });

      // Parallax drift on collage images
      gsap.utils.toArray<HTMLElement>(".parallax").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60 },
          {
            y: -40,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    }, root);

    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      ctx.revert();
      clearTimeout(t);
    };
  }, []);

  return (
    <div ref={root} className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      <SiteNav active="about" />

      {/* ===== HERO ===== */}
      <section className="relative w-full min-h-[86vh] flex items-center overflow-hidden bg-[#04140b]">
        <div className="absolute inset-0 z-0">
          <WebGLBackground variant="dark" />
        </div>
        {/* legibility + noise */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#04140b] via-[#04140b]/40 to-[#04140b]/70 pointer-events-none" />
        <div
          className="absolute inset-0 z-[2] opacity-[0.05] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')", backgroundSize: "161px" }}
        />

        <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-12 lg:px-20 py-28 w-full">
          <span className="hero-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#e2ff3a] mb-7 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2ff3a] animate-pulse" />
            About Green Engineering Systems
          </span>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.02] max-w-4xl">
            <span className="hero-line block">Powering a</span>
            <span className="hero-line block">
              <span className="text-[#00E676]">sustainable</span> future,
            </span>
            <span className="hero-line block">engineered to last.</span>
          </h1>

          <p className="hero-sub mt-8 text-white/70 font-medium text-base sm:text-lg leading-relaxed max-w-2xl">
            At Green Engineering Systems (Pvt) Ltd, we are passionate about powering a sustainable future through
            innovative engineering and renewable energy solutions — helping homes, businesses and industries achieve
            energy independence while minimizing environmental impact.
          </p>

          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-[#e2ff3a] text-[#04140b] hover:bg-white font-bold rounded-full pl-6 pr-2 py-2 shadow-lg active:scale-[0.98] transition-all duration-300 group"
            >
              <span className="text-sm tracking-wide">Partner With Us</span>
              <span className="w-8 h-8 rounded-full bg-[#04140b] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4 text-[#e2ff3a] stroke-[2.5]" />
              </span>
            </Link>
            <Link href="/solutions" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm border border-white/20 hover:border-white/40 rounded-full px-6 py-3 transition-all">
              Explore Solutions
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* hero stats */}
          <div className="mt-16 grid grid-cols-3 max-w-xl gap-4 sm:gap-8">
            {[
              { v: <><CountUp end={10} duration={2} />+</>, l: "Years of Experience" },
              { v: <><CountUp end={1200} duration={2.2} />+</>, l: "Installations" },
              { v: <><CountUp end={100} duration={2} />%</>, l: "Customer Trust" },
            ].map((s, i) => (
              <div key={i} className="hero-stat flex flex-col">
                <span className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">{s.v}</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-wider mt-1.5 leading-tight">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPANY OVERVIEW ===== */}
      <section className="relative w-full bg-white py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#00AC4E]/[0.03] rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6 reveal">
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ COMPANY OVERVIEW /</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-stone-950 leading-tight">
              A trusted partner in Sri Lanka&rsquo;s journey towards a <span className="text-[#00AC4E]">greener tomorrow.</span>
            </h2>
            <div className="flex flex-col gap-5 text-stone-600 font-medium text-sm sm:text-base leading-relaxed">
              <p>
                With years of industry expertise, we provide end-to-end solar and energy solutions that help homes,
                businesses and industries achieve energy independence, reduce costs and minimize environmental impact.
              </p>
              <p>
                Our commitment to quality, reliability and customer satisfaction makes us a trusted partner in the
                nation&rsquo;s transition to clean, renewable power.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {["End-to-End Solutions", "ISO 9001:2015", "SLSEA Certified"].map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-full bg-[#00AC4E]/8 border border-[#00AC4E]/15 text-[#00AC4E] text-xs font-bold">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-5 items-start reveal-group">
            <div className="space-y-5">
              <div className="reveal-item relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-stone-100/50 group/img">
                <Image src="/about_us_office_v6.webp" alt="GES engineering office" fill sizes="300px" className="object-cover group-hover/img:scale-105 transition-transform duration-700" />
              </div>
              <div className="reveal-item relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-stone-100/50 group/img">
                <Image src="/about_us_engineers_v6.webp" alt="GES engineers on site" fill sizes="300px" className="object-cover group-hover/img:scale-105 transition-transform duration-700" />
              </div>
            </div>
            <div className="space-y-5 pt-12">
              <div className="reveal-item relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-stone-100/50 group/img">
                <Image src="/about_us_tech_v7.webp" alt="Battery storage & inverter room" fill sizes="300px" className="object-cover group-hover/img:scale-105 transition-transform duration-700" />
              </div>
              <div className="reveal-item relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-stone-100/50 group/img">
                <Image src="/about_us_building_v7.webp" alt="Sustainable building with rooftop solar" fill sizes="300px" className="object-cover group-hover/img:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HISTORY ===== */}
      <section className="relative w-full bg-[#08150c] text-white py-24 md:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00AC4E]/[0.06] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 reveal order-2 lg:order-1">
            <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl aspect-[5/6]">
              <Image src="/about_us_engineers_v5.webp" alt="A decade of solar engineering" fill sizes="500px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08150c] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="font-display text-6xl font-black text-[#e2ff3a] leading-none">
                    <CountUp end={10} duration={2} />+
                  </span>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-2">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6 reveal order-1 lg:order-2">
            <span className="text-[#e2ff3a] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ OUR HISTORY /</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              A decade of delivering trusted renewable energy.
            </h2>
            <div className="flex flex-col gap-5 text-white/70 font-medium text-sm sm:text-base leading-relaxed">
              <p>
                For over a decade, Green Engineering Systems (Pvt) Ltd has been delivering trusted engineering and
                renewable energy solutions across Sri Lanka. Since our establishment, we have successfully completed
                numerous residential, commercial and industrial projects, building a strong reputation for quality,
                innovation and reliability.
              </p>
              <p>
                With 10+ years of industry experience, we continue to help our customers embrace sustainable energy
                solutions while contributing to a greener and more energy-efficient future.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-6 mt-2 border-t border-white/10">
              {[
                { v: "Residential", d: "Homes powered" },
                { v: "Commercial", d: "Businesses served" },
                { v: "Industrial", d: "Plants energised" },
              ].map((s) => (
                <div key={s.v} className="flex flex-col">
                  <span className="font-display text-lg sm:text-xl font-black text-white">{s.v}</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">{s.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="relative w-full bg-white py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 reveal">
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4">/ PURPOSE & DIRECTION /</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-stone-950 leading-tight max-w-3xl">
              Our Mission & Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 reveal-group">
            {/* Mission */}
            <div className="reveal-item relative rounded-[32px] bg-gradient-to-br from-[#012716] to-[#023f24] text-white p-8 sm:p-10 border border-[#00AC4E]/20 shadow-xl overflow-hidden flex flex-col gap-6">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#00AC4E]/20 rounded-full blur-[80px]" />
              <div className="relative z-10 flex items-center gap-4">
                <LeafChip name="target" size="lg" />
                <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight">Our Mission</h3>
              </div>
              <p className="relative z-10 text-white/80 text-sm sm:text-base leading-relaxed">
                By providing unparalleled value, we will greatly accelerate the adoption of solar energy systems —
                giving our customers, our communities and our nation clean, abundant, cost-effective, distributed and
                renewable energy.
              </p>
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-auto pt-4">
                {pillars.map((p) => (
                  <div key={p.title} className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2">
                    <span className="text-[#e2ff3a]"><Icon name={p.icon} className="w-6 h-6" /></span>
                    <span className="text-xs font-bold text-white leading-tight">{p.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vision */}
            <div className="reveal-item relative rounded-[32px] bg-stone-50 text-stone-900 p-8 sm:p-10 border border-stone-200/60 shadow-lg overflow-hidden flex flex-col gap-6">
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#00AC4E]/[0.06] rounded-full blur-[80px]" />
              <div className="relative z-10 flex items-center gap-4">
                <LeafChip name="eye" size="lg" />
                <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight">Our Vision</h3>
              </div>
              <p className="relative z-10 text-stone-600 text-sm sm:text-base leading-relaxed">
                To provide affordable energy solutions to communities across our country, while working alongside
                stakeholders to uplift the future of sustainable energy.
              </p>
              <div className="relative z-10 mt-auto pt-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/8] border border-stone-200">
                  <Image src="/green_terraces.webp" alt="Sustainable green landscape" fill sizes="600px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-display font-black text-lg">Uplifting communities, sustainably.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR VALUES ===== */}
      <section className="relative w-full bg-[#f8f9fa] py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00AC4E]/[0.03] rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 reveal">
            <div className="flex items-center gap-4">
              <div className="w-[3px] h-10 bg-[#00AC4E] shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ OUR VALUES /</span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-900 leading-none">
                  The principles we build on
                </h2>
              </div>
            </div>
            <p className="text-stone-500 text-sm sm:text-base font-semibold max-w-md md:text-right leading-relaxed">
              Six convictions that guide every decision, every project and every partnership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 reveal-group">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="reveal-item group relative rounded-[28px] bg-white p-7 border border-stone-200/60 shadow-lg shadow-stone-100/50 hover:border-[#00AC4E]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-5 min-h-[260px]"
              >
                <div className="flex items-start justify-between">
                  <LeafChip name={v.icon} size="lg" />
                  <span className="font-mono text-lg font-bold text-stone-200 group-hover:text-[#00AC4E]/50 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 mt-auto">
                  <h3 className="font-display text-xl font-black tracking-tight text-stone-900 group-hover:text-[#00AC4E] transition-colors leading-snug">
                    {v.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed font-medium">{v.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00AC4E] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-[28px]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR TEAM (group photo placeholder) ===== */}
      <section className="relative w-full bg-white py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="max-w-[1240px] mx-auto flex flex-col items-center text-center reveal">
          <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4">/ OUR TEAM /</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-stone-950 leading-tight max-w-3xl">
            The people behind the power.
          </h2>
          <p className="mt-5 text-stone-500 text-sm sm:text-base font-medium max-w-2xl leading-relaxed">
            A certified team of engineers and specialists committed to delivering safe, reliable and high-performance
            clean energy across Sri Lanka.
          </p>

          {/* Empty group-photo frame to be supplied later */}
          <div className="mt-12 w-full relative rounded-[36px] overflow-hidden border-2 border-dashed border-stone-200 bg-stone-50/60 aspect-[16/7] flex flex-col items-center justify-center gap-4 group">
            <div className="absolute inset-0 grid-background opacity-60" />
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-[#00AC4E]">
              <Icon name="users" className="w-8 h-8" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1">
              <span className="font-display font-black text-stone-700 text-lg">Team Group Photo</span>
              <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CERTIFICATIONS & PARTNERSHIPS ===== */}
      <section className="relative w-full bg-[#f8f9fa] py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col gap-6 reveal">
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ CERTIFICATIONS & PARTNERSHIPS /</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-stone-950 leading-tight">
              Backed by global standards & trusted brands.
            </h2>
            <p className="text-stone-600 font-medium text-sm sm:text-base leading-relaxed">
              Green Engineering Systems is committed to maintaining high industry standards through recognized
              certifications and trusted partnerships. We collaborate with leading global and local brands in
              renewable energy and electrical engineering to deliver reliable, high-quality solutions.
            </p>
            <p className="text-stone-600 font-medium text-sm sm:text-base leading-relaxed">
              Our certified team ensures every project meets safety, performance and regulatory standards — giving our
              customers complete confidence in our work.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { t: "ISO 9001 : 2015", s: "Standardized Quality" },
                { t: "SL SEA Certified", s: "Authority Approved" },
              ].map((b) => (
                <div key={b.t} className="flex items-center gap-4 rounded-2xl p-4 border border-[#00AC4E]/15 bg-gradient-to-br from-[#00AC4E]/8 to-[#00AC4E]/3">
                  <div className="w-11 h-11 rounded-xl bg-[#00AC4E]/10 border border-[#00AC4E]/20 flex items-center justify-center text-[#00AC4E] shrink-0">
                    <Icon name="shield" className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#00AC4E] uppercase tracking-wider leading-none">{b.s}</span>
                    <span className="text-sm font-extrabold text-stone-900 mt-1.5">{b.t}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner logo board */}
          <div className="lg:col-span-7 reveal">
            <div className="rounded-[32px] bg-white border border-stone-200/60 shadow-lg p-8 sm:p-10">
              <p className="text-center text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-stone-400 uppercase mb-8">
                / TRUSTED TECHNOLOGY PARTNERS /
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
                {partnerLogos.map((src, i) => (
                  <div key={i} className="flex items-center justify-center h-12 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                    <Image src={src} alt="Partner" width={140} height={50} className="max-h-full max-w-full object-contain" />
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {["JA Solar", "SAJ", "Solis", "Sunways"].map((b) => (
                  <span key={b} className="text-stone-500 font-bold text-sm">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUSTAINABILITY COMMITMENT ===== */}
      <section className="relative w-full text-white py-24 md:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden bg-[#04140b]">
        <div className="absolute inset-0 z-0 opacity-60">
          <WebGLBackground variant="dark" />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#04140b] via-[#04140b]/70 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 reveal">
            <span className="text-[#e2ff3a] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ SUSTAINABILITY COMMITMENT /</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Sustainability is at the core of everything we do.
            </h2>
            <p className="text-white/70 font-medium text-sm sm:text-base leading-relaxed max-w-2xl">
              We are committed to promoting clean and renewable energy solutions that reduce carbon emissions, conserve
              natural resources and support a greener future. Through our solar and energy-efficient systems, we help
              customers lower their environmental impact while moving towards long-term energy independence.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 reveal-group">
              {[
                { icon: "recycle", t: "Lower Carbon", d: "Cut emissions with clean generation" },
                { icon: "globe", t: "Conserve Resources", d: "Protect natural resources" },
                { icon: "leaf", t: "Energy Independence", d: "Long-term sustainable power" },
              ].map((c) => (
                <div key={c.t} className="reveal-item rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm flex flex-col gap-3">
                  <span className="text-[#e2ff3a]"><Icon name={c.icon} className="w-7 h-7" /></span>
                  <span className="font-display font-black text-white">{c.t}</span>
                  <span className="text-white/50 text-xs font-medium leading-relaxed">{c.d}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 reveal">
            <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl aspect-[4/5]">
              <Image src="/about_us_building_v6.webp" alt="Sustainable engineering at GES" fill sizes="500px" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== AWARDS ===== */}
      <section className="relative w-full bg-white py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#e2ff3a]/[0.08] rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-[1240px] mx-auto">
          <div className="flex flex-col items-center text-center mb-16 reveal">
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4">/ AWARDS & RECOGNITION /</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-stone-950 leading-tight max-w-3xl">
              Recognised for engineering excellence.
            </h2>
            <p className="mt-5 text-stone-500 text-sm sm:text-base font-medium max-w-2xl leading-relaxed">
              Our work has been honoured with industry recognition — a reflection of our commitment to quality,
              innovation and sustainable impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-group">
            {awards.map((a, i) => (
              <div
                key={i}
                className="reveal-item group relative rounded-[28px] bg-gradient-to-b from-stone-50 to-white border border-stone-200/60 shadow-lg overflow-hidden hover:-translate-y-2 transition-all duration-500 flex flex-col"
              >
                <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-stone-200/50 rounded-full px-3 py-1.5 shadow-sm">
                  <span className="text-[#e2c200]"><Icon name="award" className="w-3.5 h-3.5" /></span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-700">{a.tag}</span>
                </div>
                <div className="relative w-full aspect-[3/4] bg-stone-100/60 flex items-center justify-center p-6">
                  <Image src={a.src} alt={`GES Award ${i + 1}`} width={500} height={650} className="max-w-full max-h-full object-contain group-hover:scale-[1.03] transition-transform duration-500 drop-shadow-md" />
                </div>
                <div className="p-6 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-display font-black text-stone-800">Award 0{i + 1}</span>
                  <span className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest">GES</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative w-full bg-[#f8f9fa] pb-24 md:pb-32 px-6 sm:px-12 lg:px-20 overflow-hidden">
        <div className="max-w-[1240px] mx-auto reveal">
          <div className="relative rounded-[36px] bg-gradient-to-r from-[#012716] to-[#023f24] border border-[#00AC4E]/20 shadow-2xl p-8 sm:p-12 lg:p-16 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#00AC4E]/20 rounded-full blur-[100px]" />
            <div className="relative z-10 flex flex-col gap-4 text-center lg:text-left">
              <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight max-w-2xl">
                Ready to build a cleaner, more independent future?
              </h3>
              <p className="text-white/70 font-medium text-sm sm:text-base max-w-xl">
                Let&rsquo;s design an energy solution tailored to your home, business or industry.
              </p>
            </div>
            <Link
              href="/contact"
              className="relative z-10 inline-flex items-center gap-3 bg-[#e2ff3a] text-[#012716] hover:bg-white font-bold rounded-full pl-7 pr-2 py-2.5 shadow-lg active:scale-[0.98] transition-all duration-300 group shrink-0"
            >
              <span className="tracking-wide">Get Consultation</span>
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
