"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight, ArrowRight, Battery, Sun, Wind, Thermometer, Globe, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blogPosts } from "@/data/blogs";

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
  const [activeValueIndex, setActiveValueIndex] = useState<number | null>(null);
  const [hoveredApproach, setHoveredApproach] = useState<number | null>(null); // Start with all cards closed

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

      const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

      // ScrollTrigger scroll-driven Approach cards stagger reveal
      gsap.fromTo(
        ".approach-card-anim",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".approach-section-trigger",
            start: "top 75%",
          },
        }
      );

      // ScrollTrigger scroll-driven Values corner-entry (Desktop only)
      if (isDesktop) {
        // Initially set them to opacity 0 to prevent a flash of content
        gsap.set([".value-card-1", ".value-card-2", ".value-card-3", ".value-card-4"], {
          opacity: 0
        });

        const valuesTL = gsap.timeline({
          scrollTrigger: {
            trigger: ".values-pin-trigger",
            start: "top top",
            end: "+=200%", // Extended scroll track for granular control
            scrub: true, // Perfect direct 1:1 scroll tracking with no slide lag
            pin: true,
            pinSpacing: true, // Explicitly enforce spacing on the parent wrapper
            anticipatePin: 1,
          }
        });

        const cardDuration = 1.0;

        // Animate each card strictly one after the other to guarantee ONE card at a time
        // Using ease: "none" maps the motion perfectly, linearly and accurately to the scrollbar distance
        valuesTL
          // Card 1: Comes in immediately as soon as we start scrolling
          .fromTo(
            ".value-card-1",
            {
              x: -150,
              y: 150,
              rotateY: -20,
              rotateX: 10,
              opacity: 0,
              scale: 0.85,
              transformPerspective: 1200,
            },
            {
              x: 0,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              opacity: 1,
              scale: 1,
              duration: cardDuration,
              ease: "none",
            }
          )
          // Card 2: Animates only after Card 1 is fully complete
          .fromTo(
            ".value-card-2",
            {
              x: 150,
              y: 150,
              rotateY: 20,
              rotateX: 10,
              opacity: 0,
              scale: 0.85,
              transformPerspective: 1200,
            },
            {
              x: 0,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              opacity: 1,
              scale: 1,
              duration: cardDuration,
              ease: "none",
            }
          )
          // Card 3: Animates only after Card 2 is fully complete
          .fromTo(
            ".value-card-3",
            {
              x: -150,
              y: 150,
              rotateY: -20,
              rotateX: 10,
              opacity: 0,
              scale: 0.85,
              transformPerspective: 1200,
            },
            {
              x: 0,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              opacity: 1,
              scale: 1,
              duration: cardDuration,
              ease: "none",
            }
          )
          // Card 4: Animates only after Card 3 is fully complete
          .fromTo(
            ".value-card-4",
            {
              x: 150,
              y: 150,
              rotateY: 20,
              rotateX: 10,
              opacity: 0,
              scale: 0.85,
              transformPerspective: 1200,
            },
            {
              x: 0,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              opacity: 1,
              scale: 1,
              duration: cardDuration,
              ease: "none",
            }
          );

        // Extra buffer tween at the end of the timeline so all cards remain completely settled
        // and stay on screen for a moment before the section unpins!
        valuesTL.to({}, { duration: 0.3 });
      }
    }, containerRef);

    // Ensure ScrollTrigger recalculates layout and heights perfectly after mounting
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
      clearTimeout(refreshTimeout);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#f8f9fa] flex flex-col">

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
                {/* Blogs */}
                <div className="nav-item-anim opacity-0 relative py-2 cursor-pointer group">
                  <Link
                    href="/blog"
                    className={`text-sm lg:text-[15px] xl:text-base 2xl:text-[17px] font-bold cursor-pointer transition-colors duration-300 ${activeTab === "Blogs" ? "text-stone-900 font-extrabold" : "text-stone-700 hover:text-primary-green"
                      }`}
                  >
                    Blogs
                  </Link>
                  <div className={`absolute bottom-[0px] left-0 h-[3px] bg-primary-green transition-all duration-300 ${activeTab === "Blogs" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"}`} />
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
                        { name: "Home", href: "/" },
                        { name: "About Us", href: "/#about" },
                        { name: "News & Blog", href: "/blog" },
                        { name: "Projects", href: "/#projects" },
                        { name: "Solar Calculator", href: "/#calculator" },
                        { name: "Contact", href: "/#contact" }
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary-green/30 hover:bg-white/10 active:bg-white/15 transition-all duration-300 text-left text-xs font-bold text-white flex items-center justify-between group cursor-pointer"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <span>{item.name}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-primary-green transition-colors" />
                        </Link>
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
                className="group w-[230px] sm:w-[260px] rounded-2xl overflow-hidden relative p-5 flex flex-col justify-between min-h-[130px] cursor-pointer shadow-[0_6px_20px_rgba(4,40,22,0.3)] transform-gpu shrink-0 will-change-transform"
              >
                {/* Background Image: matching leaf_drops texture exactly like the top cards */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/leaf_drops.png"
                    alt="Green leaf background texture"
                    fill
                    sizes="260px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-55"
                  />
                  {/* Rich, matches green-tinted overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0b5f3d]/80 via-[#053721]/90 to-[#022212]/95 z-10" />
                </div>

                {/* 3D Glass Highlights exactly like the Contact Button */}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_12px_rgba(255,255,255,0.25)] z-20 pointer-events-none" />

                <div className="flex justify-between items-center relative z-30">
                  <div className={`p-2 bg-white/10 border border-white/15 rounded-2xl shrink-0 ${card.iconClass}`}>
                    {card.icon}
                  </div>
                  {card.graphic}
                </div>

                <div className="flex flex-col gap-0.5 mt-3 relative z-30">
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

      {/* SECTION 2.5: Why Solar — Overcoming Sri Lanka's Energy Challenge */}
      <section id="why-solar" className="bg-white text-stone-900 relative z-30 border-t border-stone-100/50 pt-20 md:pt-32">
        
        {/* Soft Ambient Green and Blue Glows in Background */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary-green/[0.04] rounded-full blur-[130px] pointer-events-none select-none animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/[0.04] rounded-full blur-[130px] pointer-events-none select-none animate-pulse delay-1000" />

        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row relative z-20">
          
          {/* Left Column: Localized Context & Trust Badges */}
          <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-16 flex flex-col justify-start px-6 py-20 md:px-12 lg:px-20 lg:pt-28 lg:border-r border-stone-200/80">
            <div className="flex flex-col gap-12 max-w-xl">
              
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-stone-950 leading-tight">
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
                <div className="flex items-center gap-4 relative overflow-hidden rounded-2xl p-4 shadow-[0_6px_20px_rgba(4,40,22,0.15)] w-full min-h-[84px]">
                  {/* Glassy Background */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0b5f3d]/90 via-[#053721]/95 to-[#022212]/98 z-10" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_12px_rgba(255,255,255,0.15)] border border-white/5 z-20 pointer-events-none" />

                  {/* Icon */}
                  <div className="relative z-30 w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    <svg className="w-5.5 h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  
                  {/* Texts */}
                  <div className="flex flex-col relative z-30">
                    <span className="text-[10px] font-bold text-emerald-300/90 uppercase tracking-wider leading-none">Standardized Quality</span>
                    <span className="text-sm font-extrabold text-white mt-1.5 leading-tight">ISO 9001 : 2015</span>
                  </div>
                </div>

                {/* SLSEA Approved Badge */}
                <div className="flex items-center gap-4 relative overflow-hidden rounded-2xl p-4 shadow-[0_6px_20px_rgba(4,40,22,0.15)] w-full min-h-[84px]">
                  {/* Glassy Background */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0b5f3d]/90 via-[#053721]/95 to-[#022212]/98 z-10" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_12px_rgba(255,255,255,0.15)] border border-white/5 z-20 pointer-events-none" />

                  {/* Icon */}
                  <div className="relative z-30 w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    <svg className="w-5.5 h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  
                  {/* Texts */}
                  <div className="flex flex-col relative z-30">
                    <span className="text-[10px] font-bold text-emerald-300/90 uppercase tracking-wider leading-none">Authority Approved</span>
                    <span className="text-sm font-extrabold text-white mt-1.5 leading-tight">SL SEA Certified</span>
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V14a2 2 0 012-2h.055M12 20a8 8 0 100-16 8 8 0 000 16z" />
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
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-current stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h10M4 21V10l5-4 5 4v6M7 21v-4h2v4" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11l6-6M17 5h4v4" />
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
                          src="/leaf_drops.png"
                          alt="Green leaf background texture"
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0b5f3d]/90 to-[#022212]/95 z-10" />
                      </div>
                      
                      {/* Glass reflections */}
                      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_8px_rgba(255,255,255,0.35)] border border-white/10 z-20" />
                      
                      {/* Actual SVG Icon */}
                      <div className="relative z-30 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                        {card.icon}
                      </div>
                    </div>
                    {/* Index Number */}
                    <span className="text-stone-300 font-mono text-lg font-bold group-hover:text-emerald-500/60 transition-colors duration-300">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-emerald-600 transition-colors duration-300">
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

      {/* Scroll-Trigger Pinned values Wrapper to isolate from parent flex container */}
      <div className="values-pin-trigger w-full relative block z-30">
        {/* SECTION 4: Centered & Scroll-Triggered Values (High-End Diagonal Slide) */}
        <section className="w-full min-h-screen lg:h-screen relative flex items-center justify-center bg-white text-stone-900 overflow-hidden py-16 lg:py-0 border-t border-stone-100/60 z-10">
        {/* Deep, Premium Ambient Background Glows */}
        <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none select-none" />
        <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/[0.02] rounded-full blur-[140px] pointer-events-none select-none" />

        <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-center h-full w-full">
            
            {/* 1. Desktop Pin Layout (GSAP Scroll-Triggered Corner-Slide Grid) */}
            <div className="hidden lg:grid grid-cols-12 w-full max-w-[1400px] h-[80vh] items-center gap-6 z-20">
              
              {/* Left Column: Top-Left Card (01) & Bottom-Left Card (03) */}
              <div className="col-span-4 h-full flex flex-col justify-between py-8">
                
                {/* Card 1: Top-Left (Human) */}
                <div className="value-card-1 overflow-hidden relative border border-white/5 rounded-3xl p-7 flex flex-col justify-between min-h-[180px] xl:min-h-[200px] shadow-[0_15px_45px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-8px_rgba(16,185,129,0.15)] hover:border-white/10 transition-[border-color,box-shadow] duration-350 transform-gpu group">
                  {/* Background Texture and Tint Gradient Overlay */}
                  <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <Image
                      src="/leaf_drops.png"
                      alt="Leaf Drops Texture"
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover mix-blend-luminosity opacity-85 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0b5f3d]/90 via-[#053721]/95 to-[#022212]/98 z-10" />
                  </div>

                  {/* Premium 3D Inner Glass Highlight */}
                  <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_12px_rgba(255,255,255,0.15)] z-20 pointer-events-none border border-white/5" />

                  <div>
                    <h3 className="relative z-30 font-display text-xl xl:text-2xl font-extrabold text-white mt-2 leading-none">Human</h3>
                    <p className="relative z-30 text-emerald-100/80 font-semibold text-xs xl:text-sm leading-relaxed mt-3">
                      We put people first in everything we build, driving success through empathy and collaboration.
                    </p>
                  </div>
                  <div className="relative z-30 flex items-center gap-2 mt-4 self-start bg-white/10 border border-white/10 px-3 py-1 rounded-full">
                    <span className="text-[9px] font-extrabold text-emerald-300 uppercase tracking-widest leading-none">RETENTION RATE:</span>
                    <span className="text-[10px] font-black text-white">99% Engineering Trust</span>
                  </div>
                </div>

                {/* Card 3: Bottom-Left (Pragmatic) */}
                <div className="value-card-3 overflow-hidden relative border border-white/5 rounded-3xl p-7 flex flex-col justify-between min-h-[180px] xl:min-h-[200px] shadow-[0_15px_45px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-8px_rgba(16,185,129,0.15)] hover:border-white/10 transition-[border-color,box-shadow] duration-350 transform-gpu group">
                  {/* Background Texture and Tint Gradient Overlay */}
                  <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <Image
                      src="/leaf_drops.png"
                      alt="Leaf Drops Texture"
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover mix-blend-luminosity opacity-85 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0b5f3d]/90 via-[#053721]/95 to-[#022212]/98 z-10" />
                  </div>

                  {/* Premium 3D Inner Glass Highlight */}
                  <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_12px_rgba(255,255,255,0.15)] z-20 pointer-events-none border border-white/5" />

                  <div>
                    <h3 className="relative z-30 font-display text-xl xl:text-2xl font-extrabold text-white mt-2 leading-none">Pragmatic</h3>
                    <p className="relative z-30 text-emerald-100/80 font-semibold text-xs xl:text-sm leading-relaxed mt-3">
                      We value real-world results over hypothetical concepts, designing systems for maximum durability.
                    </p>
                  </div>
                  <div className="relative z-30 flex items-center gap-2 mt-4 self-start bg-white/10 border border-white/10 px-3 py-1 rounded-full">
                    <span className="text-[9px] font-extrabold text-emerald-300 uppercase tracking-widest leading-none">SYSTEM RELIABILITY:</span>
                    <span className="text-[10px] font-black text-white">99.98% Operational Up-time</span>
                  </div>
                </div>

              </div>
              
              {/* Center Column: Simplified Main Info Block */}
              <div className="col-span-4 h-full flex flex-col items-center justify-center text-center px-4">
                <div className="value-center-content flex flex-col items-center max-w-md transform-gpu">
                  <span className="text-emerald-600 font-extrabold text-xs sm:text-sm tracking-widest uppercase mb-4 block">
                    Our Values
                  </span>
                  <h2 className="font-display text-4xl xl:text-5xl font-black tracking-tight text-stone-950 leading-tight mb-6">
                    Sustainability is our foundation.
                  </h2>
                  <p className="text-stone-500 font-semibold text-xs xl:text-sm leading-relaxed mb-8">
                    At GES, we believe progress comes from blending innovation with responsibility. Our values guide how we work, the impact we create, and the partnerships we build.
                  </p>
                  
                  {/* Meet our Team pill-button */}
                  <button 
                    onClick={() => setActiveTab("About")}
                    className="inline-flex items-center gap-4 bg-stone-50 hover:bg-stone-100 rounded-full pl-2 pr-6 py-2 border border-stone-200/60 text-stone-800 hover:text-stone-950 cursor-pointer text-xs xl:text-sm font-bold group shadow-sm transition-all duration-300 active:scale-[0.98]"
                  >
                    <span className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 group-hover:bg-emerald-700 transition-all duration-300">
                      <svg className="w-4 h-4 text-white stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                    <span className="relative z-10 select-none">Meet our team</span>
                  </button>
                </div>
              </div>
              
              {/* Right Column: Top-Right Card (02) & Bottom-Right Card (04) */}
              <div className="col-span-4 h-full flex flex-col justify-between py-8">
                
                {/* Card 2: Top-Right (Curious) */}
                <div className="value-card-2 overflow-hidden relative border border-white/5 rounded-3xl p-7 flex flex-col justify-between min-h-[180px] xl:min-h-[200px] shadow-[0_15px_45px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-8px_rgba(16,185,129,0.15)] hover:border-white/10 transition-[border-color,box-shadow] duration-350 transform-gpu group">
                  {/* Background Texture and Tint Gradient Overlay */}
                  <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <Image
                      src="/leaf_drops.png"
                      alt="Leaf Drops Texture"
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover mix-blend-luminosity opacity-85 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0b5f3d]/90 via-[#053721]/95 to-[#022212]/98 z-10" />
                  </div>

                  {/* Premium 3D Inner Glass Highlight */}
                  <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_12px_rgba(255,255,255,0.15)] z-20 pointer-events-none border border-white/5" />

                  <div>
                    <h3 className="relative z-30 font-display text-xl xl:text-2xl font-extrabold text-white mt-2 leading-none">Curious</h3>
                    <p className="relative z-30 text-emerald-100/80 font-semibold text-xs xl:text-sm leading-relaxed mt-3">
                      We constantly question current paradigms to discover smarter, cutting-edge solar solutions.
                    </p>
                  </div>
                  <div className="relative z-30 flex items-center gap-2 mt-4 self-start bg-white/10 border border-white/10 px-3 py-1 rounded-full">
                    <span className="text-[9px] font-extrabold text-emerald-300 uppercase tracking-widest leading-none">R&D INVESTMENT:</span>
                    <span className="text-[10px] font-black text-white">Pioneering Smart Tech</span>
                  </div>
                </div>

                {/* Card 4: Bottom-Right (Impact-Driven) */}
                <div className="value-card-4 overflow-hidden relative border border-white/5 rounded-3xl p-7 flex flex-col justify-between min-h-[180px] xl:min-h-[200px] shadow-[0_15px_45px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-8px_rgba(16,185,129,0.15)] hover:border-white/10 transition-[border-color,box-shadow] duration-350 transform-gpu group">
                  {/* Background Texture and Tint Gradient Overlay */}
                  <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <Image
                      src="/leaf_drops.png"
                      alt="Leaf Drops Texture"
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover mix-blend-luminosity opacity-85 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0b5f3d]/90 via-[#053721]/95 to-[#022212]/98 z-10" />
                  </div>

                  {/* Premium 3D Inner Glass Highlight */}
                  <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_12px_rgba(255,255,255,0.15)] z-20 pointer-events-none border border-white/5" />

                  <div>
                    <h3 className="relative z-30 font-display text-xl xl:text-2xl font-extrabold text-white mt-2 leading-none">Impact-Driven</h3>
                    <p className="relative z-30 text-emerald-100/80 font-semibold text-xs xl:text-sm leading-relaxed mt-3">
                      We scale clean power to deliver tangible financial savings and accelerate carbon neutrality.
                    </p>
                  </div>
                  <div className="relative z-30 flex items-center gap-2 mt-4 self-start bg-white/10 border border-white/10 px-3 py-1 rounded-full">
                    <span className="text-[9px] font-extrabold text-emerald-300 uppercase tracking-widest leading-none">CARBON OFFSET:</span>
                    <span className="text-[10px] font-black text-white">100K+ Tons CO2 Saved</span>
                  </div>
                </div>

              </div>

            </div>

            {/* 2. Mobile/Tablet Layout (Native Stack Flow - Clean & Accessible) */}
            <div className="lg:hidden flex flex-col gap-12 w-full">
              
              <div className="text-center max-w-xl mx-auto flex flex-col items-center">
                <span className="text-emerald-600 font-extrabold text-xs sm:text-sm tracking-widest uppercase mb-3 block">
                  Our Values
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-950 leading-tight mb-4">
                  Sustainability is our foundation.
                </h2>
                <p className="text-stone-500 font-medium text-xs sm:text-sm leading-relaxed mb-6">
                  At GES, we believe progress comes from blending innovation with responsibility. Our values guide how we work, the impact we create, and the partnerships we build.
                </p>
                <button 
                  onClick={() => setActiveTab("About")}
                  className="inline-flex items-center gap-3 bg-stone-50 hover:bg-stone-100 rounded-full pl-2 pr-5 py-1.5 border border-stone-200/60 text-stone-800 text-xs sm:text-sm font-bold group shadow-sm active:scale-[0.98] transition-all"
                >
                  <span className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:bg-emerald-700 transition-all">
                    <svg className="w-3.5 h-3.5 text-white stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  <span>Meet our team</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {[
                  {
                    title: "Human",
                    desc: "We put people first in everything we build, driving success through empathy and collaboration.",
                    badgeLabel: "RETENTION RATE",
                    badgeVal: "99% Engineering Trust"
                  },
                  {
                    title: "Curious",
                    desc: "We constantly question current paradigms to discover smarter, cutting-edge solar solutions.",
                    badgeLabel: "R&D INVESTMENT",
                    badgeVal: "Pioneering Smart Tech"
                  },
                  {
                    title: "Pragmatic",
                    desc: "We value real-world results over hypothetical concepts, designing systems for maximum durability.",
                    badgeLabel: "SYSTEM RELIABILITY",
                    badgeVal: "99.98% Operational Up-time"
                  },
                  {
                    title: "Impact-Driven",
                    desc: "We scale clean power to deliver tangible financial savings and accelerate carbon neutrality.",
                    badgeLabel: "CARBON OFFSET",
                    badgeVal: "100K+ Tons CO2 Saved"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="overflow-hidden relative border border-white/5 rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[170px] shadow-[0_10px_35px_-10px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all group">
                    {/* Background Texture and Tint Gradient Overlay */}
                    <div className="absolute inset-0 z-0 select-none pointer-events-none">
                      <Image
                        src="/leaf_drops.png"
                        alt="Leaf Drops Texture"
                        fill
                        sizes="(max-width: 1024px) 100vw, 400px"
                        className="object-cover mix-blend-luminosity opacity-85 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0b5f3d]/90 via-[#053721]/95 to-[#022212]/98 z-10" />
                    </div>

                    {/* Premium 3D Inner Glass Highlight */}
                    <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_12px_rgba(255,255,255,0.15)] z-20 pointer-events-none border border-white/5" />

                    <div>
                      <h3 className="relative z-30 font-display text-lg sm:text-xl font-extrabold text-white mt-2 leading-none">{item.title}</h3>
                      <p className="relative z-30 text-emerald-100/80 font-medium text-xs leading-relaxed mt-2.5">{item.desc}</p>
                    </div>
                    <div className="relative z-30 flex items-center gap-1.5 mt-3 self-start bg-white/10 border border-white/10 px-2.5 py-0.5 rounded-full">
                      <span className="text-[8px] font-extrabold text-emerald-300 uppercase tracking-widest leading-none">{item.badgeLabel}:</span>
                      <span className="text-[9px] font-black text-white">{item.badgeVal}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>
      </div>

      {/* SECTION 4.5: Our Process / Section Approach */}
      <section className="approach-section-trigger w-full bg-[#f8f9fa] text-stone-900 py-24 md:py-32 relative overflow-hidden border-t border-stone-100/50 z-20">
        
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary-green/[0.03] rounded-full blur-[130px] pointer-events-none select-none animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-[130px] pointer-events-none select-none animate-pulse delay-1000" />

        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 relative z-10">
          
          {/* Header Block */}
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-mono text-xs font-black text-emerald-700 tracking-[0.25em] uppercase mb-4 block">
              our approach
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-[52px] font-black tracking-tight text-emerald-950 leading-tight max-w-3xl">
              Our process, refined through experience
            </h2>
          </div>

          {/* Interactive Staggered Flex Accordion Cards */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full min-h-[460px] mt-12" onMouseLeave={() => setHoveredApproach(null)}>
            {[
              {
                num: "01.",
                title: "Design",
                image: "https://framerusercontent.com/images/wZRwWZKVYJrfzGLdaj4uc9pa0E.webp",
                desc: "We start by understanding your property, energy usage, and long-term goals. Our engineers create a site-specific system that prioritizes efficiency, safety, and future flexibility."
              },
              {
                num: "02.",
                title: "Build",
                image: "https://framerusercontent.com/images/pJOiUSAQLtPX4kTdAuk5xtQY0.png",
                desc: "From permitting to final commissioning, our certified teams manage every detail. Installations are carefully planned to minimize disruption."
              },
              {
                num: "03.",
                title: "Install",
                image: "https://framerusercontent.com/images/9uN2Q1rO2xdB7dxznL79FvhSXag.jpg",
                desc: "From permitting to final commissioning, our certified teams manage every detail. Installations are carefully planned to minimize disruption."
              },
              {
                num: "04.",
                title: "Perform",
                image: "https://framerusercontent.com/images/YTJHW8aOUqPgnBJEJkcF7yV6y2k.png",
                desc: "Once live, your system is monitored to ensure it performs as expected. Ongoing support and maintenance help protect output and extend system lifespan."
              }
            ].map((card, idx) => {
              const isHovered = hoveredApproach === idx;
              return (
                <div 
                  key={idx}
                  className={`approach-card-anim group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/5 min-h-[380px] lg:min-h-[440px] flex flex-col justify-between p-6 sm:p-8 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-0 translate-y-[40px] bg-[#022212] ${
                    isHovered 
                      ? "lg:flex-[3.5] flex-[3] shadow-2xl" 
                      : "lg:flex-[1.2] flex-1"
                  }`}
                  onMouseEnter={() => setHoveredApproach(idx)}
                >
                  {/* Vibrant Green Theme Background for collapsed state */}
                  <div className="absolute inset-0 z-0 select-none pointer-events-none transition-all duration-700">
                    <div className={`absolute inset-0 transition-opacity duration-700 ${
                      isHovered
                        ? "opacity-0"
                        : "bg-gradient-to-b from-[#0b5f3d] via-[#053721] to-[#022212] opacity-100"
                    }`} />
                  </div>

                  {/* Full-Bleed Image with Radial Mask: visible ONLY when expanded */}
                  <div className={`absolute inset-0 z-0 select-none pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}>
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center"
                    />
                    {/* Seamless radial fade mask: transparent top-right, solid dark green everywhere else */}
                    <div 
                      className="absolute inset-0 z-10"
                      style={{
                        background: 'radial-gradient(60% 60% at 85% 25%, rgba(2, 34, 18, 0) 0%, rgba(2, 34, 18, 0.6) 30%, rgba(2, 34, 18, 1) 75%)'
                      }}
                    />
                  </div>

                  {/* 3D Glass Highlights */}
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_15px_rgba(255,255,255,0.08)] border border-white/5 z-20 pointer-events-none" />

                    {/* Card content aligned vertically */}
                    <div className="relative z-30 flex flex-col justify-between h-full w-full">
                      {/* Top: Number */}
                      <div>
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-[#c8f69b] tracking-tight leading-none">
                          {card.num}
                        </h1>
                      </div>

                      {/* Bottom Content: Title + Description */}
                      <div className="flex flex-col gap-3 w-full">
                        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-none">
                          {card.title}
                        </h3>
                        
                        {/* Description - expanded only */}
                        <div 
                          className={`transition-all duration-500 overflow-hidden ${
                            isHovered ? "max-h-[160px] opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none"
                          }`}
                        >
                          <p className="text-stone-300 text-xs sm:text-sm font-semibold leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 5: Latest Insights (Blog Preview - Redesigned & Widened) */}
      <section className="w-full bg-[#f8f9fa] text-stone-900 py-28 border-t border-stone-200/40 relative z-20 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-[-100px] -translate-y-1/2 w-[500px] h-[500px] bg-green-500/[0.03] rounded-full blur-[140px] pointer-events-none select-none" />
        <div className="absolute bottom-[-100px] right-[10%] w-[600px] h-[400px] bg-green-500/[0.02] rounded-full blur-[150px] pointer-events-none select-none" />

        <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 relative z-10">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="flex flex-col">
              <h2 className="font-display text-4xl sm:text-5xl md:text-[52px] font-black tracking-tight text-stone-900 leading-none">
                Clean Energy & Engineering Insights
              </h2>
              <p className="text-stone-500 text-sm sm:text-base md:text-lg font-medium leading-relaxed mt-4 max-w-2xl">
                Explore our latest deep-dive research, grid compliance frameworks, and sustainable energy calculators from our engineering experts.
              </p>
            </div>
            
            <Link 
              href="/blog"
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-stone-200/80 hover:border-green-600/30 hover:bg-white text-stone-700 hover:text-green-600 font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm hover:-translate-y-0.5"
            >
              <span>View All Insights</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid of latest 3 posts (Widened grid with premium gaps) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 xl:gap-12">
            {blogPosts.slice(0, 3).map((post) => (
              <article 
                key={post.slug} 
                className="bg-white border border-stone-200/50 rounded-[32px] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.015)] hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.08)] transition-all duration-500 group flex flex-col justify-between hover:-translate-y-1.5 relative"
              >
                <div className="flex flex-col">
                  {/* Cover Image */}
                  <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 46vw, 30vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
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
                        {post.date}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-stone-200" />
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-display text-xl sm:text-2xl font-black text-stone-900 group-hover:text-green-600 transition-colors duration-300 leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h4>

                    {/* Excerpt */}
                    <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-semibold line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Dynamic Technical Metrics (Stunning Engineering Detail) */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-100">
                      {post.metrics.slice(0, 2).map((m, idx) => (
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
                    <div className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center font-bold text-green-700 text-xs shadow-sm">
                      {post.author.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-stone-800 leading-none">{post.author.name}</span>
                      <span className="text-[9px] font-bold text-stone-400 tracking-wider mt-1">{post.author.role.split(",")[0]}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-stone-600 group-hover:text-green-600 transition-colors cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Dynamic Animate-on-Hover accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-500 to-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </article>
            ))}
          </div>

        </div>
      </section>

      <footer 
        className="w-full text-white pt-[240px] sm:pt-[310px] md:pt-[400px] lg:pt-[470px] xl:pt-[510px] pb-10 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-white/5 relative z-10 font-sans"
        style={{
          backgroundImage: 'url("/footer-1.png")',
          backgroundSize: '100% auto',
          backgroundPosition: 'center -35%',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#012716'
        }}
      >
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Column 1: Brand details & Newsletter Subscription */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="mb-6 flex items-center">
                <Image
                  src="/logo.png"
                  alt="GES Logo"
                  width={150}
                  height={42}
                  className="h-9 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-white/70 font-medium text-sm leading-relaxed max-w-sm">
                We are a renewable energy engineering company with a mission to empower communities through reliable, clean solar power.
              </p>
              
              {/* Premium email subscription input */}
              <div className="mt-8 flex items-center justify-between bg-transparent border border-white/20 rounded-2xl p-1.5 w-full max-w-md focus-within:border-white/50 transition-all duration-300">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-transparent pl-3 pr-2 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none w-full font-semibold"
                />
                <button className="bg-[#e2ff3a] text-[#012716] hover:bg-[#e2ff3a]/90 transition-all duration-300 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer shrink-0 shadow-sm active:scale-[0.98]">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="lg:col-span-2 lg:col-start-7 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">
                Links
              </h4>
              <ul className="flex flex-col gap-3 font-bold text-sm">
                <li><Link href="/" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">Home</Link></li>
                <li><Link href="/#about" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">About Us</Link></li>
                <li><Link href="/#solutions" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">Services</Link></li>
                <li><Link href="/#projects" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">Projects</Link></li>
                <li><Link href="/blog" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">Blogs</Link></li>
                <li><Link href="/#contact" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">Contact</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal/Policies */}
            <div className="lg:col-span-2 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">
                Legal
              </h4>
              <ul className="flex flex-col gap-3 font-bold text-sm">
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">Engineering Standards</a></li>
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">License Details</a></li>
              </ul>
            </div>

            {/* Column 4: Contact Us Info */}
            <div className="lg:col-span-2 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">
                Contact Us
              </h4>
              <ul className="flex flex-col gap-4 font-bold text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#e2ff3a] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="leading-relaxed font-semibold">714/1, Thorana Junction, Kandy Road, Kelaniya, Sri Lanka</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#e2ff3a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:sales@ges.lk" className="hover:text-[#e2ff3a] transition-colors">sales@ges.lk</a>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#e2ff3a] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="flex flex-col">
                    <a href="tel:+94765332332" className="hover:text-[#e2ff3a] transition-colors font-bold">+94 76 533 2332</a>
                    <a href="tel:0765332332" className="hover:text-[#e2ff3a] transition-colors text-xs text-white/50 font-semibold">076 533 2332</a>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </footer>

      {/* COPYRIGHT SECTION: Deep Forest Green Bottom Bar with No Separator */}
      <div className="w-full bg-[#012716] text-white/60 py-8 px-6 sm:px-12 md:px-16 lg:px-24 relative z-10 font-sans">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs font-bold text-white/50 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© {new Date().getFullYear()} GES (PVT) LTD. All rights reserved.</span>
            <span className="hidden sm:inline text-white/25">•</span>
            <span className="text-white/80">Built and Designed by <span className="text-[#e2ff3a] tracking-wider">ARC AI</span></span>
          </span>
          
          {/* Social Links */}
          <div className="flex items-center gap-5 text-white/70">
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0 3.259-.014 3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
