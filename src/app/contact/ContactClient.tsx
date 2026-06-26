"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Mail, Phone, Clock, Send, Building2, Home } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import WebGLBackground from "@/app/components/WebGLBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const offices = [
  {
    label: "Registered Office",
    icon: <Home className="w-5 h-5" />,
    address: "B/255, Wedamulla Lane, Waragoda, Kelaniya 11600, Sri Lanka",
  },
  {
    label: "Corporate Office",
    icon: <Building2 className="w-5 h-5" />,
    address: "No. 12, Thorana Junction, Kandy Road, Kelaniya 11600, Sri Lanka",
  },
];

const hours = [
  { d: "Monday – Friday", h: "8:30 AM – 5:30 PM" },
  { d: "Saturday", h: "9:00 AM – 1:00 PM" },
  { d: "Sunday & Holidays", h: "Closed" },
];

export default function ContactClient() {
  const root = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .fromTo(".hero-eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.1)
        .fromTo(".hero-line", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.2)
        .fromTo(".hero-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.6);
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(el, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
    }, root);
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { ctx.revert(); clearTimeout(t); };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || "Website Enquiry");
    const body = encodeURIComponent(`Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:info@ges.lk?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const input = "bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold placeholder-stone-400 focus:outline-none focus:border-[#00AC4E] focus:ring-1 focus:ring-[#00AC4E] w-full";

  return (
    <div ref={root} className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      <SiteNav active="contact" />

      {/* HERO */}
      <section className="relative w-full min-h-[56vh] flex items-center overflow-hidden bg-[#04140b]">
        <div className="absolute inset-0 z-0"><WebGLBackground variant="dark" /></div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#04140b] via-[#04140b]/40 to-[#04140b]/70" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-12 lg:px-20 py-24 w-full">
          <span className="hero-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#e2ff3a] mb-7 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2ff3a] animate-pulse" /> Contact Us
          </span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.02] max-w-4xl">
            <span className="hero-line block">Let&rsquo;s power your</span>
            <span className="hero-line block"><span className="text-[#00E676]">next</span> project.</span>
          </h1>
          <p className="hero-sub mt-7 text-white/70 font-medium text-base sm:text-lg leading-relaxed max-w-2xl">
            Questions, quotes or consultations — our team is ready to help you go solar.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="relative w-full bg-white py-20 md:py-28 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00AC4E]/[0.03] rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Info */}
          <div className="lg:col-span-5 flex flex-col gap-6 reveal">
            <div className="flex flex-col gap-2">
              <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ GET IN TOUCH /</span>
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-stone-950 leading-tight">Contact details</h2>
            </div>

            {/* offices */}
            <div className="flex flex-col gap-4">
              {offices.map((o) => (
                <div key={o.label} className="rounded-2xl bg-stone-50 border border-stone-200/60 p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E] shrink-0">{o.icon}</div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-[#00AC4E] uppercase tracking-widest">{o.label}</span>
                    <span className="text-sm font-semibold text-stone-700 leading-relaxed">{o.address}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* email / phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="mailto:info@ges.lk" className="rounded-2xl bg-stone-50 border border-stone-200/60 p-5 flex items-center gap-4 hover:border-[#00AC4E]/30 hover:bg-white transition-all group">
                <div className="w-11 h-11 rounded-xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E] shrink-0"><Mail className="w-5 h-5" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Email</span>
                  <span className="text-sm font-extrabold text-stone-800 group-hover:text-[#00AC4E] transition-colors">info@ges.lk</span>
                </div>
              </a>
              <a href="tel:0765332332" className="rounded-2xl bg-stone-50 border border-stone-200/60 p-5 flex items-center gap-4 hover:border-[#00AC4E]/30 hover:bg-white transition-all group">
                <div className="w-11 h-11 rounded-xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E] shrink-0"><Phone className="w-5 h-5" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Phone</span>
                  <span className="text-sm font-extrabold text-stone-800 group-hover:text-[#00AC4E] transition-colors">076 533 2332</span>
                </div>
              </a>
            </div>

            {/* hours */}
            <div className="rounded-2xl bg-stone-50 border border-stone-200/60 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#00AC4E]/10 border border-[#00AC4E]/15 flex items-center justify-center text-[#00AC4E]"><Clock className="w-5 h-5" /></div>
                <span className="text-sm font-extrabold text-stone-900">Business Hours</span>
              </div>
              <ul className="flex flex-col gap-2">
                {hours.map((h) => (
                  <li key={h.d} className="flex items-center justify-between text-sm">
                    <span className="text-stone-500 font-semibold">{h.d}</span>
                    <span className={`font-bold ${h.h === "Closed" ? "text-stone-400" : "text-stone-800"}`}>{h.h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* social */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mr-1">Follow</span>
              <a href="#" aria-label="Facebook" className="w-11 h-11 rounded-xl bg-stone-900 hover:bg-[#1877F2] text-white flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
              </a>
              <a href="https://wa.me/94765332332" target="_blank" rel="noopener" aria-label="WhatsApp" className="w-11 h-11 rounded-xl bg-stone-900 hover:bg-[#25D366] text-white flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 reveal">
            <form onSubmit={submit} className="rounded-[28px] bg-stone-50 border border-stone-200/60 shadow-lg p-6 sm:p-8 lg:p-10 flex flex-col gap-4">
              <h3 className="font-display text-2xl font-black tracking-tight text-stone-950">Send us a message</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input className={input} placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className={input} placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <input className={input} type="email" placeholder="Email Address" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className={input} placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <textarea className={`${input} resize-none`} rows={5} placeholder="How can we help?" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <button type="submit" className="mt-1 inline-flex items-center justify-center gap-2 bg-[#00AC4E] hover:bg-[#00c258] text-white font-bold text-sm uppercase tracking-widest px-6 py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all">
                <Send className="w-4 h-4" />
                {sent ? "Opening your email…" : "Send Message"}
              </button>
              {sent && <p className="text-xs text-stone-500 text-center font-medium">Your email app should open with the message pre-filled. If not, email info@ges.lk directly.</p>}
            </form>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="relative w-full bg-[#f8f9fa] pb-20 md:pb-28 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80">
        <div className="max-w-[1280px] mx-auto pt-16 reveal">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-[#00AC4E]" />
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-stone-950">Find us in Kelaniya</h2>
          </div>
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-[28px] overflow-hidden border border-stone-200/60 shadow-lg">
            <iframe
              title="GES Corporate Office — Thorana Junction, Kandy Road, Kelaniya"
              src="https://maps.google.com/maps?q=Thorana%20Junction%2C%20Kandy%20Road%2C%20Kelaniya&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full grayscale-[0.2]"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
