"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight, ArrowRight, Calendar, Clock } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "@/app/components/Preloader";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import LazyVideo from "@/app/components/LazyVideo";
import type { PostSummary } from "@/lib/blog/types";
import { formatPostDate, formatReadTime, initials } from "@/lib/blog/format";
import HeroSlider from "@/app/components/HeroSlider";
import { heroSlides } from "@/data/heroSlides";
import { defaultImageMap, type SiteImageMap } from "@/data/siteImageSlots";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeClient({
  images,
  posts = [],
}: {
  images?: SiteImageMap;
  /** The latest published blog posts (up to three), fetched by page.tsx. */
  posts?: PostSummary[];
}) {
  // Falls back to the shipped images when rendered without CMS data.
  const img = { ...defaultImageMap("homepage"), ...(images ?? {}) };
  // Hero slide artwork is CMS-controlled; the copy stays in heroSlides.ts.
  const slides = heroSlides.map((slide, i) => ({
    ...slide,
    src: img[`hero_slide_${i + 1}`] ?? slide.src,
  }));


  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeService, setActiveService] = useState<number>(0);

  const servicesData = [
    {
      number: "01",
      title: "Solar Installation",
      description: "We offer end-to-end solar installation services, including system design, supply, installation and maintenance of high-quality solar power solutions for homes, businesses and industries, promoting sustainable and cost-effective energy use.",
      image: "/service_installation.webp"
    },
    {
      number: "02",
      title: "Service & Repair",
      description: "We offer professional service and repair solutions for electrical and solar power systems. Our skilled technicians inspect, diagnose and repair faults to ensure reliable performance and safe operation. We also provide preventive maintenance services to reduce downtime, improve efficiency and extend the lifespan of your equipment and systems.",
      image: "/service_repair.webp"
    }
  ];

  useEffect(() => {
    if (isLoading) return;

    // Helper to align vertical timeline line exactly from first dot center to last dot center
    const alignTimelineLine = () => {
      const cards = gsap.utils.toArray(".process-card-trigger") as HTMLElement[];
      const line = containerRef.current?.querySelector(".timeline-line") as HTMLElement;
      if (cards.length > 0 && line) {
        const firstCard = cards[0];
        const lastCard = cards[cards.length - 1];
        const firstDot = firstCard.querySelector(".step-dot") as HTMLElement;
        const lastDot = lastCard.querySelector(".step-dot") as HTMLElement;

        if (firstDot && lastDot) {
          const yFirst = firstCard.offsetTop + firstDot.offsetTop + (firstDot.offsetHeight / 2);
          const yLast = lastCard.offsetTop + lastDot.offsetTop + (lastDot.offsetHeight / 2);
          line.style.top = `${yFirst}px`;
          line.style.height = `${yLast - yFirst}px`;
        }
      }
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Clean, hardware-accelerated entrance pipeline
      tl.fromTo(
        ".inner-dashboard",
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.4 }
      );

      tl.fromTo(
        ".nav-item-anim",
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.04 },
        "-=0.9"
      );

      // ScrollTrigger scroll-driven text entry for new About Us section
      gsap.fromTo(
        ".about-text-anim",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#about",
            start: "top 85%",
            end: "top 45%",
            scrub: true,
          },
        }
      );

      // ScrollTrigger scroll-driven left images stack
      gsap.fromTo(
        ".about-img-left",
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            end: "top 40%",
            scrub: true,
          },
        }
      );

      // ScrollTrigger scroll-driven right images stack (offset)
      gsap.fromTo(
        ".about-img-right",
        { y: 120, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#about",
            start: "top 75%",
            end: "top 35%",
            scrub: true,
          },
        }
      );

      // ScrollTrigger scroll-driven stats row
      gsap.fromTo(
        ".about-stat-anim",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#about",
            start: "top 75%",
            end: "top 45%",
            scrub: true,
          },
        }
      );

      // Bento grid cards stagger entry animation
      gsap.fromTo(
        ".bento-card-anim",
        { opacity: 0, y: 45, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#why-choose-us",
            start: "top 80%",
          },
        }
      );

      // Why Solar stacked card rows stagger entry animation
      gsap.fromTo(
        ".why-solar-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#why-solar",
            start: "top 80%",
          },
        }
      );

      // alignTimelineLine is defined at the useEffect level for broad scope access

      // Run alignment immediately
      alignTimelineLine();

      // Update alignment on resize and scroll refresh to keep it accurate
      window.addEventListener("resize", alignTimelineLine);
      ScrollTrigger.addEventListener("refresh", alignTimelineLine);



      // === PROCESS TIMELINE (must be created AFTER pinned values section) ===
      const processCards = gsap.utils.toArray(".process-card-trigger") as HTMLElement[];

      if (processCards.length > 0) {
        // Get direct DOM reference to the progress filler
        const progressFiller = containerRef.current?.querySelector(".main-progress-filler") as HTMLElement;
        const timelineContainer = containerRef.current?.querySelector(".right-timeline-container") as HTMLElement;

        if (progressFiller && timelineContainer) {
          // Force initial state - absolutely zero height
          progressFiller.style.height = "0%";

          // Scroll-linked process timeline using direct onUpdate for bulletproof control
          ScrollTrigger.create({
            trigger: timelineContainer,
            start: "top 80%",
            end: "bottom 50%",
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              progressFiller.style.height = `${self.progress * 100}%`;
            },
            onLeaveBack: () => {
              progressFiller.style.height = "0%";
            },
            onRefresh: (self) => {
              // Recalculate height on refresh to account for pin spacing from previous section
              progressFiller.style.height = `${self.progress * 100}%`;
            },
          });
        }
      }

      // Checkpoint animation: turn step dot and number to active states when crossed
      processCards.forEach((card: HTMLElement) => {
        const num = card.querySelector(".step-number");
        const dot = card.querySelector(".step-dot");

        if (num) gsap.set(num, { color: "#a8a29e" });
        if (dot) gsap.set(dot, { backgroundColor: "#d6d3d1" });

        ScrollTrigger.create({
          trigger: card,
          start: "top 75%",
          invalidateOnRefresh: true,
          onEnter: () => {
            gsap.to(dot, { backgroundColor: "#00AC4E", duration: 0.25 });
            gsap.to(num, { color: "#1c1917", duration: 0.25 });
          },
          onLeaveBack: () => {
            gsap.to(dot, { backgroundColor: "#d6d3d1", duration: 0.25 });
            gsap.to(num, { color: "#a8a29e", duration: 0.25 });
          }
        });
      });
    }, containerRef);

    // Ensure ScrollTrigger recalculates layout and heights perfectly after mounting
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener("resize", alignTimelineLine);
      ScrollTrigger.removeEventListener("refresh", alignTimelineLine);
      clearTimeout(refreshTimeout);
    };
  }, [isLoading]);

  return (
    // overflow-x-clip: decorative glows must not widen the page on phones
    // (clip, unlike hidden, keeps the sticky nav working).
    <div ref={containerRef} className="w-full min-h-screen bg-[#f8f9fa] flex flex-col overflow-x-clip">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <SiteNav active="home" />

      <HeroSlider slides={slides} />

      {/* SECTION 2: About Us */}
      <section
        id="about"
        className="w-full bg-white text-stone-900 py-16 md:py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-stone-100/80 relative overflow-hidden"
      >
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#00AC4E]/[0.02] rounded-full blur-[130px] pointer-events-none select-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-6 flex flex-col gap-8 about-text-anim">
            <div className="flex flex-col gap-4">
              <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase">
                / ABOUT US /
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-stone-950 leading-tight">
                Global Expertise,<br />
                <span className="text-[#00AC4E]">Local Excellence.</span>
              </h2>
            </div>

            <div className="flex flex-col gap-6 text-stone-600 font-medium text-sm sm:text-base leading-relaxed">
              <p>
                Green Engineering Systems (Pvt) Ltd. is a forward-looking engineering company committed to advancing clean energy and sustainable infrastructure. We specialize in delivering innovative, high-performance solutions that enhance efficiency, reduce environmental impact and drive the transition toward renewable energy.
              </p>
              <p>
                With strong technical expertise and a passion for sustainability our team designs and implements reliable, cost-effective systems tailored to industrial, commercial and institutional needs. At Green Engineering Systems, we combine engineering excellence with environmental responsibility, powering progress through clean energy for a greener, more resilient future.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-5 items-center pt-6 border-t border-stone-100 about-stat-anim">
              <div className="col-span-1 flex flex-col gap-1">
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                  10+
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-400 uppercase tracking-wider leading-tight">
                  Years of Experience
                </span>
              </div>
              <div className="col-span-1 flex justify-center">
                <div className="w-px h-12 bg-stone-200" />
              </div>
              <div className="col-span-1 flex flex-col gap-1">
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                  1,200+
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-400 uppercase tracking-wider leading-tight">
                  Solar Installations
                </span>
              </div>
              <div className="col-span-1 flex justify-center">
                <div className="w-px h-12 bg-stone-200" />
              </div>
              <div className="col-span-1 flex flex-col gap-1">
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                  100%
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-400 uppercase tracking-wider leading-tight">
                  Customer Trust
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Staggered Image Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-6 items-start relative">
            <div className="space-y-6 about-img-left">
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-lg border border-stone-100/50 group/img">
                <Image
                  src={img.home_collage_1}
                  alt="Solar Design and Office Engineering Team"
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-lg border border-stone-100/50 group/img">
                <Image
                  src={img.home_collage_2}
                  alt="Engineers inspecting solar fields"
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

            <div className="space-y-6 pt-12 md:pt-16 about-img-right">
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-lg border border-stone-100/50 group/img">
                <Image
                  src={img.home_collage_3}
                  alt="Advanced Lithium BESS and Inverters Room"
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-lg border border-stone-100/50 group/img">
                <Image
                  src={img.home_collage_4}
                  alt="Modern sustainable office with rooftop solar"
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Why Choose Us (Bento Grid Layout) */}
      <section
        id="why-choose-us"
        className="py-16 px-6 sm:px-12 lg:px-20 bg-white relative overflow-hidden border-t border-stone-100/80"
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-[1.1] text-stone-900 font-display font-black bento-card-anim">
              Why <span className="text-[#00AC4E]">Choose Us</span>
            </h2>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 25s linear infinite;
            }
          `}} />

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[minmax(135px,auto)] lg:auto-rows-[minmax(165px,auto)]">

            {/* Card 1: Main Why Choose Us Intro (takes Col 1-2, Row 1-3) */}
            <div className="col-span-1 md:col-span-2 md:row-span-3 relative rounded-[32px] overflow-hidden bg-stone-50 p-6 sm:p-8 border border-stone-200/60 shadow-lg shadow-stone-100/50 flex flex-col justify-between min-h-[430px] md:min-h-0 bento-card-anim">
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl relative overflow-hidden text-white shadow-md shadow-[#00AC4E]/10 mb-4 shrink-0">
                  {/* Leaf background texture */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/leaf_drops.webp"
                      alt="Green leaf background texture"
                      fill
                      sizes="48px"
                      className="object-cover opacity-50 grayscale brightness-[0.8] contrast-[1.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00AC4E] to-[#00AC4E]/85 z-10" />
                  </div>
                  {/* Glass reflections */}
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_8px_rgba(255,255,255,0.4)] border border-white/10 z-20" />
                  {/* Icon */}
                  <div className="relative z-30 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      {/* Sun rays */}
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                      {/* Solar Panel grid */}
                      <rect x="8" y="8" width="8" height="8" rx="1" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between gap-5 mt-auto">
                <div className="max-w-xl space-y-3">
                  <h3 className="text-2xl md:text-[28px] tracking-tight text-stone-900 leading-tight font-display font-black">
                    10+ Years of Solar<br />Engineering Excellence
                  </h3>
                  <p className="text-xs text-stone-600 md:text-sm leading-relaxed font-semibold text-left">
                    With over 10 years of industry experience, Green Engineering Systems (Pvt) Ltd. combines engineering excellence with sustainability to deliver clean energy solutions that create lasting value. As a registered entity with Sri Lanka Sustainable Energy Authority, we ensure all projects meet the highest environmental and regulatory standards.
                  </p>
                </div>

                {/* Marquee slider of 4 custom images */}
                <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white/50 pt-2 pb-4 px-3.5 backdrop-blur-sm w-full">
                  <div className="flex min-w-max gap-3 animate-marquee hover:[animation-play-state:paused]" aria-hidden="true">
                    {[
                      { src: "/about_solar_rooftop_v3.webp", label: "Rooftop Solar" },
                      { src: "/about_solar_installers_v3.webp", label: "Certified Installers" },
                      { src: "/about_solar_details_v3.webp", label: "Precision Tech" },
                      { src: "/about_solar_farm_v3.webp", label: "Commercial Scale" },
                      // Duplicate for infinite scroll
                      { src: "/about_solar_rooftop_v3.webp", label: "Rooftop Solar" },
                      { src: "/about_solar_installers_v3.webp", label: "Certified Installers" },
                      { src: "/about_solar_details_v3.webp", label: "Precision Tech" },
                      { src: "/about_solar_farm_v3.webp", label: "Commercial Scale" }
                    ].map((item, idx) => (
                      <div key={idx} className="group relative flex w-[220px] shrink-0 flex-col gap-2 cursor-pointer">
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-100 border border-stone-200 shadow-sm">
                          <Image
                            alt={item.label}
                            src={item.src}
                            fill
                            sizes="220px"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-stone-100/95 via-stone-100/70 to-transparent" />
                          <div className="pointer-events-none absolute inset-x-4 bottom-3">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-stone-300 bg-white shadow-sm">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M7 7h10v10"></path>
                                  <path d="M7 17 17 7"></path>
                                </svg>
                              </span>
                              <span className="text-[10.5px] font-black uppercase tracking-wider text-stone-900">
                                {item.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Sustainable Innovation (Col 3, Row 1-2) with video background */}
            <div className="col-span-1 md:col-span-1 md:row-span-2 relative rounded-[32px] overflow-hidden bg-stone-50 text-stone-900 p-6 flex flex-col justify-end group shadow-lg shadow-stone-100/50 border border-stone-200 bento-card-anim min-h-[290px] md:min-h-0">
              <div className="absolute inset-0 z-0 top-0 h-[48%] overflow-hidden rounded-t-[32px]">
                <LazyVideo
                  src="/drone_flyby_solar.mp4"
                  poster="/drone_flyby_solar-poster.webp"
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-50 via-stone-50/80 to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 mt-2 text-left">
                <h3 className="text-xl mb-1.5 tracking-tight font-display font-black text-stone-950">
                  Sustainable Innovation
                </h3>
                <p className="text-stone-500 text-xs md:text-[13px] font-semibold leading-relaxed">
                  We leverage cutting-edge technologies and global best practices to design and implement clean energy systems that are efficient, future-ready, and environmentally responsible.
                </p>
              </div>
            </div>

            {/* Card 3: Proven Expertise (Col 4, Row 1) */}
            <div className="col-span-1 md:col-span-1 row-span-1 relative rounded-[32px] overflow-hidden bg-white text-stone-900 p-6 flex flex-col justify-center shadow-lg shadow-stone-100/50 border border-stone-200 bento-card-anim transition-all duration-300 hover:border-[#00AC4E]/30">
              <div className="relative z-10 text-left">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl relative overflow-hidden text-white shadow-md shadow-[#00AC4E]/10 mb-4 shrink-0">
                  {/* Leaf background texture */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/leaf_drops.webp"
                      alt="Green leaf background texture"
                      fill
                      sizes="44px"
                      className="object-cover opacity-50 grayscale brightness-[0.8] contrast-[1.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00AC4E] to-[#00AC4E]/85 z-10" />
                  </div>
                  {/* Glass reflections */}
                  <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_6px_rgba(255,255,255,0.4)] border border-white/10 z-20" />
                  {/* Icon */}
                  <div className="relative z-30 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="m9 11 2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl mb-1 tracking-tight font-display font-black text-stone-950">
                  Proven Expertise
                </h3>
                <p className="text-stone-500 text-[11px] md:text-xs font-semibold leading-relaxed">
                  Backed by more than a decade of experience, our team of engineers ensures technical precision and excellence in every project.
                </p>
              </div>
            </div>

            {/* Card 4: Tailored Solutions (Col 4, Row 2) */}
            <div className="col-span-1 md:col-span-1 row-span-1 relative rounded-[32px] overflow-hidden bg-white text-stone-900 p-6 flex flex-col justify-center shadow-lg shadow-stone-100/50 border border-stone-200 bento-card-anim transition-all duration-300 hover:border-[#00AC4E]/30">
              <div className="relative z-10 text-left">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl relative overflow-hidden text-white shadow-md shadow-[#00AC4E]/10 mb-4 shrink-0">
                  {/* Leaf background texture */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/leaf_drops.webp"
                      alt="Green leaf background texture"
                      fill
                      sizes="44px"
                      className="object-cover opacity-50 grayscale brightness-[0.8] contrast-[1.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00AC4E] to-[#00AC4E]/85 z-10" />
                  </div>
                  {/* Glass reflections */}
                  <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_6px_rgba(255,255,255,0.4)] border border-white/10 z-20" />
                  {/* Icon */}
                  <div className="relative z-30 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl mb-1 tracking-tight font-display font-black text-stone-950">
                  Tailored Solutions
                </h3>
                <p className="text-stone-500 text-[11px] md:text-xs font-semibold leading-relaxed">
                  We develop customized systems that align with specific operational goals, budgets, and sustainability objectives.
                </p>
              </div>
            </div>

            {/* Card 5: End-to-End Support (Col 3-4, Row 3) with video background */}
            <div className="col-span-1 md:col-span-2 md:row-span-1 relative rounded-[32px] overflow-hidden bg-zinc-950 text-white p-6 py-8 px-8 md:py-10 md:px-10 md:min-h-[185px] flex flex-col sm:flex-row items-center sm:justify-between gap-6 group shadow-xl border border-zinc-800 bento-card-anim text-center sm:text-left">
              <div className="absolute inset-0 z-0">
                <LazyVideo
                  src="/sunset_solar_panels.mp4"
                  poster="/sunset_solar_panels-poster.webp"
                  className="w-full h-full object-cover opacity-65 transition-all duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 flex-1 flex flex-col items-center sm:items-start text-left">
                <h3 className="text-xl mb-1.5 tracking-tight font-display font-black text-[#00AC4E]">
                  End-to-End Support
                </h3>
                <p className="text-zinc-300 text-xs md:text-[13px] font-medium leading-relaxed max-w-lg">
                  From feasibility studies and design to installation, commissioning, and maintenance, we provide complete support throughout the project lifecycle.
                </p>
              </div>
            </div>

          </div>

          {/* Outro Banner */}
          <div className="mt-8 bg-gradient-to-r from-[#012716] to-[#023f24] rounded-[32px] p-6 sm:p-8 lg:p-8 border border-[#00AC4E]/20 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6 text-white bento-card-anim">
            <div className="flex-1 flex flex-col gap-3 text-left">
              <h3 className="text-xl sm:text-2xl font-display font-black tracking-tight leading-tight">
                Quality, safety, and sustainability are embedded in our work culture.
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm font-medium leading-relaxed max-w-4xl">
                We uphold the highest engineering and environmental standards to ensure lasting performance and value. At Green Engineering Systems, we don’t just deliver energy solutions, we build long term partnerships that empower industries, businesses and communities to grow through clean and sustainable energy.
              </p>
            </div>

            <button
              onClick={() => {
                const element = document.getElementById("contact");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-3 bg-white text-[#012716] hover:bg-white/95 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-lg active:scale-[0.98] transition-all shrink-0 cursor-pointer"
            >
              <span>Build a Partnership</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 2.5: Why Solar — Overcoming Sri Lanka's Energy Challenge */}
      <section id="why-solar" className="bg-white text-stone-900 relative z-30 border-t border-stone-100/50 pt-14 md:pt-24">

        {/* Soft Ambient Green and Blue Glows in Background */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary-green/[0.04] rounded-full blur-[130px] pointer-events-none select-none animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/[0.04] rounded-full blur-[130px] pointer-events-none select-none animate-pulse delay-1000" />

        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row relative z-20">

          {/* Left Column: Localized Context & Trust Badges */}
          <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-16 flex flex-col justify-start px-6 py-14 md:px-12 lg:px-20 lg:pt-20 lg:border-r border-stone-200/80">
            <div className="flex flex-col gap-12 max-w-xl">

              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-stone-950 leading-tight">
                Why Solar is a Smart Investment in Sri Lanka.
              </h2>

              <p className="text-stone-500 font-medium text-sm sm:text-base leading-relaxed text-justify">
                With national grid electricity tariffs reaching record highs and commercial fuel costs skyrocketing, energy independence is no longer a luxury—it is a business survival strategy.
                <br /><br />
                As Sri Lanka transitions rapidly towards Electric Vehicles (EVs), home and commercial solar serves as the ultimate, grid-independent fuel station, shielding you from rising costs and power instability while generating long-term wealth.
              </p>

              {/* Sri Lankan Authority & Certification Badges */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-stone-200/80">
                {/* ISO 9001 Badge */}
                <div className="flex items-center gap-4 relative overflow-hidden rounded-2xl p-4 shadow-[0_6px_20px_rgba(0,172,78,0.06)] border border-[#00AC4E]/15 bg-gradient-to-br from-[#00AC4E]/8 to-[#00AC4E]/3 w-full min-h-[84px]">
                  {/* Icon */}
                  <div className="relative z-30 w-11 h-11 rounded-xl bg-[#00AC4E]/10 border border-[#00AC4E]/20 flex items-center justify-center shrink-0">
                    <svg className="w-5.5 h-5.5 text-[#00AC4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                    </svg>
                  </div>

                  {/* Texts */}
                  <div className="flex flex-col relative z-30">
                    <span className="text-[10px] font-bold text-[#00AC4E] uppercase tracking-wider leading-none">Standardized Quality</span>
                    <span className="text-sm font-extrabold text-stone-900 mt-1.5 leading-tight">ISO 9001 : 2015</span>
                  </div>
                </div>

                {/* SLSEA Approved Badge */}
                <div className="flex items-center gap-4 relative overflow-hidden rounded-2xl p-4 shadow-[0_6px_20px_rgba(0,172,78,0.06)] border border-[#00AC4E]/15 bg-gradient-to-br from-[#00AC4E]/8 to-[#00AC4E]/3 w-full min-h-[84px]">
                  {/* Icon */}
                  <div className="relative z-30 w-11 h-11 rounded-xl bg-[#00AC4E]/10 border border-[#00AC4E]/20 flex items-center justify-center shrink-0">
                    <svg className="w-5.5 h-5.5 text-[#00AC4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>

                  {/* Texts */}
                  <div className="flex flex-col relative z-30">
                    <span className="text-[10px] font-bold text-[#00AC4E] uppercase tracking-wider leading-none">Authority Approved</span>
                    <span className="text-sm font-extrabold text-stone-900 mt-1.5 leading-tight">SL SEA Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: List of 6 Benefit Cards */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col">
              {[
                {
                  title: "Cost Savings",
                  desc: "Dramatically lower your monthly utility bill in Rs. (LKR) from day one and lock in cheap energy yields for over 25 years.",
                  icon: (
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-current stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Low Maintenance",
                  desc: "Built with high-end monocrystalline panels and solid-state solar tracking inverters requiring near-zero active maintenance.",
                  icon: (
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-current stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                {
                  title: "Sustainability",
                  desc: "Help offset millions of tons of carbon dioxide (CO2) from coal-fired grids, ensuring complete ESG compliance for your firm.",
                  icon: (
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-current stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V8m0 0a5 5 0 0 1 5-5h2v2a5 5 0 0 1-5 5h-2zm0 4a5 5 0 0 0-5-5H5v2a5 5 0 0 0 5 5h2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h3m-6 0h3" />
                    </svg>
                  )
                },
                {
                  title: "Energy Independence",
                  desc: "Protect your commercial operations from Ceylon Electricity Board grid instability, blackouts, and peak-hour load shedding.",
                  icon: (
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-current stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: "Government Incentives",
                  desc: "Take full advantage of Sri Lanka's CEB Net-Metering, Net-Accounting, or Net-Plus export programs to generate high rupee yield.",
                  icon: (
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-current stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )
                },
                {
                  title: "Increased Property Value",
                  desc: "Elevate your property asset value by incorporating high-efficiency smart-grid assets directly into real estate portfolios.",
                  icon: (
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-current fill-current" viewBox="0 0 256 256">
                      <g>
                        <path d="M224,64V208H32V48H208A16,16,0,0,1,224,64Z" opacity="0.2" fill="currentColor" />
                        <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V156.69l50.34-50.35a8,8,0,0,1,11.32,0L128,132.69,180.69,80H160a8,8,0,0,1,0-16h40a8,8,0,0,1,8,8v40a8,8,0,0,1-16,0V91.31l-58.34,58.35a8,8,0,0,1-11.32,0L96,123.31l-56,56V200H224A8,8,0,0,1,232,208Z" fill="currentColor" />
                      </g>
                    </svg>
                  )
                }
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="why-solar-card group border-b border-stone-200/80 p-6 md:p-8 lg:p-10 hover:bg-stone-50 transition-colors duration-300 min-h-[180px] flex flex-col justify-center gap-5 opacity-0 translate-y-[20px] will-change-transform"
                >
                  <div className="flex justify-between items-start w-full">
                    {/* Glowing Icon Wrapper (Glassy Dark Green Leaf Design) */}
                    <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-2xl relative overflow-hidden text-white shadow-sm shrink-0">
                      {/* Leaf background texture inside the icon! */}
                      <div className="absolute inset-0 z-0">
                        <Image
                          src="/leaf_drops.webp"
                          alt="Green leaf background texture"
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 grayscale brightness-[0.8] contrast-[1.2]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#00AC4E] to-[#00AC4E]/85 z-10" />
                      </div>

                      {/* Glass reflections */}
                      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_8px_rgba(255,255,255,0.35)] border border-white/10 z-20" />

                      {/* Actual SVG Icon */}
                      <div className="relative z-30 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                        {card.icon}
                      </div>
                    </div>
                    {/* Index Number */}
                    <span className="text-stone-300 font-mono text-lg font-bold group-hover:text-[#00AC4E]/60 transition-colors duration-300">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-[#00AC4E] transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4.4: Services Image Slider Section */}
      <section id="services" className="w-full bg-[#08150c] text-white py-16 md:py-24 relative overflow-hidden z-20 border-t border-white/10">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#00AC4E]/[0.03] rounded-full blur-[120px] pointer-events-none select-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#00AC4E]/[0.02] rounded-full blur-[100px] pointer-events-none select-none" />

        <div className="max-w-[1360px] mx-auto px-6 sm:px-12 lg:px-24">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-[3px] h-8 sm:h-10 bg-[#00AC4E] shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-[#00AC4E] font-mono text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                  / WHAT WE DO /
                </span>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black tracking-tight leading-none text-white">
                  Our Services Overview
                </h2>
              </div>
            </div>
            <p className="text-stone-400 text-sm sm:text-base font-semibold max-w-md md:text-right font-display uppercase tracking-wider leading-relaxed">
              (Solar installations, service & repair)
            </p>
          </div>

          {/* Slider Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Column: Text & Navigation */}
            <div className="lg:col-span-5 flex flex-col justify-between min-h-[350px]">
              {/* Navigation Tabs (Quick Switch) */}
              <div className="flex gap-4 border-b border-white/10 pb-6 mb-8">
                {servicesData.map((service, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveService(idx)}
                    className={`pb-2 text-sm sm:text-base font-bold relative transition-colors duration-300 cursor-pointer ${
                      activeService === idx ? "text-white font-black" : "text-stone-500 hover:text-stone-300"
                    }`}
                  >
                    <span>{service.title}</span>
                    {activeService === idx && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00AC4E] animate-ges-underline-in" />
                    )}
                  </button>
                ))}
              </div>

              {/* Content (Active Slide Text) */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black text-[#00AC4E] bg-[#00AC4E]/10 px-2.5 py-1 rounded">
                    SERVICE {servicesData[activeService].number}
                  </span>
                </div>

                <div key={activeService} className="flex flex-col gap-4 animate-ges-fade-up">
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                    {servicesData[activeService].title}
                  </h3>
                  <p className="text-stone-300 text-sm sm:text-base md:text-base font-medium leading-relaxed">
                    {servicesData[activeService].description}
                  </p>
                </div>
              </div>

              {/* Action Button & Slide Navigation Arrows */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-3 bg-[#00AC4E] text-white hover:bg-[#00c258] font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 group cursor-pointer"
                >
                  <span>Book service</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </Link>

                {/* Nav arrows */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveService((prev) => (prev === 0 ? servicesData.length - 1 : prev - 1))}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 active:bg-white/10 text-white cursor-pointer transition-all duration-200"
                    aria-label="Previous service"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveService((prev) => (prev === servicesData.length - 1 ? 0 : prev + 1))}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 active:bg-white/10 text-white cursor-pointer transition-all duration-200"
                    aria-label="Next service"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Image Slider */}
            <div className="lg:col-span-7 relative aspect-[16/10] w-full rounded-[32px] overflow-hidden shadow-2xl border border-white/10 bg-[#0d140e] group/slider">
              {/* Animated image container */}
              <div key={activeService} className="absolute inset-0 w-full h-full animate-ges-fade-zoom">
                <Image
                  src={servicesData[activeService].image}
                  alt={servicesData[activeService].title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover/slider:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
                {/* Overlay gradient to blend nicely */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
              </div>

              {/* Small floating counter in corner */}
              <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono font-bold tracking-widest text-white z-10">
                {servicesData[activeService].number} / {String(servicesData.length).padStart(2, '0')}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4.5: Recreated Process Section */}
      <section className="approach-section-trigger w-full bg-[#f8f9fa] text-stone-900 py-16 md:py-24 relative overflow-hidden border-t border-stone-100/50 z-20">

        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-500/[0.015] rounded-full blur-[130px] pointer-events-none select-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-stone-500/[0.015] rounded-full blur-[130px] pointer-events-none select-none delay-1000" />

        <div className="max-w-[1400px] mx-auto pl-8 pr-6 sm:px-12 md:px-16 lg:px-20 relative z-10">

          {/* Header Block (Full Width, Large Headline) */}
          <div className="flex flex-col items-start mb-16 md:mb-24">
            <span className="font-mono text-xs font-bold text-stone-400 tracking-[0.25em] uppercase mb-6 block">
              /The process/
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black tracking-tight text-stone-900 leading-tight max-w-5xl">
              How we guide every<br className="hidden md:inline" /> single /project to the<br className="hidden md:inline" /> finish line.
            </h2>
          </div>

          {/* Main Content Grid: Sticky Left Quote + Scrolling Right Timeline steps */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Sticky Column: Quote */}
            <div className="col-span-1 lg:col-span-5 lg:sticky lg:top-36 flex flex-col justify-between gap-10 lg:pr-8">
              <div className="flex flex-col gap-6">
                {/* Custom Green Double Quotes */}
                <div className="text-[#00AC4E] font-serif text-[110px] leading-none select-none font-black h-12 -mt-4">
                  “
                </div>
                <p className="text-stone-800 font-display text-lg sm:text-xl font-bold leading-relaxed max-w-sm">
                  Each phase is handled by specialists who work together seamlessly, ensuring nothing falls through the cracks.
                </p>
              </div>
            </div>

            {/* Right Column: Process Steps & Timeline Axis */}
            <div className="col-span-1 lg:col-span-7 flex flex-col relative pl-16 right-timeline-container">
              {/* Single Continuous Vertical Timeline Line */}
              <div className="timeline-line absolute left-8 top-[18px] bottom-[18px] w-[2px] bg-stone-200/60 rounded-full overflow-hidden">
                <div className="main-progress-filler absolute top-0 left-0 w-full h-0 bg-[#00AC4E]" />
              </div>

              {[
                {
                  num: "/001/",
                  badge: "/Assessment",
                  title: "Home Assessment",
                  points: [
                    "Virtual or in-person site evaluation",
                    "Customized solar system design",
                    "Detailed energy savings analysis"
                  ]
                },
                {
                  num: "/002/",
                  badge: "/Quote",
                  title: "Personalized Quote",
                  points: [
                    "System specifications and pricing",
                    "Flexible financing options explained",
                    "Permits and documentation handled"
                  ]
                },
                {
                  num: "/003/",
                  badge: "/Installation",
                  title: "Expert Installation",
                  points: [
                    "Certified solar technicians",
                    "Quick and safe installation",
                    "Quality inspection included"
                  ]
                },
                {
                  num: "/004/",
                  badge: "/Activation",
                  title: "System Activation",
                  points: [
                    "Utility connection and testing",
                    "Monitoring system setup",
                    "Start generating clean solar energy"
                  ]
                }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="process-card-trigger relative pb-16 last:pb-0 flex flex-col items-start"
                >
                  {/* Step Number (positioned to the left of the line) */}
                  <span className="step-number absolute left-[-92px] top-[14px] text-right w-12 font-mono text-[10px] font-bold text-stone-400 py-1 transition-colors duration-300">
                    {step.num}
                  </span>

                  {/* Checkpoint Square (centered exactly on the vertical line) */}
                  <div className="step-dot absolute left-[-36px] top-[18px] w-2.5 h-2.5 bg-stone-300 z-20 rounded-sm transition-colors duration-300" />

                  {/* Content of Step */}
                  <div className="flex flex-col items-start gap-3 mt-1">
                    {/* Green Pill Badge */}
                    <span className="phase-badge px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#00AC4E] text-white">
                      {step.badge}
                    </span>
                    {/* Heading Title */}
                    <h3 className="font-display text-2xl font-black text-stone-900 tracking-tight leading-none">
                      {step.title}
                    </h3>
                    {/* Points list */}
                    <ul className="text-stone-500 text-sm sm:text-base leading-relaxed font-semibold max-w-xl space-y-1.5 list-disc pl-5 mt-1">
                      {step.points.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: Latest Insights (Blog Preview - Redesigned & Widened) */}
      {posts.length > 0 && (
      <section className="w-full bg-[#f8f9fa] text-stone-900 py-20 border-t border-stone-200/40 relative z-20 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-[-100px] -translate-y-1/2 w-[500px] h-[500px] bg-[#00AC4E]/[0.03] rounded-full blur-[140px] pointer-events-none select-none" />
        <div className="absolute bottom-[-100px] right-[10%] w-[600px] h-[400px] bg-[#00AC4E]/[0.02] rounded-full blur-[150px] pointer-events-none select-none" />

        <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 relative z-10">

          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="flex flex-col">
              <h2 className="font-display text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-stone-900 leading-none">
                Clean Energy & Engineering Insights
              </h2>
              <p className="text-stone-500 text-sm sm:text-base md:text-lg font-medium leading-relaxed mt-4 max-w-2xl">
                Explore our latest deep-dive research, grid compliance frameworks, and sustainable energy calculators from our engineering experts.
              </p>
            </div>

            <Link
              href="/blog"
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-stone-200/80 hover:border-[#00AC4E]/30 hover:bg-white text-stone-700 hover:text-[#00AC4E] font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm hover:-translate-y-0.5"
            >
              <span>View All Insights</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid of latest 3 posts (Widened grid with premium gaps) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 xl:gap-12">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white border border-stone-200/50 rounded-[32px] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.015)] hover:shadow-[0_30px_60px_-15px_rgba(0,172,78,0.08)] transition-all duration-500 group flex flex-col justify-between hover:-translate-y-1.5 relative"
              >
                <div className="flex flex-col">
                  {/* Cover Image */}
                  <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
                    {post.cover_url && (
                    <Image
                      src={post.cover_url}
                      alt={post.cover_alt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 46vw, 30vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent" />
                    <span className="absolute top-5 left-5 bg-white/95 backdrop-blur-md border border-stone-200/30 text-stone-700 font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-sm">
                      {post.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 flex flex-col gap-4">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-[10px] font-bold text-stone-400 font-mono tracking-wider leading-none">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {formatPostDate(post.published_at)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-stone-200" />
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {formatReadTime(post.reading_minutes)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl sm:text-2xl font-black text-stone-900 group-hover:text-[#00AC4E] transition-colors duration-300 leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-semibold line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Dynamic Technical Metrics (Stunning Engineering Detail) */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-100">
                      {(post.metrics ?? []).slice(0, 2).map((m, idx) => (
                        <div key={idx} className="bg-stone-50 border border-stone-200/30 rounded-xl px-3 py-2 flex flex-col justify-center">
                          <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest leading-none">{m.label}</span>
                          <span className="text-xs font-black text-stone-700 tracking-tight mt-1">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer details */}
                <div className="px-6 sm:px-8 pb-8 pt-4 border-t border-stone-50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#00AC4E]/5 border border-[#00AC4E]/20 flex items-center justify-center font-bold text-[#00AC4E] text-xs shadow-sm">
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
                    className="flex items-center gap-1.5 text-xs font-bold text-stone-600 group-hover:text-[#00AC4E] transition-colors cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Dynamic Animate-on-Hover accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00AC4E] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </article>
            ))}
          </div>

        </div>
      </section>
      )}

      <SiteFooter id="contact" />

    </div>
  );
}
