"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, BadgeCheck, PackageCheck } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import WebGLBackground from "@/app/components/WebGLBackground";
import { brandCategories, otherProducts, type ProductCard } from "@/data/products";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Shared product card — one consistent design across every section. */
function ProductTile({ product }: { product: ProductCard }) {
  return (
    <article className="reveal-item group rounded-[24px] bg-white border border-stone-200/60 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#00AC4E]/30 transition-all duration-300 flex flex-col">
      <div className="relative aspect-[4/3] bg-stone-100 border-b border-stone-200/60 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
          className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
        />
      </div>
      <div className="p-6 flex flex-col gap-2">
        <h3 className="font-display text-lg font-black tracking-tight text-stone-900 group-hover:text-[#00AC4E] transition-colors">
          {product.name}
        </h3>
        <p className="text-stone-500 text-sm font-medium leading-relaxed">{product.desc}</p>
      </div>
    </article>
  );
}

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
            Inverters by SAJ, solar panels by Haitai Solar and cabling by Solen — supplied and installed with
            genuine warranties, and available for direct retail purchase.
          </p>
        </div>
      </section>

      {/* THREE BRAND-LED CATEGORIES */}
      {brandCategories.map((cat, i) => (
        <section
          key={cat.id}
          id={cat.id}
          className={`relative w-full py-20 md:py-24 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden scroll-mt-24 ${
            i % 2 === 0 ? "bg-white" : "bg-[#f8f9fa]"
          }`}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00AC4E]/[0.04] rounded-full blur-[130px] pointer-events-none" />
          <div className="max-w-[1280px] mx-auto">
            {/* category + brand header */}
            <div className="flex items-start gap-5 mb-12 reveal">
              <span className="font-mono text-sm font-bold text-stone-300 pt-1.5 shrink-0">{cat.index}</span>
              <div className="flex flex-col gap-3.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase">
                    / {cat.category} /
                  </span>
                  {cat.primary && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00AC4E]/10 border border-[#00AC4E]/20 text-[#00AC4E] text-[10px] font-black uppercase tracking-widest">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Our main inverter brand
                    </span>
                  )}
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-stone-950 leading-none">
                  {cat.brand}
                </h2>
                <p className="text-stone-600 text-sm sm:text-base font-medium leading-relaxed">{cat.brief}</p>
              </div>
            </div>

            {/* products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 reveal-group">
              {cat.products.map((p) => (
                <ProductTile key={p.name} product={p} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* OTHER PRODUCTS */}
      <section className="relative w-full bg-white py-20 md:py-24 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-start gap-5 mb-12 reveal">
            <span className="font-mono text-sm font-bold text-stone-300 pt-1.5 shrink-0">04</span>
            <div className="flex flex-col gap-3.5 max-w-3xl">
              <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase">/ Also Available /</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-stone-950 leading-none">
                Other Products
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-medium leading-relaxed">
                Balance-of-system components we supply alongside every installation — and stock for direct purchase.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 reveal-group">
            {otherProducts.map((p) => (
              <ProductTile key={p.name} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* RETAIL CTA */}
      <section className="relative w-full bg-[#f8f9fa] pb-20 md:pb-24 px-6 sm:px-12 lg:px-20 border-t border-stone-100/80 pt-20 md:pt-24 overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal rounded-[28px] bg-gradient-to-r from-[#012716] to-[#023f24] border border-[#00AC4E]/20 shadow-xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#e2ff3a] shrink-0">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight">Buying components for your own project?</h2>
                <p className="text-white/70 text-sm font-medium max-w-2xl">We offer competitive retail pricing on every product above — with genuine warranties and expert advice.</p>
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
