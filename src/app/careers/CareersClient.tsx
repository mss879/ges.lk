"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, TrendingUp, HeartHandshake, GraduationCap, Leaf, ArrowUpRight } from "lucide-react";
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

const benefits = [
  { icon: <TrendingUp className="w-6 h-6" />, title: "Real Growth", desc: "Clear progression paths and the chance to grow with a fast-expanding renewable-energy company." },
  { icon: <Leaf className="w-6 h-6" />, title: "Meaningful Impact", desc: "Every project you touch helps cut carbon and bring clean, affordable power to communities." },
  { icon: <HeartHandshake className="w-6 h-6" />, title: "Supportive Team", desc: "Work alongside certified engineers and specialists in a culture built on respect and collaboration." },
  { icon: <GraduationCap className="w-6 h-6" />, title: "Continuous Learning", desc: "Hands-on training on the latest solar, storage and energy technologies." },
];

const areas = [
  { name: "Engineering & Design", roles: "Electrical Engineers · System Designers", icon: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>) },
  { name: "Installation & Technical", roles: "Solar Technicians · Site Supervisors", icon: (<><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2 2.3-2.3z" /></>) },
  { name: "Sales & Business Dev", roles: "Sales Executives · Account Managers", icon: (<><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></>) },
  { name: "Project Management", roles: "Project Coordinators · Planners", icon: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01" /></>) },
  { name: "Service & Maintenance", roles: "O&M Technicians · Support Staff", icon: (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 6 9.4l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 12 4.6V4a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 2.82 1.17l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>) },
  { name: "Operations & Admin", roles: "Procurement · Finance · HR", icon: (<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>) },
];

export default function CareersClient() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .fromTo(".hero-eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.1)
        .fromTo(".hero-line", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.2)
        .fromTo(".hero-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.6)
        .fromTo(".hero-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.8);
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

  const applyHref = "mailto:info@ges.lk?subject=" + encodeURIComponent("Career Application — GES");

  return (
    <div ref={root} className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      <SiteNav active="careers" />

      {/* HERO */}
      <section className="relative w-full min-h-[72vh] flex items-center overflow-hidden bg-[#04140b]">
        <div className="absolute inset-0 z-0"><WebGLBackground variant="dark" /></div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#04140b] via-[#04140b]/40 to-[#04140b]/70" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-12 lg:px-20 py-28 w-full">
          <span className="hero-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#e2ff3a] mb-7 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2ff3a] animate-pulse" /> Careers at GES
          </span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.02] max-w-4xl">
            <span className="hero-line block">Build your career</span>
            <span className="hero-line block">in <span className="text-[#00E676]">clean energy.</span></span>
          </h1>
          <p className="hero-sub mt-8 text-white/70 font-medium text-base sm:text-lg leading-relaxed max-w-2xl">
            Join a team of engineers and innovators powering Sri Lanka&rsquo;s transition to sustainable energy. We&rsquo;re
            always looking for talented, driven people who want their work to matter.
          </p>
          <div className="hero-cta mt-10 flex flex-wrap gap-4">
            <a href="#areas" className="inline-flex items-center gap-3 bg-[#e2ff3a] text-[#04140b] hover:bg-white font-bold rounded-full pl-6 pr-2 py-2 shadow-lg active:scale-[0.98] transition-all duration-300 group">
              <span className="text-sm tracking-wide">Explore Opportunities</span>
              <span className="w-8 h-8 rounded-full bg-[#04140b] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4 text-[#e2ff3a] stroke-[2.5]" />
              </span>
            </a>
            <a href={applyHref} className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm border border-white/20 hover:border-white/40 rounded-full px-6 py-3 transition-all">
              Send your CV <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* WHY GES */}
      <section className="relative w-full bg-white py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00AC4E]/[0.03] rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col items-center text-center mb-16 reveal">
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4">/ WHY GES /</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-950 leading-tight max-w-3xl">
              Work that powers progress.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal-group">
            {benefits.map((b) => (
              <div key={b.title} className="reveal-item rounded-[24px] bg-stone-50 border border-stone-200/60 p-7 shadow-sm hover:border-[#00AC4E]/30 hover:bg-white hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E]">{b.icon}</div>
                <h3 className="font-display text-lg font-black tracking-tight text-stone-900">{b.title}</h3>
                <p className="text-stone-500 text-sm font-medium leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AREAS WE HIRE FOR */}
      <section id="areas" className="relative w-full bg-[#f8f9fa] py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden scroll-mt-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 reveal">
            <div className="flex items-center gap-4">
              <div className="w-[3px] h-10 bg-[#00AC4E] shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ AREAS WE HIRE FOR /</span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-900 leading-none">Find your place</h2>
              </div>
            </div>
            <p className="text-stone-500 text-sm sm:text-base font-semibold max-w-md md:text-right leading-relaxed">
              We&rsquo;re always growing across these teams. Apply and tell us where you&rsquo;d fit best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 reveal-group">
            {areas.map((a) => (
              <a key={a.name} href={applyHref} className="reveal-item group relative rounded-[24px] bg-white border border-stone-200/60 p-7 shadow-lg shadow-stone-100/50 hover:border-[#00AC4E]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4 min-h-[180px]">
                <div className="w-12 h-12 rounded-2xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E]">
                  <Icon d={a.icon} className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1.5 mt-auto">
                  <h3 className="font-display text-lg font-black tracking-tight text-stone-900 group-hover:text-[#00AC4E] transition-colors">{a.name}</h3>
                  <p className="text-stone-500 text-sm font-medium">{a.roles}</p>
                </div>
                <span className="absolute top-7 right-7 text-stone-300 group-hover:text-[#00AC4E] transition-colors flex items-center gap-1 text-xs font-bold">
                  Apply <ArrowUpRight className="w-4 h-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* GENERAL APPLICATION CTA */}
      <section className="relative w-full bg-[#f8f9fa] pb-24 md:pb-32 px-6 sm:px-12 lg:px-20 overflow-hidden">
        <div className="max-w-[1240px] mx-auto reveal">
          <div className="relative rounded-[36px] bg-gradient-to-r from-[#012716] to-[#023f24] border border-[#00AC4E]/20 shadow-2xl p-8 sm:p-12 lg:p-16 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#00AC4E]/20 rounded-full blur-[100px]" />
            <div className="relative z-10 flex flex-col gap-4 text-center lg:text-left">
              <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight max-w-2xl">
                Don&rsquo;t see your exact role? We still want to hear from you.
              </h3>
              <p className="text-white/70 font-medium text-sm sm:text-base max-w-xl">
                Send your CV to <span className="text-[#e2ff3a] font-bold">info@ges.lk</span> and tell us how you&rsquo;d like to contribute.
              </p>
            </div>
            <a href={applyHref} className="relative z-10 inline-flex items-center gap-3 bg-[#e2ff3a] text-[#012716] hover:bg-white font-bold rounded-full pl-7 pr-2 py-2.5 shadow-lg active:scale-[0.98] transition-all duration-300 group shrink-0">
              <span className="tracking-wide">Send your CV</span>
              <span className="w-9 h-9 rounded-full bg-[#012716] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4 text-[#e2ff3a] stroke-[2.5]" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
