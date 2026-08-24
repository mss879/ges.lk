"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wrench, Check, ShieldCheck, Send, Search, AlertTriangle, Cpu, Droplets, Activity, ArrowUpCircle, PlayCircle } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import WebGLBackground from "@/app/components/WebGLBackground";
import {
  maintenanceServices,
  onSiteActivities,
  maintenanceVideo,
  maintenancePoster,
  type MaintenanceIcon,
} from "@/data/maintenance";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const solarChecks = [
  "Check grid parameters (voltage and current)",
  "Visual inspection of solar panels for damage and cleanliness",
  "Inverter status and error monitoring",
  "Inspection of AC/DC wiring conditions",
  "Inspection of AC/DC circuit breakers",
  "Verification of AC/DC surge protection devices",
  "Roof shading assessment",
  "Earthing system inspection",
  "MC4 connector inspection",
  "Inspection of all other system components",
  "Review of historical system production and performance data",
];

const generatorChecks = [
  "Engine oil replacement",
  "Air filter cleaning",
  "Spark plug cleaning",
  "Inspection of wiring and output voltage",
];


const maintenanceIcons: Record<MaintenanceIcon, React.ReactNode> = {
  inspection: <Search className="w-5 h-5" />,
  preventive: <ShieldCheck className="w-5 h-5" />,
  troubleshooting: <AlertTriangle className="w-5 h-5" />,
  inverter: <Cpu className="w-5 h-5" />,
  cleaning: <Droplets className="w-5 h-5" />,
  monitoring: <Activity className="w-5 h-5" />,
  upgrades: <ArrowUpCircle className="w-5 h-5" />,
};

export default function ServicesClient() {
  const root = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", type: "Solar Panel System", details: "" });
  const [sent, setSent] = useState(false);

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
        gsap.fromTo(group.querySelectorAll(".reveal-item"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: group, start: "top 85%" } });
      });
    }, root);
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { ctx.revert(); clearTimeout(t); };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Service & Maintenance Request — ${form.type}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nService Type: ${form.type}\n\nDetails:\n${form.details}`
    );
    window.location.href = `mailto:info@ges.lk?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div ref={root} className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      <SiteNav active="services" />

      {/* HERO */}
      <section className="relative w-full min-h-[70vh] flex items-center overflow-hidden bg-[#04140b]">
        <div className="absolute inset-0 z-0"><WebGLBackground variant="dark" /></div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#04140b] via-[#04140b]/40 to-[#04140b]/70" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-12 lg:px-20 py-28 w-full">
          <span className="hero-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#e2ff3a] mb-7 backdrop-blur-md">
            <Wrench className="w-3.5 h-3.5" /> Service & Maintenance
          </span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.02] max-w-4xl">
            <span className="hero-line block">Keep your system</span>
            <span className="hero-line block">running at <span className="text-[#00E676]">peak performance.</span></span>
          </h1>
          <p className="hero-sub mt-8 text-white/70 font-medium text-base sm:text-lg leading-relaxed max-w-2xl">
            We provide comprehensive service and maintenance solutions to ensure your solar power system and generator
            operate safely, efficiently and reliably throughout their lifespan. Our experienced technicians carry out
            detailed inspections, performance assessments, preventive maintenance and troubleshooting to maximize system
            performance and minimize downtime.
          </p>
          <div className="hero-cta mt-10">
            <a href="#request" className="inline-flex items-center gap-3 bg-[#e2ff3a] text-[#04140b] hover:bg-white font-bold rounded-full pl-6 pr-2 py-2 shadow-lg active:scale-[0.98] transition-all duration-300 group">
              <span className="text-sm tracking-wide">Request Service & Maintenance</span>
              <span className="w-8 h-8 rounded-full bg-[#04140b] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4 text-[#e2ff3a] stroke-[2.5]" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* MAINTENANCE & SERVICES */}
      <section id="maintenance" className="relative w-full bg-white py-20 md:py-24 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden scroll-mt-24">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00AC4E]/[0.04] rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col gap-3.5 max-w-3xl mb-12 reveal">
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ AFTER-SALES & MAINTENANCE /</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-stone-950 leading-none">
              Maintenance &amp; Services
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-medium leading-relaxed">
              Our technicians look after your system long after handover — keeping generation high, catching faults
              early and extending the life of every component.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* main visual */}
            <div className="lg:col-span-6 reveal">
              <div className="relative w-full aspect-video rounded-[24px] overflow-hidden border border-stone-200/60 shadow-xl bg-stone-100">
                {maintenanceVideo ? (
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src={maintenanceVideo}
                    poster={maintenancePoster}
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <>
                    <Image
                      src={maintenancePoster}
                      alt="GES service technicians maintaining a rooftop solar system"
                      fill
                      sizes="(min-width: 1024px) 620px, 92vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 flex items-center gap-2.5">
                      <PlayCircle className="w-5 h-5 text-[#e2ff3a] shrink-0" />
                      <span className="text-white text-xs font-bold tracking-wide">
                        Our service team on site
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* service list */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 reveal-group">
              {maintenanceServices.map((svc) => (
                <div
                  key={svc.name}
                  className="reveal-item rounded-2xl bg-stone-50 border border-stone-200/60 p-5 flex flex-col gap-2.5 hover:bg-white hover:border-[#00AC4E]/30 hover:shadow-md transition-all duration-300"
                >
                  <span className="w-10 h-10 rounded-xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E] shrink-0">
                    {maintenanceIcons[svc.icon]}
                  </span>
                  <h3 className="font-display text-base font-black tracking-tight text-stone-900 leading-snug">{svc.name}</h3>
                  <p className="text-stone-500 text-xs font-medium leading-relaxed">{svc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* on-site activity strip */}
          <div className="mt-12 reveal-group">
            <span className="text-stone-400 font-mono text-[10px] font-bold tracking-[0.2em] uppercase block mb-4">/ On site /</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {onSiteActivities.map((act) => (
                <figure key={act.label} className="reveal-item group relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200/60 bg-stone-100">
                  <Image
                    src={act.image}
                    alt={act.label}
                    fill
                    sizes="(min-width: 1024px) 230px, 45vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-3 text-white text-[11px] font-bold leading-tight">
                    {act.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 reveal flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-[#00AC4E] hover:bg-[#019544] text-white font-bold rounded-full pl-6 pr-2 py-2 shadow-lg active:scale-[0.98] transition-all duration-300 group w-fit"
            >
              <span className="text-sm tracking-wide">Contact Us for Maintenance</span>
              <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
              </span>
            </Link>
            <p className="text-stone-500 text-xs font-semibold">
              Islandwide service · Existing GES systems and third-party installations.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICE CHECKLISTS */}
      <section className="relative w-full bg-white py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00AC4E]/[0.03] rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col items-center text-center mb-16 reveal">
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4">/ WHAT WE INSPECT /</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-950 leading-tight max-w-3xl">
              Thorough, scheduled maintenance — every component covered.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Solar */}
            <div className="reveal rounded-[32px] bg-gradient-to-br from-[#012716] to-[#023f24] text-white p-8 sm:p-10 border border-[#00AC4E]/20 shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-56 h-56 bg-[#00AC4E]/20 rounded-full blur-[90px]" />
              <div className="relative z-10 flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#e2ff3a]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#e2ff3a] font-mono text-[10px] font-bold tracking-widest uppercase">11-Point Check</span>
                  <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight">Solar Panel System Services</h3>
                </div>
              </div>
              <ul className="relative z-10 flex flex-col gap-3 reveal-group">
                {solarChecks.map((c) => (
                  <li key={c} className="reveal-item flex items-start gap-3 text-sm sm:text-[15px] text-white/85 font-medium">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#00AC4E] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Generator */}
            <div className="flex flex-col gap-6">
              <div className="reveal rounded-[32px] bg-stone-50 border border-stone-200/60 shadow-lg p-8 sm:p-10 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E]">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#00AC4E] font-mono text-[10px] font-bold tracking-widest uppercase">Preventive Service</span>
                    <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-stone-950">Generator Services</h3>
                  </div>
                </div>
                <ul className="flex flex-col gap-3 reveal-group">
                  {generatorChecks.map((c) => (
                    <li key={c} className="reveal-item flex items-start gap-3 text-sm sm:text-[15px] text-stone-700 font-semibold">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-[#00AC4E]/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#00AC4E] stroke-[3]" />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="reveal rounded-[32px] bg-white border border-stone-200/60 shadow-lg p-8 flex flex-col sm:flex-row items-center gap-5 justify-between">
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <h4 className="font-display text-lg font-black text-stone-950">Minimize downtime, maximize yield.</h4>
                  <p className="text-stone-500 text-sm font-medium">Preventive O&amp;M keeps your investment performing for 25+ years.</p>
                </div>
                <a href="#request" className="inline-flex items-center gap-2 bg-stone-900 hover:bg-[#00AC4E] text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shrink-0">
                  Book a Visit <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REQUEST FORM */}
      <section id="request" className="relative w-full text-white py-24 md:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden bg-[#04140b] scroll-mt-20">
        <div className="absolute inset-0 z-0 opacity-60"><WebGLBackground variant="dark" /></div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[#04140b] via-[#04140b]/80 to-transparent" />
        <div className="relative z-10 max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col gap-5 reveal">
            <span className="text-[#e2ff3a] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ REQUEST SERVICE /</span>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Request Service &amp; Maintenance
            </h2>
            <p className="text-white/70 font-medium text-sm sm:text-base leading-relaxed">
              Submit a service request and our team will get back to you to schedule an inspection or maintenance visit.
            </p>
            <div className="flex flex-col gap-3 mt-2 text-sm font-semibold text-white/80">
              <a href="tel:0765332332" className="flex items-center gap-3 hover:text-[#e2ff3a] transition-colors">
                <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#e2ff3a]">☎</span>
                076 533 2332
              </a>
              <a href="mailto:info@ges.lk" className="flex items-center gap-3 hover:text-[#e2ff3a] transition-colors">
                <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#e2ff3a]">✉</span>
                info@ges.lk
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 reveal">
            <form onSubmit={submit} className="rounded-[28px] bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl p-6 sm:p-8 flex flex-col gap-4 text-stone-900">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
              </div>
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Service Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00AC4E] focus:ring-1 focus:ring-[#00AC4E]"
                >
                  <option>Solar Panel System</option>
                  <option>Generator</option>
                  <option>Both</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Details</label>
                <textarea
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  rows={3}
                  placeholder="System size, location, issue you're experiencing…"
                  className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold placeholder-stone-400 focus:outline-none focus:border-[#00AC4E] focus:ring-1 focus:ring-[#00AC4E] resize-none"
                />
              </div>
              <button type="submit" className="mt-1 inline-flex items-center justify-center gap-2 bg-[#00AC4E] hover:bg-[#00c258] text-white font-bold text-sm uppercase tracking-widest px-6 py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all">
                <Send className="w-4 h-4" />
                {sent ? "Opening your email…" : "Submit Service Request"}
              </button>
              {sent && (
                <p className="text-xs text-stone-500 text-center font-medium">
                  Your email app should open with the request pre-filled. If it doesn&rsquo;t, email us at info@ges.lk.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00AC4E] focus:ring-1 focus:ring-[#00AC4E]"
      />
    </div>
  );
}
