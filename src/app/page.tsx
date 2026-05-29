"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowUpRight, ArrowRight, Battery, Sun, Wind, Thermometer, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const headlineItems = [
    { type: "word", text: "Empowering" },
    { type: "word", text: "Sri" },
    { type: "word", text: "Lanka" },
    { type: "word", text: "with" },
    { type: "word", text: "clean" },
    { type: "word", text: "energy" },
    { type: "pill", src: "/eco_bulb_fill.png", alt: "Clean Energy Icon" },
    { type: "word", text: "we" },
    { type: "word", text: "deliver" },
    { type: "word", text: "innovative" },
    { type: "word", text: "and" },
    { type: "word", text: "eco-friendly" },
    { type: "word", text: "solutions" },
    { type: "word", text: "harnessing" },
    { type: "word", text: "nature's" },
    { type: "word", text: "power" },
    { type: "pill", src: "/eco_globe_fill.png", alt: "Sustainable Globe Icon" },
    { type: "word", text: "to" },
    { type: "word", text: "provide" },
    { type: "word", text: "efficient" },
    { type: "word", text: "and" },
    { type: "word", text: "reliable" },
    { type: "word", text: "systems" },
    { type: "word", text: "that" },
    { type: "word", text: "drive" },
    { type: "word", text: "sustainability." },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeValueIndex, setActiveValueIndex] = useState<number | null>(0);

  const [batteryCharge, setBatteryCharge] = useState(0);
  const [isFilling, setIsFilling] = useState(true);

  // 24-hour detailed generation data for high-density solar yield chart
  const hourlyData = [
    { hour: "12:00 AM", val: 0.0, height: 0 },
    { hour: "01:00 AM", val: 0.0, height: 0 },
    { hour: "02:00 AM", val: 0.0, height: 0 },
    { hour: "03:00 AM", val: 0.0, height: 0 },
    { hour: "04:00 AM", val: 0.0, height: 0 },
    { hour: "05:00 AM", val: 0.1, height: 4 },
    { hour: "06:00 AM", val: 0.4, height: 10 },
    { hour: "07:00 AM", val: 0.9, height: 22 },
    { hour: "08:00 AM", val: 1.8, height: 38 },
    { hour: "09:00 AM", val: 2.9, height: 55 },
    { hour: "10:00 AM", val: 3.8, height: 70 },
    { hour: "11:00 AM", val: 4.8, height: 85 },
    { hour: "12:00 PM", val: 5.4, height: 95 },
    { hour: "01:00 PM", val: 5.8, height: 100 },
    { hour: "02:00 PM", val: 5.5, height: 92 },
    { hour: "03:00 PM", val: 4.6, height: 80 },
    { hour: "04:00 PM", val: 3.4, height: 60 },
    { hour: "05:00 PM", val: 2.1, height: 38 },
    { hour: "06:00 PM", val: 1.1, height: 20 },
    { hour: "07:00 PM", val: 0.4, height: 8 },
    { hour: "08:00 PM", val: 0.1, height: 2 },
    { hour: "09:00 PM", val: 0.0, height: 0 },
    { hour: "10:00 PM", val: 0.0, height: 0 },
    { hour: "11:00 PM", val: 0.0, height: 0 },
  ];

  // Background slow charge / gradual fill-up simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFilling) {
      // Slower, smooth charging animation: 0% -> 100% over 20 seconds (1% every 200ms)
      interval = setInterval(() => {
        setBatteryCharge((prev) => {
          if (prev >= 100) {
            setIsFilling(false);
            return 100;
          }
          return prev + 1;
        });
      }, 200);
    } else {
      // Ambient slow charge: increase by 1% every 8 seconds if under 100%
      interval = setInterval(() => {
        setBatteryCharge((prev) => {
          if (prev < 100) {
            return prev + 1;
          }
          return prev;
        });
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isFilling]);

  const handleBatteryClick = () => {
    if (!isFilling) {
      setBatteryCharge(0);
      setIsFilling(true);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Clean, hardware-accelerated entrance pipeline
      tl.fromTo(
        ".inner-dashboard",
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 1.2 }
      );

      tl.fromTo(
        ".nav-item-anim",
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.04 },
        "-=0.9"
      );

      // Bottom grid staggered entry
      tl.fromTo(
        ".bottom-grid-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
        "-=0.8"
      );

      // Performance optimized horizontal progress bars
      tl.fromTo(
        ".bar-growth",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left",
          duration: 1.2,
          stagger: 0.08,
          ease: "power2.inOut",
        },
        "-=0.5"
      );

      // Performance optimized charging column bars
      tl.fromTo(
        ".vertical-col-grow",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "bottom",
          duration: 1.1,
          stagger: 0.015,
          ease: "elastic.out(1, 0.8)",
        },
        "-=0.9"
      );

      // Weather status pill translations
      tl.fromTo(
        ".weather-pill-grow",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "bottom",
          duration: 1.4,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.9"
      );

      // ScrollTrigger scroll-driven text reveal for Section 2 headline
      gsap.fromTo(
        ".reveal-item",
        { opacity: 0 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: ".headline-trigger",
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
        }
      );

      // ScrollTrigger scroll-driven left column entry (creative scale + rotation + translate)
      gsap.fromTo(
        ".left-column-anim",
        { x: -100, y: 30, rotate: -4, scale: 0.95, opacity: 0 },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".split-grid-trigger",
            start: "top 75%",
            end: "top 45%",
            scrub: true,
          },
        }
      );

      // ScrollTrigger scroll-driven Card 1 entry from left (creative rotate + translate)
      gsap.fromTo(
        ".card-1-anim",
        { x: -140, y: 40, rotate: -6, scale: 0.9, opacity: 0 },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".split-grid-trigger",
            start: "top 75%",
            end: "top 45%",
            scrub: true,
          },
        }
      );

      // ScrollTrigger scroll-driven Card 2 entry from right (creative rotate + translate)
      gsap.fromTo(
        ".card-2-anim",
        { x: 140, y: 40, rotate: 6, scale: 0.9, opacity: 0 },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".split-grid-trigger",
            start: "top 75%",
            end: "top 45%",
            scrub: true,
          },
        }
      );

      // ScrollTrigger scroll-driven Card 3 entry from right (creative rotate + translate)
      gsap.fromTo(
        ".card-3-anim",
        { x: 140, y: 40, rotate: 6, scale: 0.9, opacity: 0 },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".split-grid-trigger",
            start: "top 75%",
            end: "top 45%",
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#f8f9fa] flex flex-col overflow-y-auto overflow-x-hidden">

      {/* SECTION 1: Interactive Dashboard (Hero Fold) */}
      <div className="w-full h-screen min-h-[750px] shrink-0 p-[4px] sm:p-[6px] lg:p-[8px] relative flex items-center justify-center">

        {/* Clip paths for custom shaped panels */}
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <clipPath id="right-card-clip" clipPathUnits="objectBoundingBox">
              <path d="M 1 1 L 1 0 L 0.525 0 Q 0.535 0, 0.539 0.1 L 0.571 0.9 Q 0.575 1, 0.585 1 L 1 1 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Outer Dashboard frame */}
        <div className="inner-dashboard relative opacity-0 w-full h-full bg-[#f8f9fa] rounded-[20px] sm:rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden">

          {/* Full-bleed Hero Background Image */}
          <div className="absolute inset-0 w-full h-full z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full"
            >
              <source src="/Luxury_solar_home_front_view_202605291448.mp4" type="video/mp4" />
            </video>

            {/* Realistic Cloud-like White Fade at the top of the Hero Section */}
            <div className="absolute top-0 left-0 right-0 h-[145px] z-10 pointer-events-none select-none overflow-hidden">
              {/* Solid white at the absolute top edge to prevent hard cuts */}
              <div className="absolute top-0 left-0 w-full h-6 bg-white" />

              {/* Layer 1: Deep dense background clouds */}
              <div className="absolute top-[-20px] left-[-10%] w-[40%] h-[75px] bg-white rounded-[100%] blur-[14px]" />
              <div className="absolute top-[-5px] left-[20%] w-[50%] h-[95px] bg-white rounded-[100%] blur-[16px]" />
              <div className="absolute top-[-25px] left-[60%] w-[50%] h-[80px] bg-white rounded-[100%] blur-[15px]" />

              {/* Layer 2: Defined fluffy mid-ground clouds */}
              <div className="absolute top-[5px] left-[-5%] w-[25%] h-[55px] bg-white rounded-[100%] blur-[10px]" />
              <div className="absolute top-[20px] left-[12%] w-[20%] h-[45px] bg-white rounded-[100%] blur-[6px]" />
              <div className="absolute top-[10px] left-[28%] w-[28%] h-[68px] bg-white rounded-[100%] blur-[10px]" />
              <div className="absolute top-[25px] left-[48%] w-[18%] h-[40px] bg-white rounded-[100%] blur-[6px]" />
              <div className="absolute top-[15px] left-[60%] w-[26%] h-[60px] bg-white rounded-[100%] blur-[10px]" />
              <div className="absolute top-[22px] left-[80%] w-[22%] h-[52px] bg-white rounded-[100%] blur-[8px]" />
              <div className="absolute top-[5px] left-[90%] w-[20%] h-[68px] bg-white rounded-[100%] blur-[10px]" />

              {/* Layer 3: Soft transparent wisps extending lower */}
              <div className="absolute top-[45px] left-[5%] w-[30%] h-[40px] bg-white/60 rounded-[100%] blur-[14px]" />
              <div className="absolute top-[55px] left-[35%] w-[25%] h-[35px] bg-white/50 rounded-[100%] blur-[12px]" />
              <div className="absolute top-[50px] left-[65%] w-[35%] h-[45px] bg-white/55 rounded-[100%] blur-[15px]" />

              {/* Global soft gradient blend for cohesion */}
              <div className="absolute top-0 left-0 w-full h-[110px] bg-gradient-to-b from-white via-white/50 to-transparent mix-blend-normal" />
            </div>

            {/* White Cutout SVG Overlay at bottom-left with a gorgeous, sharp, perfectly parallel bezel gap */}
            <div className="absolute bottom-[-2px] left-[-2px] w-[calc(100%+4px)] h-[15%] sm:h-[12.5%] z-10 text-[#f8f9fa] pointer-events-none">
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-lg">
                {/* Proportional Outer Bezel gap fill (matches background color) with sharp fillets, leaving right card body transparent */}
                <path d="M 0 100 L 0 0 L 525 0 Q 535 0, 539 10 L 571 90 Q 575 100, 585 100 L 0 100 Z" fill="currentColor" />
                {/* Perfectly parallel Pure White Trust Card inside with sharp fillets (starts at y=0, no top gap) */}
                <path d="M 0 100 L 0 0 L 510 0 Q 520 0, 524 10 L 556 90 Q 560 100, 570 100 L 0 100 Z" fill="#ffffff" />

                {/* Right container glass background fill matching the exact shape */}
                <path d="M 1000 100 L 1000 0 L 525 0 Q 535 0, 539 10 L 571 90 Q 575 100, 585 100 Z" fill="rgba(34,197,94,0.12)" />
                {/* Right container top/left stroke matching the exact slope and fillets */}
                <path d="M 1000 0 L 525 0 Q 535 0, 539 10 L 571 90 Q 575 100, 585 100" fill="none" stroke="rgba(34,197,94,0.4)" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Trust Logos Content Container (Absolute positioned exactly over the SVG - clipped dynamically to match the beveled card edges perfectly) */}
            <div
              className="absolute bottom-[-2px] left-[-2px] w-[calc(100%+4px)] h-[15%] sm:h-[12.5%] z-20 px-6 sm:px-10 pb-2.5 pt-5 flex flex-col justify-center pointer-events-auto"
              style={{ clipPath: "polygon(0% 100%, 0% 0%, 51% 0%, 57% 100%)" }}
            >
              <span className="text-stone-400 font-display font-bold text-[9px] sm:text-[10px] uppercase tracking-widest mb-2">trusted by</span>

              {/* Infinite Scrolling Logo Carousel */}
              <div className="relative w-[82%] sm:w-[74%] md:w-[60%] lg:w-[53%] overflow-hidden py-1">
                <div className="animate-logo-scroll flex items-center gap-16 pr-16">
                  {/* Set 1 */}
                  <img src="/logos-carosel/Asset-1@4x-3-scaled.png" alt="Client Logo 1" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-scaled.png" alt="Client Logo 2" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-4-2@4x-scaled.png" alt="Client Logo 3" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-copy-scaled.png" alt="Client Logo 4" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />

                  {/* Set 2 */}
                  <img src="/logos-carosel/Asset-1@4x-3-scaled.png" alt="Client Logo 1 Set 2" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-scaled.png" alt="Client Logo 2 Set 2" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-4-2@4x-scaled.png" alt="Client Logo 3 Set 2" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-copy-scaled.png" alt="Client Logo 4 Set 2" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />

                  {/* Set 3 */}
                  <img src="/logos-carosel/Asset-1@4x-3-scaled.png" alt="Client Logo 1 Set 3" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-scaled.png" alt="Client Logo 2 Set 3" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-4-2@4x-scaled.png" alt="Client Logo 3 Set 3" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-copy-scaled.png" alt="Client Logo 4 Set 3" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />

                  {/* Set 4 */}
                  <img src="/logos-carosel/Asset-1@4x-3-scaled.png" alt="Client Logo 1 Set 4" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-scaled.png" alt="Client Logo 2 Set 4" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-4-2@4x-scaled.png" alt="Client Logo 3 Set 4" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-copy-scaled.png" alt="Client Logo 4 Set 4" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />

                  {/* Set 5 */}
                  <img src="/logos-carosel/Asset-1@4x-3-scaled.png" alt="Client Logo 1 Set 5" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-scaled.png" alt="Client Logo 2 Set 5" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-4-2@4x-scaled.png" alt="Client Logo 3 Set 5" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-copy-scaled.png" alt="Client Logo 4 Set 5" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />

                  {/* Set 6 */}
                  <img src="/logos-carosel/Asset-1@4x-3-scaled.png" alt="Client Logo 1 Set 6" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-scaled.png" alt="Client Logo 2 Set 6" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-4-2@4x-scaled.png" alt="Client Logo 3 Set 6" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                  <img src="/logos-carosel/Asset-3@4x-4-copy-scaled.png" alt="Client Logo 4 Set 6" className="h-8 sm:h-9 w-auto object-contain brightness-90 opacity-70 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* Right Side Energy Metrics (Absolute positioned, mirroring the left bezel) */}
            <div className="absolute bottom-[-2px] left-[-2px] w-[calc(100%+4px)] h-[15%] sm:h-[12.5%] z-20 pointer-events-none hidden md:block">
              <div
                className="absolute inset-0 bg-primary-green/8 backdrop-blur-3xl pointer-events-auto flex justify-end items-center pr-6 sm:pr-10 transition-all duration-500"
                style={{ clipPath: "url(#right-card-clip)" }}
              >
                {/* Perfectly balanced fluid-width content deck that dynamically fills 100% of the available space in the green card */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-between pl-[61%] sm:pl-[60%] lg:pl-[59%] xl:pl-[58.5%] pr-6 sm:pr-10 pointer-events-auto">

                  {/* Unified System Analytics Deck */}
                  <div className="flex items-center justify-between gap-6 lg:gap-8 w-full h-full pt-[2%] pb-[1%]">

                    {/* Left Block: Power Storage (Battery) */}
                    <div
                      onClick={handleBatteryClick}
                      className="flex-1 flex flex-col justify-center h-full cursor-pointer select-none group/battery min-w-[140px] sm:min-w-[180px] lg:min-w-[200px]"
                    >
                      <span className="text-white/60 font-bold font-display text-[9px] sm:text-[10px] xl:text-[11px] tracking-widest uppercase mb-1.5 transition-colors group-hover/battery:text-white/95 text-left">
                        Power Storage
                      </span>
                      <div className="flex items-center gap-3 lg:gap-4 xl:gap-6">
                        {/* Scaled Battery Cell */}
                        <div className="relative shrink-0 w-[64px] sm:w-[72px] lg:w-[84px] xl:w-[96px] h-[30px] sm:h-[34px] lg:h-[40px] xl:h-[44px] bg-black/40 border border-white/15 rounded-lg p-[2px] lg:p-[3px] flex items-center shadow-inner group-hover/battery:border-primary-green/50 transition-all duration-500">
                          <div
                            className={`h-full rounded-[5px] transition-all duration-300 bg-gradient-to-r ${batteryCharge < 20
                              ? "from-red-500 to-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                              : batteryCharge < 50
                                ? "from-amber-500 to-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                                : "from-green-500 to-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                              }`}
                            style={{ width: `${batteryCharge}%` }}
                          />
                          <div className="absolute -right-[3px] lg:-right-[4px] top-1/2 -translate-y-1/2 w-[2px] lg:w-[3px] h-[8px] lg:h-[12px] bg-white/30 rounded-r border-r border-t border-b border-white/20" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <svg
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-white drop-shadow-[0_1px_4px_rgba(255,255,255,0.7)] transition-all duration-300 ${isFilling || (batteryCharge > 0 && batteryCharge < 100) ? "animate-pulse scale-110" : "opacity-80"
                                }`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11 21h-1l1-7H7.5c-.3 0-.5-.1-.6-.3-.1-.2-.1-.5.1-.7l6-9h1l-1 7h3.5c.3 0 .5.1.6.3.1.2.1.5-.1.7l-6 9z" />
                            </svg>
                          </div>
                        </div>

                        {/* Percentage & Load column */}
                        <div className="flex flex-col justify-center leading-none">
                          <div className="flex items-baseline">
                            <span className="font-display font-black text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-white tracking-tight">
                              {batteryCharge}
                            </span>
                            <span className="text-[10px] sm:text-xs xl:text-sm font-extrabold text-white/80 ml-0.5">%</span>
                          </div>
                          <span className="text-[8px] sm:text-[9px] xl:text-[10px] text-stone-300 font-mono tracking-wide mt-1 uppercase">
                            {isFilling ? "+24.5 kW" : batteryCharge >= 100 ? "0.0 kW" : "+2.8 kW"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* High-Tech Vertical Divider Connector */}
                    <div className="w-px h-[45%] bg-gradient-to-b from-transparent via-white/20 to-transparent shrink-0 mx-3 lg:mx-5 xl:mx-8" />

                    {/* Right Block: Live Generation Chart */}
                    <div className="flex-1 flex flex-col justify-center h-full group/yield cursor-pointer min-w-[160px] sm:min-w-[200px] lg:min-w-[240px]">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-white/60 font-bold font-display text-[9px] sm:text-[10px] xl:text-[11px] tracking-widest uppercase transition-colors group-hover/yield:text-white/95">
                          {hoveredBarIndex !== null ? "Live Yield" : "Daily Yield"}
                        </span>
                        <span className="text-white font-black font-display text-[10px] sm:text-[11px] xl:text-xs tracking-wider bg-white/10 px-2 py-0.5 rounded-md leading-none select-none transition-all duration-300 hover:bg-white/20">
                          {hoveredBarIndex !== null ? (
                            <>
                              {hourlyData[hoveredBarIndex].val.toFixed(1)} <span className="text-[8px] xl:text-[9px] text-white/80 font-bold">kW</span>
                            </>
                          ) : (
                            <>
                              24.8 <span className="text-[8px] xl:text-[9px] text-white/80 font-bold">kWh</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Chart Container (Fluid-scaling heights) */}
                      <div className="h-8 lg:h-12 xl:h-[60px] 2xl:h-[72px] flex items-end gap-[2px] xl:gap-[3px] w-full mt-1">
                        {hourlyData.map((data, i) => {
                          const isHovered = hoveredBarIndex === i;
                          return (
                            <div
                              key={i}
                              className="vertical-col-grow flex-1 rounded-[1px] bg-black/25 shadow-inner relative cursor-pointer"
                              style={{ height: "100%" }}
                              onMouseEnter={() => setHoveredBarIndex(i)}
                              onMouseLeave={() => setHoveredBarIndex(null)}
                            >
                              <div
                                className={`w-full h-full rounded-[1px] transition-all duration-200 ${isHovered
                                  ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] scale-110 z-10"
                                  : i % 2 === 0
                                    ? "bg-primary-green/90"
                                    : "bg-[#f1c40f]/90"
                                  }`}
                                style={{ height: `${data.height}%` }}
                              />
                              {/* Ambient light glow behind hovered bar */}
                              {isHovered && (
                                <div className="absolute inset-0 bg-white/20 blur-[4px] rounded-full -z-10 animate-pulse" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Foreground Content Wrapper */}
          <div className="relative z-20 w-full h-full p-4 sm:p-5 lg:p-7 flex flex-col justify-between">

            {/* Navigation Header (High-end, split layout with centered logo) */}
            <header className="relative z-[100] transform-gpu flex-none flex items-center justify-between pb-4 pt-0 -mt-2 lg:-mt-3 border-b border-white/10 w-full px-4 lg:px-8">

              {/* Mobile spacer to balance hamburger and keep logo centered */}
              <div className="flex lg:hidden flex-1" />

              {/* Left Section: Navigation Links */}
              <nav className="hidden lg:flex items-center gap-4 lg:gap-6 xl:gap-10 2xl:gap-12 flex-1 justify-end pr-4 lg:pr-6 xl:pr-10 whitespace-nowrap">
                {/* Home */}
                <div className="nav-item-anim opacity-0 relative py-2 cursor-pointer group">
                  <button
                    onClick={() => setActiveTab("Home")}
                    className={`text-sm lg:text-[15px] xl:text-base 2xl:text-[17px] font-bold cursor-pointer transition-colors duration-300 ${activeTab === "Home" ? "text-stone-900 font-extrabold" : "text-stone-700 hover:text-primary-green"
                      }`}
                  >
                    Home
                  </button>
                  <div className={`absolute bottom-[0px] left-0 h-[3px] bg-primary-green transition-all duration-300 ${activeTab === "Home" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"}`} />
                </div>

                {/* About Us */}
                <div className="nav-item-anim opacity-0 relative py-2 cursor-pointer group">
                  <button
                    onClick={() => setActiveTab("About Us")}
                    className={`text-sm lg:text-[15px] xl:text-base 2xl:text-[17px] font-bold cursor-pointer transition-colors duration-300 ${activeTab === "About Us" ? "text-stone-900 font-extrabold" : "text-stone-700 hover:text-primary-green"
                      }`}
                  >
                    About Us
                  </button>
                  <div className={`absolute bottom-[0px] left-0 h-[3px] bg-primary-green transition-all duration-300 ${activeTab === "About Us" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"}`} />
                </div>

                {/* Solutions Dropdown */}
                <div
                  className="nav-item-anim opacity-0 relative py-4 -my-2"
                  onMouseEnter={() => setActiveDropdown("Solutions")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className={`flex items-center gap-1.5 text-sm lg:text-[15px] xl:text-base 2xl:text-[17px] font-bold transition-colors cursor-pointer ${["Residential Solar", "Commercial & Industrial", "Utility-Scale Systems", "Energy Storage"].includes(activeTab) ? "text-stone-900 font-extrabold" : "text-stone-700 hover:text-primary-green"
                    }`}>
                    Solutions
                    <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === "Solutions" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {activeDropdown === "Solutions" && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[100] w-[800px] xl:w-[850px] cursor-default pointer-events-auto whitespace-normal">
                      <div className="bg-white/95 backdrop-blur-3xl border border-white/60 rounded-[28px] p-2.5 flex shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.03)]">

                        {/* Left: Featured Banner */}
                        <div className="w-[280px] relative overflow-hidden rounded-[20px] bg-stone-900 p-6 flex flex-col justify-between group/feature cursor-pointer border border-stone-800 shadow-inner">
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-green/20 via-transparent to-transparent opacity-50 group-hover/feature:opacity-100 transition-opacity duration-700"></div>
                          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary-green/30 rounded-full blur-[60px] group-hover/feature:bg-primary-green/40 group-hover/feature:scale-110 transition-all duration-700"></div>

                          <div className="relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[9px] font-bold tracking-wider uppercase text-white/90 backdrop-blur-md mb-6 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                              Ecosystem
                            </div>
                            <h3 className="font-display text-2xl font-extrabold text-white mb-2 leading-tight drop-shadow-sm">
                              Total Energy <br /> Independence
                            </h3>
                            <p className="text-stone-400 text-xs font-medium leading-relaxed pr-2">
                              Explore how our interconnected solar arrays, battery storage, and smart apps work seamlessly together.
                            </p>
                          </div>

                          <div className="relative z-10 flex items-center gap-3 mt-8">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md group-hover/feature:bg-primary-green group-hover/feature:text-white transition-colors duration-300 border border-white/10">
                              <ArrowRight className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs font-bold text-white group-hover/feature:text-primary-green transition-colors duration-300">
                              View Ecosystem
                            </span>
                          </div>
                        </div>

                        {/* Right: Grid of Solutions */}
                        <div className="flex-1 grid grid-cols-2 gap-1.5 pl-2.5">
                          {[
                            {
                              name: "Residential Solar",
                              desc: "Sleek rooftop solar & battery integration for modern smart homes.",
                              icon: (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                              )
                            },
                            {
                              name: "Commercial & Industrial",
                              desc: "High-efficiency commercial microgrids & industrial solar arrays.",
                              icon: (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              )
                            },
                            {
                              name: "Utility-Scale Systems",
                              desc: "Gigawatt grid-tied solar fields & deep transmission infrastructure.",
                              icon: (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              )
                            },
                            {
                              name: "Energy Storage",
                              desc: "Intelligent battery backup stations & power grid optimization.",
                              icon: (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
                                </svg>
                              )
                            }
                          ].map((item) => (
                            <button
                              key={item.name}
                              onClick={() => {
                                setActiveTab(item.name);
                                setActiveDropdown(null);
                              }}
                              className={`group/card relative p-4 rounded-[20px] transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-center text-left ${activeTab === item.name
                                ? "bg-primary-green/5"
                                : "hover:bg-stone-50/80"
                                }`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-primary-green/[0.03] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                              <div className="relative z-10 flex gap-4 items-start">
                                <div className={`mt-0.5 shrink-0 flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-500 shadow-sm border ${activeTab === item.name
                                  ? "bg-primary-green text-white border-primary-green/20 shadow-primary-green/20"
                                  : "bg-white text-stone-500 border-stone-200/60 group-hover/card:text-primary-green group-hover/card:border-primary-green/20 group-hover/card:shadow-md group-hover/card:-translate-y-0.5"
                                  }`}>
                                  {item.icon}
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className={`font-display text-[15px] font-extrabold tracking-wide transition-colors duration-300 ${activeTab === item.name ? "text-primary-green" : "text-stone-900 group-hover/card:text-primary-green"
                                      }`}>
                                      {item.name}
                                    </h4>
                                    <ArrowUpRight className={`w-3.5 h-3.5 transition-all duration-500 ${activeTab === item.name
                                      ? "text-primary-green opacity-100 translate-x-0 translate-y-0"
                                      : "text-stone-300 opacity-0 -translate-x-2 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 group-hover/card:translate-y-0 group-hover/card:text-primary-green"
                                      }`} />
                                  </div>
                                  <p className="text-[11px] text-stone-500 font-medium leading-relaxed pr-2">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </nav>

              {/* Center Section: Logo */}
              <div className="nav-item-anim opacity-0 relative z-50 transform-gpu flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="GES Logo"
                  width={190}
                  height={55}
                  priority
                  className="h-12 xl:h-14 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setActiveTab("Home")}
                />
              </div>

              {/* Right Section: Navigation Links & Contact Button */}
              <nav className="hidden lg:flex items-center gap-4 lg:gap-6 xl:gap-10 2xl:gap-12 flex-1 justify-start pl-4 lg:pl-6 xl:pl-10 whitespace-nowrap">
                {/* Products */}
                <div className="nav-item-anim opacity-0 relative py-2 cursor-pointer group">
                  <button
                    onClick={() => setActiveTab("Products")}
                    className={`text-sm lg:text-[15px] xl:text-base 2xl:text-[17px] font-bold cursor-pointer transition-colors duration-300 ${activeTab === "Products" ? "text-stone-900 font-extrabold" : "text-stone-700 hover:text-primary-green"
                      }`}
                  >
                    Products
                  </button>
                  <div className={`absolute bottom-[0px] left-0 h-[3px] bg-primary-green transition-all duration-300 ${activeTab === "Products" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"}`} />
                </div>

                {/* Projects */}
                <div className="nav-item-anim opacity-0 relative py-2 cursor-pointer group">
                  <button
                    onClick={() => setActiveTab("Projects")}
                    className={`text-sm lg:text-[15px] xl:text-base 2xl:text-[17px] font-bold cursor-pointer transition-colors duration-300 ${activeTab === "Projects" ? "text-stone-900 font-extrabold" : "text-stone-700 hover:text-primary-green"
                      }`}
                  >
                    Projects
                  </button>
                  <div className={`absolute bottom-[0px] left-0 h-[3px] bg-primary-green transition-all duration-300 ${activeTab === "Projects" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"}`} />
                </div>

                {/* Contact Button */}
                <div className="nav-item-anim opacity-0 items-center justify-start relative z-50 transform-gpu ml-1 lg:ml-2">
                  <div className="flex items-center gap-4 pl-2">
                    <button className="flex items-center justify-center w-[38px] h-[38px] bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-gray-200 text-gray-500 hover:text-primary-green shadow-sm cursor-pointer" title="Search (Cmd+K)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
                    </button>
                    <button
                      onClick={() => setActiveTab("Contact")}
                      className="relative group/btn text-[13px] font-bold tracking-widest uppercase text-white overflow-hidden rounded-xl px-6 py-3 transition-transform hover:-translate-y-0.5 active:translate-y-0 duration-300 bg-gradient-to-b from-green-600 to-green-700 shadow-[0_6px_20px_rgba(21,128,61,0.4),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_6px_rgba(0,0,0,0.2)] border border-white/20 backdrop-blur-md cursor-pointer"
                    >
                      <span className="relative z-10 drop-shadow-sm">Contact</span>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-0"></div>
                      <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_10px_rgba(255,255,255,0.3)] z-0"></div>
                    </button>
                  </div>
                </div>
              </nav>

              {/* Mobile hamburger menu (visible strictly below lg) */}
              <div className="flex flex-1 justify-end lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="nav-item-anim opacity-0 bg-stone-900/10 hover:bg-stone-900/20 active:bg-stone-900/30 border border-stone-900/10 w-11 h-11 rounded-full flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 z-50 relative"
                  aria-label="Toggle Menu"
                >
                  <div className={`w-4.5 h-0.5 bg-stone-950 rounded-full transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                  <div className={`w-4.5 h-0.5 bg-stone-950 rounded-full transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
                  <div className={`w-4.5 h-0.5 bg-stone-950 rounded-full transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
              </div>

            </header>

            {/* Middle Spacer */}
            <div className="flex-1" />

            {/* Bottom Grid layout (Mobile Only now, Desktop is embedded in the absolute SVG container) */}
            <div className="md:hidden">
              <section className="flex-none grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 pt-2 relative z-20">

                {/* col-span-7 acts as a completely transparent spacer for the absolute trust logos below */}
                <div className="hidden md:block md:col-span-7 h-[140px] pointer-events-none" />

                {/* Right side cards container (Estimated Full & Weather) */}
                <div className="md:col-span-5 grid grid-cols-2 gap-3 sm:gap-5">

                  {/* Card 2: Solar Yield */}
                  <div className="bottom-grid-card opacity-0 bg-primary-green/15 backdrop-blur-2xl border border-primary-green/30 rounded-[24px] shadow-[0_8px_32px_0_rgba(34,197,94,0.15)] p-4 flex flex-col justify-between min-h-[140px] transition-transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white/90 font-bold font-display text-[11px] sm:text-sm lg:text-[15px] tracking-wide">
                        {hoveredBarIndex !== null ? "Live Generation" : "Daily Yield"}
                      </span>
                      <div className="p-1 rounded-lg bg-white/10 text-white/80 cursor-pointer hover:bg-white hover:text-stone-900 transition-colors">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h2 className="font-display font-extrabold text-xl text-white leading-none flex items-baseline">
                        {hoveredBarIndex !== null ? (
                          <>
                            {hourlyData[hoveredBarIndex].val.toFixed(1)}
                            <span className="text-xs sm:text-sm font-bold ml-1 text-white/80">kW</span>
                          </>
                        ) : (
                          <>
                            24.8
                            <span className="text-xs sm:text-sm font-bold ml-1 text-white/80">kWh</span>
                          </>
                        )}
                      </h2>
                      <span className="text-[9px] sm:text-[10px] text-stone-300 font-mono tracking-wide leading-tight truncate">
                        {hoveredBarIndex !== null
                          ? `Time: ${hourlyData[hoveredBarIndex].hour}`
                          : "Peak output: 5.8 kW at 1:00 PM"
                        }
                      </span>

                      <div className="h-12 flex items-end gap-[2px] w-full mt-2">
                        {hourlyData.map((data, i) => {
                          const isHovered = hoveredBarIndex === i;
                          return (
                            <div
                              key={i}
                              className="vertical-col-grow flex-1 rounded-sm bg-black/20 shadow-inner cursor-pointer relative"
                              style={{ height: "100%" }}
                              onMouseEnter={() => setHoveredBarIndex(i)}
                              onMouseLeave={() => setHoveredBarIndex(null)}
                            >
                              <div
                                className={`w-full h-full rounded-sm transition-all duration-200 ${isHovered
                                  ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-110"
                                  : i % 2 === 0
                                    ? "bg-primary-green"
                                    : "bg-[#f1c40f]"
                                  }`}
                                style={{ height: `${data.height}%` }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Battery Storage */}
                  <div
                    onClick={handleBatteryClick}
                    className="bottom-grid-card opacity-0 bg-primary-green/15 backdrop-blur-2xl border border-primary-green/30 rounded-[24px] shadow-[0_8px_32px_0_rgba(34,197,94,0.15)] p-4 flex flex-col justify-between min-h-[140px] transition-transform hover:-translate-y-1 cursor-pointer select-none group/battery"
                  >
                    {/* Title & Arrow */}
                    <div className="flex justify-between items-start">
                      <span className="text-white/90 font-bold font-display text-[11px] sm:text-sm lg:text-[15px] tracking-wide">
                        Battery Storage
                      </span>
                      <div className="p-1 rounded-lg bg-white/10 text-white/80 group-hover/battery:bg-white group-hover/battery:text-stone-900 transition-colors">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Battery Visual & Percentage Row */}
                    <div className="flex items-center gap-3 my-2">
                      {/* Interactive Battery Cell */}
                      <div className="relative flex-none w-[80px] h-[36px] bg-black/40 border border-white/15 rounded-lg p-[3px] flex items-center shadow-inner group-hover/battery:border-primary-green/40 transition-all duration-300">
                        {/* Active Fluid Fill */}
                        <div
                          className={`h-full rounded-[5px] transition-all duration-300 bg-gradient-to-r ${batteryCharge < 20
                            ? "from-red-500 to-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                            : batteryCharge < 50
                              ? "from-amber-500 to-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                              : "from-green-500 to-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                            }`}
                          style={{ width: `${batteryCharge}%` }}
                        />

                        {/* Battery Positive Cap (Right Tip) */}
                        <div className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-[3px] h-[12px] bg-white/30 rounded-r border-r border-t border-b border-white/20" />

                        {/* Central Lightning Bolt Icon */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg
                            className={`w-4 h-4 text-white drop-shadow-[0_1px_4px_rgba(255,255,255,0.7)] transition-all duration-300 ${isFilling || (batteryCharge > 0 && batteryCharge < 100) ? "animate-pulse scale-110" : "opacity-80"
                              }`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11 21h-1l1-7H7.5c-.3 0-.5-.1-.6-.3-.1-.2-.1-.5.1-.7l6-9h1l-1 7h3.5c.3 0 .5.1.6.3.1.2.1.5-.1.7l-6 9z" />
                          </svg>
                        </div>
                      </div>

                      {/* Percentage Readout */}
                      <div className="flex flex-col justify-center leading-none">
                        <div className="flex items-baseline">
                          <span className="font-display font-extrabold text-2xl text-white tracking-tight">
                            {batteryCharge}
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold text-white/80 ml-0.5">%</span>
                        </div>

                        <span className="text-[8px] sm:text-[9px] text-stone-300 font-mono tracking-wide mt-0.5 truncate uppercase">
                          {isFilling ? "Recharging" : batteryCharge >= 100 ? "Balanced" : "Charging"}
                        </span>
                      </div>
                    </div>

                    {/* Subtext Status & Load Output */}
                    <div className="flex justify-between items-center border-t border-white/5 pt-1.5 text-[8px] sm:text-[9px] font-mono text-white/60">
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isFilling
                          ? "bg-amber-400 animate-ping"
                          : batteryCharge >= 100
                            ? "bg-green-500"
                            : "bg-green-400 animate-pulse"
                          }`} />
                        <span>{isFilling ? "FAST CHARGE" : batteryCharge >= 100 ? "BALANCED" : "SOLAR INPUT"}</span>
                      </div>
                      <span className="font-bold text-white/80">
                        {isFilling ? "+24.5 kW" : batteryCharge >= 100 ? "0.0 kW" : "+2.8 kW"}
                      </span>
                    </div>
                  </div>

                </div>
              </section>
            </div>

          </div>

          {/* Mobile Fullscreen Glass Drawer Menu */}
          {isMobileMenuOpen && (
            <div className="absolute inset-0 z-[100] bg-[#0c120c]/95 backdrop-blur-3xl flex flex-col p-6 sm:p-10 justify-between overflow-y-auto rounded-[20px] sm:rounded-[28px]">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <Image
                  src="/logo.png"
                  alt="SolarTech Logo"
                  width={140}
                  height={38}
                  className="h-8 w-auto object-contain"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 w-9 h-9 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* List of categories with staggered animations */}
              <div className="flex-1 my-6 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6 justify-center">
                <div className="w-full max-w-[600px] mx-auto flex flex-col gap-6">

                  {/* Category 1: Solutions */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-primary-green/80 font-bold px-1">Solar Solutions</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "Residential Solar",
                        "Commercial & Industrial",
                        "Utility-Scale Systems",
                        "Energy Storage"
                      ].map((item) => (
                        <button
                          key={item}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary-green/30 hover:bg-white/10 active:bg-white/15 transition-all duration-300 text-left text-xs font-bold text-white flex items-center justify-between group cursor-pointer"
                          onClick={() => {
                            setActiveTab(item);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <span>{item}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-primary-green transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 2: Direct Links */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-primary-green/80 font-bold px-1">Discover</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "Home",
                        "About Us",
                        "Products",
                        "Projects",
                        "News & Blog",
                        "Solar Calculator",
                        "Contact"
                      ].map((item) => (
                        <button
                          key={item}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary-green/30 hover:bg-white/10 active:bg-white/15 transition-all duration-300 text-left text-xs font-bold text-white flex items-center justify-between group cursor-pointer"
                          onClick={() => {
                            setActiveTab(item);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <span>{item}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-primary-green transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer with branding */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                <span>GES.lk Solarwave Dashboard</span>
                <span>v1.3.0</span>
              </div>
            </div>
          )}
        </div> {/* Closes inner-dashboard */}
      </div> {/* Closes SECTION 1 wrapper */}

      {/* SECTION 2: About & Core Solutions */}
      <section className="w-full bg-white text-stone-900 py-24 px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col gap-16 border-t border-stone-100/80">

        {/* About Pill & Huge Headline */}
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
          {/* About Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="group inline-flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.03] text-[10px] sm:text-[11px] font-extrabold text-stone-800 tracking-widest uppercase w-fit select-none shadow-[0_4px_16px_rgba(16,185,129,0.04)] hover:border-emerald-500/40 hover:bg-emerald-500/[0.08] transition-all duration-500 cursor-pointer"
          >
            {/* Glowing Pulse Energy Core */}
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 relative overflow-hidden shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {/* Rotating background overlay mimicking a solar sweep */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/10 to-transparent animate-spin duration-[4000ms] pointer-events-none" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-800 group-hover:text-emerald-700 transition-colors duration-300">About GES</span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300 group-hover:bg-emerald-400 transition-colors duration-300" />
              <span className="font-mono text-[9px] text-emerald-600 font-extrabold tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 shadow-inner">ECO-CORE</span>
            </div>
          </motion.div>

          {/* Main Headline with Scroll-Driven Word Reveal */}
          <h2 className="headline-trigger font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.3] w-full text-justify select-none">
            {headlineItems.map((item, idx) => {
              if (item.type === "word") {
                return (
                  <span key={idx} className="inline">
                    <span className="reveal-item inline-block opacity-0 transform-gpu">
                      {item.text}
                    </span>
                    {" "}
                  </span>
                );
              } else {
                return (
                  <span key={idx} className="inline">
                    <span className="reveal-item inline-flex items-center align-middle rounded-full border border-stone-200/80 shadow-sm w-[76px] sm:w-[96px] md:w-[116px] h-[34px] sm:h-[42px] md:h-[48px] overflow-hidden relative shrink-0 mx-1 sm:mx-1.5 opacity-0 transform-gpu">
                      <Image
                        src={item.src!}
                        alt={item.alt!}
                        fill
                        sizes="(max-width: 640px) 76px, (max-width: 768px) 96px, 116px"
                        className="object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </span>
                    {" "}
                  </span>
                );
              }
            })}
          </h2>
        </div>

        {/* Divider Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.25, ease: "easeInOut" }}
          className="w-full max-w-[1360px] mx-auto h-px bg-stone-200/60 origin-left"
        />

        {/* Split Grid for Core Solutions */}
        <div className="split-grid-trigger grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start w-full max-w-[1360px] mx-auto">

          {/* Left Column: Solution Title & CTA */}
          <div className="left-column-anim lg:col-span-3 opacity-0 will-change-transform">
            <div className="flex flex-col justify-between gap-6 sm:gap-8 lg:min-h-[380px]">
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
                  Why Choose Us
                </h3>
                <p className="text-stone-500 font-medium text-sm sm:text-base leading-relaxed max-w-sm">
                  We are committed to delivering reliable and cost-effective solar energy solutions tailored precisely to your needs. Choose us for a seamless journey to energy independence.
                </p>
              </div>

              <button className="group relative overflow-hidden inline-flex items-center justify-center bg-stone-950 hover:bg-stone-900 text-white font-bold text-xs sm:text-sm tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 w-fit cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 mt-2 select-none">
                <span className="relative z-10">Explore Our Solutions</span>
                <div className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              </button>
            </div>
          </div>

          {/* Right Column: 3 rounded cards */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

            {/* Card 1: Renewable Energy */}
            <div className="card-1-anim opacity-0 will-change-transform">
              <div className="h-[380px] sm:h-[420px] rounded-[32px] sm:rounded-[36px] overflow-hidden relative shadow-sm border border-stone-100/50 flex flex-col justify-end p-8 transition-all duration-500 group cursor-pointer hover:shadow-xl hover:-translate-y-1.5">
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/green_terraces.png"
                    alt="Renewable Energy"
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient shade at the bottom to ensure white text is highly readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                </div>

                <div className="relative z-20 flex flex-col gap-2">
                  <h4 className="font-display text-[26px] sm:text-[28px] font-bold text-white tracking-tight leading-tight">
                    10 Years Industry Experience
                  </h4>
                  <p className="text-white/80 font-medium text-xs sm:text-[13px] leading-relaxed max-w-[280px]">
                    Comprehensive, long-term warranties on all equipment and workmanship, ensuring peace of mind for decades.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Carbon Tracking */}
            <div className="card-2-anim opacity-0 will-change-transform">
              <div className="h-[380px] sm:h-[420px] rounded-[32px] sm:rounded-[36px] overflow-hidden relative shadow-sm border border-stone-200/20 bg-[#eaf7e3] flex flex-col justify-between p-8 transition-all duration-500 group cursor-pointer hover:shadow-xl hover:-translate-y-1.5">

                {/* Floating Icons (at the top) */}
                <div className="relative z-20 flex items-center gap-3 text-[#16a34a] pt-1">
                  <Sun className="w-6 h-6 stroke-[1.2] icon-float-1 group-hover:scale-110 transition-transform duration-300" />
                  <Globe className="w-6 h-6 stroke-[1.2] icon-float-2 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Bottom Content: Heading and Description */}
                <div className="relative z-20 flex flex-col gap-2">
                  <h4 className="font-display text-[26px] sm:text-[28px] font-bold text-stone-950 tracking-tight leading-tight group-hover:text-green-800 transition-colors duration-300">
                    Certified Engineers & Installers
                  </h4>
                  <p className="text-stone-600 font-medium text-xs sm:text-[13px] leading-relaxed max-w-[280px]">
                    Highly trained, certified professionals who guarantee safe, efficient, and up-to-standard installation every time.
                  </p>
                </div>

                {/* Creative High-Tech Engineering Blueprint Grid Background */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
                  {/* Subtle Grid Pattern Overlay */}
                  <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#16a34a_1px,transparent_1px),linear-gradient(to_bottom,#16a34a_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Laser Scan Line Sweep */}
                  <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent animate-grid-scan" />

                  {/* Light Reflection Sweep */}
                  <div className="absolute top-0 bottom-0 w-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-light-beam" />

                  {/* Dual Orbiting Blueprint Solar Rings in top-right */}
                  <div className="absolute -top-16 -right-16 w-56 h-56 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-500">
                    {/* Outer Ring */}
                    <svg viewBox="0 0 100 100" className="w-full h-full animate-ring-rotate-cw">
                      <circle cx="50" cy="50" r="45" stroke="#16a34a" strokeWidth="0.8" strokeDasharray="3,3" fill="none" />
                      <path d="M 50 2 L 50 8 M 50 92 L 50 98 M 2 50 L 8 50 M 92 50 L 98 50" stroke="#16a34a" strokeWidth="1" />
                    </svg>
                    {/* Inner Ring (reversing) */}
                    <div className="absolute inset-4">
                      <svg viewBox="0 0 100 100" className="w-full h-full animate-ring-rotate-ccw">
                        <circle cx="50" cy="50" r="40" stroke="#22c55e" strokeWidth="0.5" fill="none" />
                        <polygon points="50,15 53,45 85,50 53,55 50,85 47,55 15,50 47,45" stroke="#16a34a" strokeWidth="0.6" fill="none" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Smart Waste */}
            <div className="card-3-anim opacity-0 will-change-transform">
              <div className="h-[380px] sm:h-[420px] rounded-[32px] sm:rounded-[36px] overflow-hidden relative shadow-sm border border-stone-100/50 flex flex-col justify-between p-8 transition-all duration-500 group cursor-pointer hover:shadow-xl hover:-translate-y-1.5">
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/leaf_drops.png"
                    alt="Smart Waste"
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient shade to ensure readable text at bottom, and highlight top-right stat */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 z-10" />
                </div>

                {/* Top-Left Highlighted Stat (Matches Screenshot Placement Exactly) */}
                <div className="relative z-20 flex flex-col items-start leading-none mt-1">
                  <span className="font-display font-extrabold text-[48px] text-white tracking-tight leading-none drop-shadow-sm">
                    95%
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-white/80 uppercase tracking-widest mt-2 text-left drop-shadow-sm">
                    Energy Optimized
                  </span>
                </div>

                {/* Bottom text content */}
                <div className="relative z-20 flex flex-col gap-2 mt-auto">
                  <h4 className="font-display text-[26px] sm:text-[28px] font-bold text-white tracking-tight leading-tight">
                    Customized Energy Audits
                  </h4>
                  <p className="text-white/80 font-medium text-xs sm:text-[13px] leading-relaxed max-w-[280px]">
                    Detailed energy assessments to design custom solar systems that maximize savings and performance.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* SECTION 3: Performance & Scalability Telemetry Ticker (Infinite Scroll) */}
      <section className="w-full bg-white text-stone-900 py-24 relative overflow-hidden">
        
        {/* Soft Ambient Green and Blue Glows in Background */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary-green/[0.03] rounded-full blur-[120px] pointer-events-none select-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none select-none" />

        {/* Header content wrapper designed to align pixel-perfectly with Section 2 header */}
        <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 mb-16 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-stone-950 leading-tight">
                GES Impact & Scale
              </h2>
            </div>
            <p className="text-stone-500 font-medium text-sm sm:text-base leading-relaxed max-w-md">
              Real-time tracking of our global renewable energy footprint, engineering excellence, and customer trust.
            </p>
          </div>
        </div>

        {/* Ticker Container (Infinite Carousel) */}
        <div 
          className="relative w-full z-10 overflow-hidden py-4 select-none"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, white 15%, white 85%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, white 15%, white 85%, transparent 100%)'
          }}
        >
          {/* Marquee Row */}
          <div className="animate-stats-scroll flex gap-6 px-3">
            {[...Array(4)].flatMap((_, repIdx) => [
              {
                id: `stat-1-${repIdx}`,
                val: "500MW+",
                label: "Clean energy generated.",
                icon: (
                  <svg className="w-5.5 h-5.5 text-white stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                iconClass: "icon-float-1",
                graphic: (
                  <div className="flex items-end gap-1.5 h-10 opacity-75 group-hover:opacity-100 transition-opacity duration-500 relative z-10">
                    <div className="w-1 bg-white/30 h-4 rounded-sm animate-pulse" />
                    <div className="w-1 bg-white/50 h-7 rounded-sm animate-pulse delay-75" />
                    <div className="w-1 bg-white h-10 rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    <div className="w-1 bg-white/75 h-8 rounded-sm animate-pulse" />
                    <div className="w-1 bg-white/50 h-5 rounded-sm animate-pulse delay-150" />
                  </div>
                )
              },
              {
                id: `stat-2-${repIdx}`,
                val: "95%",
                label: "Customers ratings.",
                icon: (
                  <svg className="w-5.5 h-5.5 text-white stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.243.578 1.82l-3.97 2.887a1 1 0 00-.364 1.118l1.52 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.887a1 1 0 00-1.175 0l-3.97 2.887c-.783.57-1.838-.197-1.538-1.118l1.52-4.674a1 1 0 00-.364-1.118l-3.97-2.887c-.783-.576-.38-1.82.578-1.82h4.907a1 1 0 00.95-.69l1.519-4.674z" />
                  </svg>
                ),
                iconClass: "icon-float-2",
                graphic: (
                  <div className="relative w-9 h-9 flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity duration-500 relative z-10">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <defs>
                         <linearGradient id={`blueGreenGrad-${repIdx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                      <path className="text-white/20" strokeWidth="2.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path stroke={`url(#blueGreenGrad-${repIdx})`} strokeWidth="2.8" strokeDasharray="95, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <span className="absolute text-[8px] font-mono font-bold text-white leading-none">95%</span>
                  </div>
                )
              },
              {
                id: `stat-3-${repIdx}`,
                val: "1,200+",
                label: "Systems installed till date.",
                icon: (
                  <svg className="w-5.5 h-5.5 text-white stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                iconClass: "icon-float-1",
                graphic: (
                  <div className="relative w-9 h-9 opacity-75 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center relative z-10">
                    <div className="absolute w-2 h-2 rounded-full bg-white animate-ping" />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    <div className="w-8 h-8 rounded-full border border-white/20 animate-spin duration-[6000ms]" style={{ borderStyle: "dashed" }} />
                  </div>
                )
              }
            ]).map((card) => (
              <div
                key={card.id}
                className="group w-[230px] sm:w-[260px] bg-gradient-to-b from-[#093e25]/95 to-[#041d11]/95 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col justify-between min-h-[130px] cursor-pointer shadow-[0_6px_20px_rgba(4,40,22,0.3),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_6px_rgba(0,0,0,0.3)] transform-gpu shrink-0 relative overflow-hidden will-change-transform"
              >
                {/* 3D Glass Highlights exactly like the Contact Button */}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_12px_rgba(255,255,255,0.25)] z-0 pointer-events-none" />

                <div className="flex justify-between items-center relative z-10">
                  <div className={`p-2 bg-white/10 border border-white/15 rounded-2xl shrink-0 ${card.iconClass}`}>
                    {card.icon}
                  </div>
                  {card.graphic}
                </div>

                <div className="flex flex-col gap-0.5 mt-3 relative z-10">
                  <h3 className="font-display font-extrabold text-[28px] sm:text-[32px] tracking-tight text-white leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                    {card.val}
                  </h3>
                  <span className="font-display font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-300">
                    {card.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* SECTION 4: Interactive Values Accordion */}
      <section className="w-full bg-white text-stone-900 py-24 border-t border-stone-100 relative">
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-96 h-96 bg-emerald-500/[0.02] rounded-full blur-[130px] pointer-events-none select-none" />
        <div className="absolute top-1/4 left-1/3 -translate-y-1/2 w-96 h-96 bg-blue-500/[0.02] rounded-full blur-[130px] pointer-events-none select-none" />

        <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Left Column: Heading and Brand Info */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 self-start flex flex-col items-start">
              <span className="text-emerald-600 font-extrabold text-sm sm:text-base tracking-widest uppercase mb-4 block">
                Our Values
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-stone-950 leading-tight mb-6">
                Sustainability is not just our focus – it's our foundation.
              </h2>
              <p className="text-stone-500 font-medium text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                At GES, we believe progress comes from blending innovation with responsibility. Our values guide how we work, the impact we create, and the partnerships we build.
              </p>
              
              {/* Meet our Team pill-button with sliding transitions */}
              <button 
                onClick={() => setActiveTab("About")}
                className="inline-flex items-center gap-4 bg-stone-50 hover:bg-stone-100 rounded-full pl-2 pr-6 py-2 border border-stone-200/60 text-stone-800 hover:text-stone-950 cursor-pointer text-sm sm:text-base font-bold group shadow-sm transition-all duration-300 active:scale-[0.98]"
              >
                <span className="w-8 h-8 sm:w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 group-hover:bg-emerald-700 transition-all duration-300">
                  <svg className="w-4 h-4 text-white stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <span className="relative z-10 select-none">Meet our team</span>
              </button>
            </div>

            {/* Right Column: High-End Interactive Accordion */}
            <div className="lg:col-span-7 flex flex-col">
              {[
                {
                  title: "Human",
                  index: "01",
                  desc: "We put people first in everything we build. From the safety of our field engineers to the long-term partnerships with our clients, empathy and collaboration drive our success.",
                  badgeLabel: "RETENTION RATE",
                  badgeVal: "99% Engineering Trust",
                  icon: (
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                },
                {
                  title: "Curious",
                  index: "02",
                  desc: "We constantly question current energy paradigms to discover smarter solutions. Continuous learning keeps us at the absolute cutting edge of solar technology and smart-grid integration.",
                  badgeLabel: "R&D INVESTMENT",
                  badgeVal: "Pioneering Smart Tech",
                  icon: (
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )
                },
                {
                  title: "Pragmatic",
                  index: "03",
                  desc: "We value real-world results over hypothetical concepts. Every system we design is built for high reliability, maximum commercial efficiency, and structural durability under harsh climates.",
                  badgeLabel: "SYSTEM RELIABILITY",
                  badgeVal: "99.98% Operational Up-time",
                  icon: (
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                },
                {
                  title: "Impact-Driven",
                  index: "04",
                  desc: "We are obsessed with tangible environmental and financial footprints. Every kilowatt of clean power we scale contributes directly to a carbon-neutral planet.",
                  badgeLabel: "CARBON OFFSET",
                  badgeVal: "100K+ Tons CO2 Saved",
                  icon: (
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V14a2 2 0 012-2h.055M12 20a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                  )
                }
              ].map((item, idx) => {
                const isOpen = activeValueIndex === idx;
                return (
                  <div key={idx} className="border-b border-stone-200/80 last:border-0">
                    <div 
                      onClick={() => setActiveValueIndex(isOpen ? null : idx)}
                      className="flex items-center justify-between py-6 sm:py-8 cursor-pointer select-none group/hdr"
                    >
                      <div className="flex items-center gap-6 sm:gap-8">
                        <span className="font-mono text-xs sm:text-sm font-semibold text-stone-400">
                          {item.index}
                        </span>
                        <h3 className={`font-display text-2xl sm:text-3xl md:text-[38px] font-extrabold tracking-tight transition-all duration-300 ${isOpen ? "text-emerald-700" : "text-stone-900 group-hover/hdr:text-emerald-600"}`}>
                          {item.title}
                        </h3>
                      </div>
                      
                      {/* Premium Circle SVG chevron indicator */}
                      <div className={`w-9 h-9 sm:w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-350 ${isOpen ? "border-emerald-600 bg-emerald-50 text-emerald-600 rotate-180" : "border-stone-200 bg-stone-50 text-stone-500 group-hover/hdr:border-emerald-600 group-hover/hdr:bg-emerald-50 group-hover/hdr:text-emerald-600"}`}>
                        <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Smooth height panel transition using grid scale */}
                    <div 
                      className={`grid transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? "grid-rows-[1fr] opacity-100 pb-8 sm:pb-10" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
                          <p className="text-stone-600 font-medium text-sm sm:text-base leading-relaxed max-w-xl">
                            {item.desc}
                          </p>
                          
                          {/* Rich Badge detailing live indicators */}
                          <div className="flex items-center gap-3 shrink-0 bg-stone-50 border border-stone-200/50 rounded-2xl p-4 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] self-start md:self-auto">
                            <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                              {item.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest leading-none">
                                {item.badgeLabel}
                              </span>
                              <span className="text-xs sm:text-sm font-extrabold text-stone-800 tracking-tight mt-1.5">
                                {item.badgeVal}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
      </section>      {/* FOOTER SECTION: Integrated Lime-Green Info Grid Overlayed on footer-1.png */}
      <footer 
        className="w-full text-[#032e16] pt-[220px] sm:pt-[290px] md:pt-[380px] lg:pt-[450px] xl:pt-[490px] pb-10 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#032e16]/10 relative z-10 font-sans"
        style={{
          backgroundImage: 'url("/footer-1.png")',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#e2ff3a'
        }}
      >
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Column 1: Brand details & Newsletter Subscription */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="flex items-center gap-3 font-display font-black text-2xl sm:text-3xl tracking-tight uppercase mb-6 text-[#032e16]">
                <svg className="w-8 h-8 text-[#032e16]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
                <span>GES</span>
              </div>
              <p className="text-[#032e16]/80 font-semibold text-sm leading-relaxed max-w-sm">
                We are a renewable energy engineering company with a mission to empower communities through reliable, clean solar power.
              </p>
              
              {/* Premium email subscription input */}
              <div className="mt-8 flex items-center justify-between bg-transparent border border-[#032e16]/25 rounded-2xl p-1.5 w-full max-w-md focus-within:border-[#032e16]/55 transition-all duration-300">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-transparent pl-3 pr-2 py-2.5 text-sm text-[#032e16] placeholder-[#032e16]/50 focus:outline-none w-full font-bold"
                />
                <button className="bg-[#032e16] text-[#e2ff3a] hover:bg-[#032e16]/90 transition-all duration-300 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer shrink-0 shadow-sm active:scale-[0.98]">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="lg:col-span-2 lg:col-start-7 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-[#032e16]/60">
                Links
              </h4>
              <ul className="flex flex-col gap-3 font-bold text-sm">
                <li><button onClick={() => setActiveTab("Home")} className="hover:opacity-60 transition-opacity cursor-pointer">Home</button></li>
                <li><button onClick={() => setActiveTab("About")} className="hover:opacity-60 transition-opacity cursor-pointer">About Us</button></li>
                <li><button onClick={() => setActiveTab("Services")} className="hover:opacity-60 transition-opacity cursor-pointer">Services</button></li>
                <li><button onClick={() => setActiveTab("Projects")} className="hover:opacity-60 transition-opacity cursor-pointer">Projects</button></li>
                <li><button onClick={() => setActiveTab("Contact")} className="hover:opacity-60 transition-opacity cursor-pointer">Contact</button></li>
              </ul>
            </div>

            {/* Column 3: Legal/Policies */}
            <div className="lg:col-span-2 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-[#032e16]/60">
                Legal
              </h4>
              <ul className="flex flex-col gap-3 font-bold text-sm">
                <li><a href="#" className="hover:opacity-60 transition-opacity">Privacy Policy</a></li>
                <li><a href="#" className="hover:opacity-60 transition-opacity">Terms & Conditions</a></li>
                <li><a href="#" className="hover:opacity-60 transition-opacity">Engineering Standards</a></li>
                <li><a href="#" className="hover:opacity-60 transition-opacity">License Details</a></li>
              </ul>
            </div>

            {/* Column 4: Contact Us Info */}
            <div className="lg:col-span-2 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-[#032e16]/60">
                Contact Us
              </h4>
              <ul className="flex flex-col gap-4 font-bold text-sm text-[#032e16]/80">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#032e16] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="leading-relaxed font-semibold">No. 45, Galle Road, Colombo 03, Sri Lanka</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#032e16] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@ges.lk" className="hover:opacity-60 transition-opacity">info@ges.lk</a>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#032e16] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+94112543210" className="hover:opacity-60 transition-opacity">+94 112 543 210</a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </footer>

      {/* COPYRIGHT SECTION: Pure White Bottom Bar with No Separator */}
      <div className="w-full bg-white text-stone-600 py-8 px-6 sm:px-12 md:px-16 lg:px-24 relative z-10 font-sans">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs font-bold text-stone-500">
            © {new Date().getFullYear()} GES (PVT) LTD. All rights reserved. Powered by Clean Energy.
          </span>
          
          {/* Social Links */}
          <div className="flex items-center gap-5 text-stone-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
