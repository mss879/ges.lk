"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight, ArrowRight, Battery, Wind, Thermometer, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blogPosts } from "@/data/blogs";
import Preloader from "@/app/components/Preloader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const titleWords = "Solar energy that moves the world forward".split(" ");
const descLines = [
  "Powering homes and businesses with clean, renewable solar".split(" "),
  "solutions. Reduce your carbon footprint and energy costs today.".split(" ")
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    },
  },
};

const wordVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.8,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const roofingImageVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 1.0,
      duration: 0.8,
      ease: "easeOut" as const,
    },
  },
};

const StarIcon = () => (
  <svg className="w-4.5 h-4.5 text-[#e2fa5a] fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export default function Home() {


  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setIsVideoLoaded(true);
    };

    if (video.readyState >= 3) {
      setIsVideoLoaded(true);
    } else {
      video.addEventListener("canplaythrough", handleLoaded);
      video.addEventListener("loadeddata", handleLoaded);
    }

    return () => {
      video.removeEventListener("canplaythrough", handleLoaded);
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, []);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeValueIndex, setActiveValueIndex] = useState<number | null>(null);

  // Values 3D Cylinder Interactive Drag & Infinite Rotation Refs and Handlers
  const cylinderRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (!isDraggingRef.current && cylinderRef.current) {
        rotationRef.current += 0.08;
        cylinderRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleCylinderPointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startRotationRef.current = rotationRef.current;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
  };

  const handleCylinderPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    rotationRef.current = startRotationRef.current - deltaX * 0.2;
    if (cylinderRef.current) {
      cylinderRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
    }
  };

  const handleCylinderPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const target = e.currentTarget as HTMLElement;
    target.releasePointerCapture(e.pointerId);
  };

  const [batteryCharge, setBatteryCharge] = useState(0);
  const [isFilling, setIsFilling] = useState(true);
  const [activeService, setActiveService] = useState<number | null>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isInitialServiceMount = useRef(true);

  useEffect(() => {
    if (activeService !== null) {
      if (isInitialServiceMount.current) {
        isInitialServiceMount.current = false;
        return;
      }
      const timer = setTimeout(() => {
        serviceRefs.current[activeService]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeService]);

  const valuesData = [
    {
      title: "Human",
      desc: "We put people first in everything we build, driving success through empathy and collaboration.",
      badgeLabel: "RETENTION RATE:",
      badgeVal: "99% Engineering Trust",
      bgClass: "bg-gradient-to-br from-[#00E676] via-[#00AC4E] to-[#008F3F]"
    },
    {
      title: "Curious",
      desc: "We constantly question current paradigms to discover smarter, cutting-edge solar solutions.",
      badgeLabel: "R&D INVESTMENT:",
      badgeVal: "Pioneering Smart Tech",
      bgClass: "bg-gradient-to-br from-[#00E676] via-[#00AC4E] to-[#008F3F]"
    },
    {
      title: "Pragmatic",
      desc: "We value real-world results over hypothetical concepts, designing systems for maximum durability.",
      badgeLabel: "SYSTEM RELIABILITY:",
      badgeVal: "99.98% Operational Up-time",
      bgClass: "bg-gradient-to-br from-[#00E676] via-[#00AC4E] to-[#008F3F]"
    },
    {
      title: "Impact-Driven",
      desc: "We scale clean power to deliver tangible financial savings and accelerate carbon neutrality.",
      badgeLabel: "CARBON OFFSET:",
      badgeVal: "100K+ Tons CO2 Save",
      bgClass: "bg-gradient-to-br from-[#00E676] via-[#00AC4E] to-[#008F3F]"
    },
    {
      title: "Future-Ready",
      desc: "We engineer systems designed to adapt to future grid evolutions and next-generation battery integrations.",
      badgeLabel: "GRID READINESS:",
      badgeVal: "100% Future-Compatible Tech",
      bgClass: "bg-gradient-to-br from-[#00E676] via-[#00AC4E] to-[#008F3F]"
    },
    {
      title: "Quality-First",
      desc: "We uphold elite engineering standards, using tier-one components built to endure the harshest climates.",
      badgeLabel: "HARDWARE QUALITY:",
      badgeVal: "Tier-1 Clean Energy Tech",
      bgClass: "bg-gradient-to-br from-[#00E676] via-[#00AC4E] to-[#008F3F]"
    }
  ];

  const doubleValues = [
    ...valuesData,
    ...valuesData
  ];

  const servicesData = [
    {
      number: "01",
      title: "Residential Solar Solutions",
      description: "We help homeowners reduce energy costs, increase energy independence and contribute to a sustainable future. Our solutions are designed for efficiency, reliability and long term performance.",
      subItems: [
        {
          title: "1. On-Grid Systems",
          desc: "Connect your home to the main power grid while harnessing solar energy. Our on-grid solar systems allow you to reduce electricity bills, feed excess energy back to the grid, and enjoy a cost-effective, eco-friendly power solution."
        },
        {
          title: "2. Off-Grid Systems",
          desc: "Ideal for remote locations or areas with unreliable utility power, our off-grid solar systems provide complete energy independence. With battery storage, you can enjoy uninterrupted electricity even in areas without grid access."
        },
        {
          title: "3. Hybrid Systems",
          desc: "Combine the best of both worlds with hybrid solar systems. These systems integrate grid connection with battery storage, ensuring uninterrupted power supply while maximizing energy savings and sustainability."
        },
        {
          title: "4. Battery Backup Option",
          desc: "Protect your home from power outages with our battery backup solutions. Designed for residential solar systems, they store excess energy for use during grid failures, ensuring comfort, safety and energy security."
        },
        {
          title: "5. Energy Audit & Site Inspection",
          desc: "Our expert team conducts a thorough energy audit and site inspection to assess your home’s energy needs, roof suitability and optimal system design. This ensures maximum efficiency, performance and return on investment for your solar installation."
        }
      ],
      images: [
        "/blogs/off_grid_vs_hybrid.png",
        "/blogs/home_energy_storage.png",
        "/blogs/solar_battery_cabinet.png"
      ]
    },
    {
      number: "02",
      title: "Commercial & Industrial Solar Solutions",
      description: "Green Engineering Systems (Pvt) Ltd. provides advanced solar solutions for commercial and industrial clients, helping businesses reduce energy costs, increase efficiency and achieve sustainability goals. Our systems are designed for reliability, scalability and long-term performance.",
      subItems: [
        {
          title: "1. Large-Scale Solar Installation",
          desc: "We design and install large-scale solar systems for commercial and industrial facilities, delivering significant energy savings, high efficiency and compliance with regulatory standards. Our turnkey solutions are tailored to meet the energy demands of your operations."
        },
        {
          title: "2. Three-Phase Hybrid System",
          desc: "Our three-phase hybrid solar systems combine grid connection with battery storage for uninterrupted, stable power supply. Ideal for industrial applications, they ensure operational continuity while optimizing energy consumption and costs."
        },
        {
          title: "3. Power Backup Integration",
          desc: "Ensure seamless operations with our power backup solutions, integrated with solar systems. These setups protect your business from outages, reduce downtime and maintain critical functions without interruption."
        },
        {
          title: "4. Solar Maintenance Services",
          desc: "We offer comprehensive solar maintenance services to maximize system efficiency and lifespan. Regular inspections, performance monitoring, and preventive maintenance ensure your solar investment continues to deliver reliable, long-term energy benefits."
        }
      ],
      images: [
        "/blogs/smart_microgrids_ci.png",
        "/blogs/solar_carport_canopy.png",
        "/blogs/solar_substation_infra.png"
      ]
    },
    {
      number: "03",
      title: "Technical & Support Services",
      description: "We offer end-to-end technical and support services to ensure your solar systems operate efficiently, reliably and sustainably.",
      subItems: [
        {
          title: "1. System Design & Consultation",
          desc: "Our experts provide custom system design and consultation, evaluating your energy needs, site conditions and sustainability objectives to deliver optimized solar solutions."
        },
        {
          title: "2. Installation & Commissioning",
          desc: "We handle complete installation and commissioning, ensuring safe, efficient and seamless integration of solar systems with your existing infrastructure."
        },
        {
          title: "3. Monitoring & Maintenance",
          desc: "Our monitoring and maintenance services maximize system performance with regular inspections, diagnostics and preventive care to ensure long-term reliability."
        },
        {
          title: "4. Warranty Support",
          desc: "We provide comprehensive warranty support, protecting your investment with prompt service and resolution of any system issues."
        },
        {
          title: "5. Energy Performance Report",
          desc: "Receive detailed energy performance reports that track system efficiency, energy output and operational metrics, enabling data-driven decisions and optimized energy management."
        }
      ],
      images: [
        "/blogs/solar_panel_cleaning.png",
        "/blogs/solar_shading_soiling.png",
        "/blogs/future_solar_sri_lanka.png"
      ]
    },
    {
      number: "04",
      title: "Custom Solutions",
      description: "We deliver tailored energy solutions designed to meet the unique needs of each client. From efficiency improvements to sustainable corporate initiatives, our custom services help maximize performance and drive long-term value.",
      subItems: [
        {
          title: "1. Energy Audits",
          desc: "We conduct comprehensive energy audits to evaluate energy consumption, identify inefficiencies, and recommend solutions that reduce costs and environmental impact."
        },
        {
          title: "2. System Upgrades",
          desc: "Our team provides system upgrades to optimize existing solar or energy infrastructure, enhancing efficiency, reliability and overall performance."
        },
        {
          title: "3. Solar Financing Assistance",
          desc: "We offer solar financing assistance to help clients access cost-effective funding options, making sustainable energy solutions more affordable and accessible."
        },
        {
          title: "4. Corporate Sustainability Projects",
          desc: "We partner with businesses to implement corporate sustainability projects, from renewable energy installations to environmental initiatives, helping organizations meet their sustainability goals and ESG commitments."
        }
      ],
      images: [
        "/blogs/agrivoltaics_farming.png",
        "/blogs/floating_solar_farm.png",
        "/blogs/utility_scale_solar.png"
      ]
    }
  ];

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

      const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

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
    <div ref={containerRef} className="w-full min-h-screen bg-[#f8f9fa] flex flex-col">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} isVideoLoaded={isVideoLoaded} />}

      {/* SECTION 1: Hero Fold (Full-bleed sky & house image) */}
      <div className="w-full h-[130vh] min-h-[950px] shrink-0 relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#90d4f7] via-[#c5e6f8] to-[#e1f2fb]">

        {/* Outer frame - now full-bleed */}
        <div className="inner-dashboard relative opacity-0 w-full h-full overflow-hidden">

          {/* Noise Overlay */}
          <div
            className="absolute inset-0 z-10 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
              backgroundSize: "161px",
              backgroundRepeat: "repeat"
            }}
          />

          {/* Foreground Content Wrapper */}
          <div className="relative z-20 w-full h-full pt-4 px-4 pb-0 sm:pt-6 sm:px-6 sm:pb-0 lg:pt-8 lg:px-8 lg:pb-0 flex flex-col justify-between overflow-hidden">

            {/* Navigation Header */}
            <header className="relative z-[100] transform-gpu flex-none flex items-center justify-between pb-4 pt-0 -mt-2 lg:-mt-3 w-full px-4 lg:px-8">

              {/* Left Section: Logo */}
              <div className="nav-item-anim opacity-0 relative z-50 transform-gpu flex items-center justify-start shrink-0">
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

              {/* Center Section: Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6 xl:gap-8 2xl:gap-10 justify-center whitespace-nowrap">
                {/* Home */}
                <div className="nav-item-anim opacity-0 relative py-2 cursor-pointer group">
                  <button
                    onClick={() => setActiveTab("Home")}
                    className={`text-sm lg:text-[15px] xl:text-base 2xl:text-[17px] font-bold cursor-pointer transition-colors duration-300 ${activeTab === "Home" ? "text-stone-950 font-extrabold" : "text-stone-700 hover:text-[#00AC4E]"
                      }`}
                  >
                    Home
                  </button>
                  <div className={`absolute bottom-[0px] left-0 h-[3px] bg-[#00AC4E] transition-all duration-300 ${activeTab === "Home" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"}`} />
                </div>

                {/* About */}
                <div className="nav-item-anim opacity-0 relative py-2 cursor-pointer group">
                  <button
                    onClick={() => setActiveTab("About Us")}
                    className={`text-sm lg:text-[15px] xl:text-base 2xl:text-[17px] font-bold cursor-pointer transition-colors duration-300 ${activeTab === "About Us" ? "text-stone-950 font-extrabold" : "text-stone-700 hover:text-[#00AC4E]"
                      }`}
                  >
                    About
                  </button>
                  <div className={`absolute bottom-[0px] left-0 h-[3px] bg-[#00AC4E] transition-all duration-300 ${activeTab === "About Us" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"}`} />
                </div>

                {/* Solution Dropdown */}
                <div
                  className="nav-item-anim opacity-0 relative py-4 -my-2 group"
                  onMouseEnter={() => setActiveDropdown("Solutions")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span className="text-sm lg:text-[15px] xl:text-base 2xl:text-[17px] font-bold cursor-pointer text-stone-700 hover:text-[#00AC4E] transition-colors duration-300">
                    Solution
                  </span>
                  <div className="absolute bottom-[8px] left-0 w-0 h-[3px] bg-[#00AC4E] transition-all duration-300 group-hover:w-full group-hover:opacity-50" />

                  {/* Solutions Mega Menu Dropdown */}
                  {activeDropdown === "Solutions" && (
                    <div className="absolute top-[52px] left-1/2 -translate-x-1/2 w-[500px] bg-white/95 backdrop-blur-3xl border border-white/60 rounded-[28px] p-2.5 flex shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.03)] z-[200] animate-dropdown-fade">
                      <div className="grid grid-cols-2 gap-1.5 w-full">
                        {servicesData.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-[22px] hover:bg-stone-50/60 active:bg-stone-100/50 cursor-pointer transition-colors duration-200 flex flex-col gap-1 text-left relative group/opt"
                            onClick={() => {
                              setActiveTab(item.title);
                              setActiveDropdown(null);
                            }}
                          >
                            <span className="text-[10px] font-extrabold text-[#00AC4E] tracking-widest font-mono uppercase">{item.number}</span>
                            <span className="text-sm font-bold text-stone-900 group-hover/opt:text-[#00AC4E] transition-colors">{item.title}</span>
                            <span className="text-[11px] text-stone-500 font-medium leading-normal mt-0.5 line-clamp-2">{item.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Projects */}
                <div className="nav-item-anim opacity-0 relative py-2 cursor-pointer group">
                  <Link
                    href="/projects"
                    className="text-sm lg:text-[15px] xl:text-base 2xl:text-[17px] font-bold cursor-pointer transition-colors duration-300 text-stone-700 hover:text-[#00AC4E]"
                  >
                    Projects
                  </Link>
                  <div className="absolute bottom-[0px] left-0 h-[3px] bg-[#00AC4E] transition-all duration-300 w-0 opacity-0 group-hover:w-full group-hover:opacity-50" />
                </div>

                {/* FAQ */}
                <div className="nav-item-anim opacity-0 relative py-2 cursor-pointer group">
                  <button
                    onClick={() => {
                      const element = document.getElementById("faq") || document.getElementById("services");
                      element?.scrollIntoView({ behavior: "smooth" });
                      setActiveTab("FAQ");
                    }}
                    className={`text-sm lg:text-[15px] xl:text-base 2xl:text-[17px] font-bold cursor-pointer transition-colors duration-300 ${activeTab === "FAQ" ? "text-stone-950 font-extrabold" : "text-stone-700 hover:text-[#00AC4E]"
                      }`}
                  >
                    FAQ
                  </button>
                  <div className={`absolute bottom-[0px] left-0 h-[3px] bg-[#00AC4E] transition-all duration-300 ${activeTab === "FAQ" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"}`} />
                </div>
              </nav>

              {/* Right Section: Consultation Button */}
              <div className="hidden lg:flex items-center justify-end z-50 transform-gpu shrink-0">
                <button
                  onClick={() => setActiveTab("Contact")}
                  className="inline-flex items-center gap-3.5 bg-white/40 hover:bg-white/60 text-stone-900 font-bold rounded-full pl-5 pr-1.5 py-1.5 border border-white/60 shadow-[0_4px_18px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all duration-300 group cursor-pointer backdrop-blur-md"
                >
                  <span className="tracking-wide text-[14px]">Get Consultation</span>
                  <div className="w-7 h-7 rounded-full bg-stone-950 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  </div>
                </button>
              </div>

              {/* Mobile hamburger menu (visible strictly below lg) */}
              <div className="flex justify-end lg:hidden z-50">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="nav-item-anim opacity-0 bg-stone-900/10 hover:bg-stone-900/20 active:bg-stone-900/30 border border-stone-900/10 w-11 h-11 rounded-full flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
                  aria-label="Toggle Menu"
                >
                  <div className={`w-4.5 h-0.5 bg-stone-950 rounded-full transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                  <div className={`w-4.5 h-0.5 bg-stone-950 rounded-full transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
                  <div className={`w-4.5 h-0.5 bg-stone-950 rounded-full transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
              </div>
            </header>

            {/* Main Content Wrapper (matches framer-9onuti) */}
            <div className="flex-1 flex flex-col items-center justify-end pb-8 text-center px-4 max-w-4xl mx-auto z-30 select-none translate-y-16 sm:translate-y-24 lg:translate-y-32">



              {/* Hero Text Content (matches framer-wfzur6) */}
              <div className="flex flex-col items-center gap-4 max-w-3xl">
                {/* Solar Energy Title (matches framer-1nvzpyf) */}
                <motion.h1
                  variants={containerVariants}
                  initial="hidden"
                  animate={isLoading ? "hidden" : "visible"}
                  className="font-display text-5xl sm:text-[56px] lg:text-[64px] leading-[1.08] lg:leading-[1.04] font-semibold tracking-[-0.03em] text-[#111111] max-w-2xl lg:max-w-3xl text-center"
                >
                  {titleWords.map((word, i) => (
                    <span key={i} className="inline-block mr-[0.22em] overflow-hidden">
                      <motion.span variants={wordVariants} className="inline-block">
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </motion.h1>

                {/* Solar Solutions Description (matches framer-cokco8) */}
                <motion.p
                  variants={containerVariants}
                  initial="hidden"
                  animate={isLoading ? "hidden" : "visible"}
                  className="text-stone-600 font-medium text-xs sm:text-sm lg:text-[15px] leading-[1.4] max-w-xl text-center"
                >
                  {descLines.map((line, lineIdx) => (
                    <span key={lineIdx} className="block">
                      {line.map((word, wordIdx) => (
                        <span key={wordIdx} className="inline-block mr-[0.2em] overflow-hidden">
                          <motion.span variants={wordVariants} className="inline-block">
                            {word}
                          </motion.span>
                        </span>
                      ))}
                    </span>
                  ))}
                </motion.p>
              </div>

              {/* Call To Actions (matches framer-pvrod3) */}
              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                className="mt-8"
              >
                <button
                  onClick={() => setActiveTab("Contact")}
                  className="inline-flex items-center gap-2.5 bg-[#111111] hover:bg-[#1c1c1c] text-white font-bold rounded-xl pl-4.5 pr-1.5 py-1 border border-white/10 shadow-lg active:scale-[0.98] transition-all duration-300 group cursor-pointer"
                >
                  <span className="tracking-wide text-[14px]">Get Consultation</span>
                  <div className="w-7 h-7 rounded-lg bg-[#e2fa5a] relative overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105">
                    {/* First Arrow (slides out top-right on hover) */}
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full group-hover:-translate-y-full">
                      <ArrowUpRight className="w-3.5 h-3.5 text-stone-950 stroke-[2.5]" />
                    </div>
                    {/* Second Arrow (slides in from bottom-left on hover) */}
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0">
                      <ArrowUpRight className="w-3.5 h-3.5 text-stone-950 stroke-[2.5]" />
                    </div>
                  </div>
                </button>
              </motion.div>
            </div>

            {/* Bottom Roofing Image - Fits the bottom of the hero fold flush from edge to edge */}
            <motion.div
              variants={roofingImageVariants}
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              className="relative z-30 mt-auto select-none pointer-events-none -mx-4 sm:-mx-6 lg:-mx-8 -mb-6 sm:-mb-9 lg:-mb-12 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)]"
            >
              <Image
                src="/new-hero.png"
                alt="Modern house with solar panels, large windows, and a parked car."
                width={6250}
                height={3516}
                sizes="100vw"
                priority
                className="w-full h-auto block transition-transform duration-300 scale-105 translate-x-4 sm:translate-x-6 lg:translate-x-8"
              />
            </motion.div>

          </div>

          {/* Mobile Fullscreen Glass Drawer Menu */}
          {isMobileMenuOpen && (
            <div className="absolute inset-0 z-[100] bg-[#0c120c]/95 backdrop-blur-3xl flex flex-col p-6 sm:p-10 justify-between overflow-y-auto rounded-[20px] sm:rounded-[28px]">
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
                        { name: "Projects", href: "/projects" },
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

      {/* SECTION 1.5: Infinite Logo Marquee */}
      <div className="w-full bg-[#f8f9fa] border-y border-stone-200/50 py-10 overflow-hidden relative z-30">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
        <div className="max-w-[1360px] mx-auto px-6 sm:px-12 lg:px-24">
          <p className="text-center text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-stone-400 uppercase mb-8">
            / TRUSTED BY & INTEGRATING WITH INDUSTRY LEADERS /
          </p>
          
          <div className="relative w-full overflow-hidden">
            {/* Fade overlays on the sides */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none" />
            
            <div className="flex w-[200%] animate-marquee gap-16 md:gap-24 items-center whitespace-nowrap">
              {/* Double array to make infinite loop seamless */}
              {[...Array(2)].map((_, loopIdx) => (
                <div key={loopIdx} className="flex shrink-0 justify-around w-1/2 gap-16 md:gap-24 items-center">
                  
                  {/* Brand 1: Jinko */}
                  <div className="flex items-center gap-2 text-stone-400 hover:text-[#00AC4E] transition-colors duration-300">
                    <span className="font-display text-lg font-black tracking-tighter uppercase">Jinko</span>
                    <span className="text-[10px] font-mono font-bold tracking-widest bg-stone-200/50 px-1.5 py-0.5 rounded text-stone-500">SOLAR</span>
                  </div>

                  {/* Brand 2: Huawei */}
                  <div className="flex items-center gap-2 text-stone-400 hover:text-[#00AC4E] transition-colors duration-300">
                    <span className="font-display text-lg font-black tracking-tight uppercase">Huawei</span>
                    <span className="text-[10px] font-mono font-bold tracking-widest bg-stone-200/50 px-1.5 py-0.5 rounded text-stone-500">SMART PV</span>
                  </div>

                  {/* Brand 3: Growatt */}
                  <div className="flex items-center gap-2 text-stone-400 hover:text-[#00AC4E] transition-colors duration-300">
                    <span className="font-display text-lg font-black tracking-tight uppercase">Growatt</span>
                  </div>

                  {/* Brand 4: Trina */}
                  <div className="flex items-center gap-2 text-stone-400 hover:text-[#00AC4E] transition-colors duration-300">
                    <span className="font-display text-lg font-black tracking-tighter uppercase">Trina</span>
                    <span className="text-[10px] font-mono font-bold tracking-widest bg-stone-200/50 px-1.5 py-0.5 rounded text-stone-500">SOLAR</span>
                  </div>

                  {/* Brand 5: SMA */}
                  <div className="flex items-center gap-2 text-stone-400 hover:text-[#00AC4E] transition-colors duration-300">
                    <span className="font-display text-xl font-black tracking-widest uppercase italic">SMA</span>
                  </div>

                  {/* Brand 6: Solis */}
                  <div className="flex items-center gap-2 text-stone-400 hover:text-[#00AC4E] transition-colors duration-300">
                    <span className="font-display text-lg font-black tracking-tight uppercase">Solis</span>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: About Us */}
      <section
        id="about"
        className="w-full bg-white text-stone-900 py-24 md:py-32 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-stone-100/80 relative overflow-hidden"
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
              <h2 className="font-display text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight text-stone-950 leading-tight">
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
                  src="/about_us_office_v4.png"
                  alt="Solar Design and Office Engineering Team"
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-lg border border-stone-100/50 group/img">
                <Image
                  src="/about_us_engineers_v4.png"
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
                  src="/about_us_tech_v4.png"
                  alt="Advanced Lithium BESS and Inverters Room"
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-lg border border-stone-100/50 group/img">
                <Image
                  src="/about_us_building_v4.png"
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
            <span className="text-[#00AC4E] font-mono text-xs font-bold tracking-[0.2em] uppercase mb-3">
              / ADVANTAGES /
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1] text-stone-900 font-display font-black bento-card-anim">
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
                      src="/leaf_drops.png"
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
                      { src: "/about_solar_rooftop_v3.png", label: "Rooftop Solar" },
                      { src: "/about_solar_installers_v3.png", label: "Certified Installers" },
                      { src: "/about_solar_details_v3.png", label: "Precision Tech" },
                      { src: "/about_solar_farm_v3.png", label: "Commercial Scale" },
                      // Duplicate for infinite scroll
                      { src: "/about_solar_rooftop_v3.png", label: "Rooftop Solar" },
                      { src: "/about_solar_installers_v3.png", label: "Certified Installers" },
                      { src: "/about_solar_details_v3.png", label: "Precision Tech" },
                      { src: "/about_solar_farm_v3.png", label: "Commercial Scale" }
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
                <video
                  src="/%22Cinematic%20drone%20flyby%20shot%20of%20a%20luxury%20solar%20roof%20home%20with%20modern%20sleek%20blue%20solar%20modules%20during%20midday%2C%20clear%20blue%20sky%2C%20hyperrealistic%208k%22.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
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
                      src="/leaf_drops.png"
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
                      src="/leaf_drops.png"
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
                <video
                  src="/%22Cinematic%20sunset%20sliding%20shot%20of%20premium%20black%20monocrystalline%20solar%20panels%20on%20a%20luxury%20architectural%20home%20roof%20reflecting%20orange%20and%20pink%20skies%2C%20photorealistic%204k%22.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
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
                          src="/leaf_drops.png"
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

      {/* SECTION 4.4: Services Accordion Section */}
      <section id="services" className="w-full bg-[#085EAC] text-white py-16 md:py-20 relative overflow-hidden z-20 border-t border-white/10">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-12 lg:px-24">

          {/* Header layout: 2-column split on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 md:mb-16 items-center">

            {/* Title column with vertical green tag stroke */}
            <div className="lg:col-span-8 flex items-center gap-4">
              <div className="w-[3px] h-8 sm:h-10 bg-[#00AC4E] shrink-0" />
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-none text-white">
                Services.
              </h2>
            </div>

            {/* Description column */}
            <div className="lg:col-span-4 lg:pt-1">
              <p className="text-white text-sm sm:text-base font-semibold leading-relaxed">
                Explore how our advanced solar systems, smart microgrids, and end-to-end technical services deliver clean energy, operational savings, and lasting environmental impact.
              </p>
            </div>

          </div>

          {/* Accordion List */}
          <div className="border-b border-white/10">
            {servicesData.map((service, idx) => {
              const isOpen = activeService === idx;
              return (
                <div
                  key={idx}
                  ref={(el) => { serviceRefs.current[idx] = el; }}
                  className="border-t border-white/10 py-6 sm:py-7 md:py-8 transition-all duration-300"
                >

                  {/* Header (Trigger) */}
                  <div
                    onClick={() => setActiveService(isOpen ? null : idx)}
                    className="flex items-center justify-between cursor-pointer group select-none"
                  >
                    <div className="flex items-baseline gap-4 sm:gap-6 transform group-hover:translate-x-2 transition-transform duration-300">
                      <span className="font-mono text-xs sm:text-sm font-black text-white">
                        {service.number} <span className="text-white font-extrabold">/</span>
                      </span>
                      <h3 className="font-display text-lg sm:text-2xl md:text-[28px] font-black text-white group-hover:text-white transition-colors duration-300 leading-tight">
                        {service.title}
                      </h3>
                    </div>

                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 group-hover:border-white/30 text-white transition-all duration-300 shrink-0 ${isOpen ? 'bg-[#00AC4E] text-white border-transparent' : ''}`}>
                      <svg
                        className={`w-3.5 h-3.5 sm:w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
                      </svg>
                    </div>
                  </div>

                  {/* Collapsible content body */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pt-4 pb-4">

                      {/* Left Column: Description & Action */}
                      <div className="lg:col-span-5 flex flex-col justify-start lg:pb-2">
                        <p className="text-white text-base sm:text-lg font-semibold leading-relaxed max-w-md">
                          {service.description}
                        </p>
                        <div className="mt-6">
                          <Link
                            href="#contact"
                            className="inline-flex items-center gap-3 bg-white text-[#085EAC] hover:bg-white/90 font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 group/btn border border-white/10"
                          >
                            <span>Get started</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#085EAC] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                          </Link>
                        </div>
                      </div>

                      {/* Right Column: Detailed Sub-items */}
                      <div className="lg:col-span-7 flex flex-col gap-4">
                        {service.subItems.map((sub, sIdx) => {
                          const titleParts = sub.title.match(/^(\d+)\.\s*(.*)$/);
                          const subNum = titleParts ? titleParts[1].padStart(2, '0') : `0${sIdx + 1}`;
                          const subTitle = titleParts ? titleParts[2] : sub.title;
                          return (
                            <div key={sIdx} className="flex gap-4 border-b border-white/10 last:border-b-0 pb-4 last:pb-0">
                              <span className="font-mono text-sm sm:text-base font-bold text-white tracking-widest shrink-0 mt-0.5 select-none">
                                {subNum}
                              </span>
                              <div className="flex flex-col gap-1.5">
                                <h4 className="text-white font-bold text-base sm:text-lg tracking-tight leading-snug">
                                  {subTitle}
                                </h4>
                                <p className="text-white text-sm sm:text-base font-medium leading-relaxed">
                                  {sub.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 4.5: Recreated Process Section */}
      <section className="approach-section-trigger w-full bg-[#f8f9fa] text-stone-900 py-24 md:py-32 relative overflow-hidden border-t border-stone-100/50 z-20">

        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-500/[0.015] rounded-full blur-[130px] pointer-events-none select-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-stone-500/[0.015] rounded-full blur-[130px] pointer-events-none select-none delay-1000" />

        <div className="max-w-[1400px] mx-auto pl-8 pr-6 sm:px-12 md:px-16 lg:px-20 relative z-10">

          {/* Header Block (Full Width, Large Headline) */}
          <div className="flex flex-col items-start mb-16 md:mb-24">
            <span className="font-mono text-xs font-bold text-stone-400 tracking-[0.25em] uppercase mb-6 block">
              /The process/
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-stone-900 leading-tight max-w-5xl">
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
      <section className="w-full bg-[#f8f9fa] text-stone-900 py-28 border-t border-stone-200/40 relative z-20 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-[-100px] -translate-y-1/2 w-[500px] h-[500px] bg-[#00AC4E]/[0.03] rounded-full blur-[140px] pointer-events-none select-none" />
        <div className="absolute bottom-[-100px] right-[10%] w-[600px] h-[400px] bg-[#00AC4E]/[0.02] rounded-full blur-[150px] pointer-events-none select-none" />

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
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-stone-200/80 hover:border-[#00AC4E]/30 hover:bg-white text-stone-700 hover:text-[#00AC4E] font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm hover:-translate-y-0.5"
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
                className="bg-white border border-stone-200/50 rounded-[32px] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.015)] hover:shadow-[0_30px_60px_-15px_rgba(0,172,78,0.08)] transition-all duration-500 group flex flex-col justify-between hover:-translate-y-1.5 relative"
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
                    <h4 className="font-display text-xl sm:text-2xl font-black text-stone-900 group-hover:text-[#00AC4E] transition-colors duration-300 leading-snug">
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
                    <div className="w-8 h-8 rounded-full bg-[#00AC4E]/5 border border-[#00AC4E]/20 flex items-center justify-center font-bold text-[#00AC4E] text-xs shadow-sm">
                      {post.author.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-stone-800 leading-none">{post.author.name}</span>
                      <span className="text-[9px] font-bold text-stone-400 tracking-wider mt-1">{post.author.role.split(",")[0]}</span>
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

      <footer
        id="contact"
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
                <li><Link href="/projects" className="hover:text-[#e2ff3a] text-left transition-colors cursor-pointer">Projects</Link></li>
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
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-left">

          {/* Left: Copyright */}
          <div className="text-xs font-bold text-white/50 justify-self-center md:justify-self-start">
            © {new Date().getFullYear()} GES (PVT) LTD. All rights reserved.
          </div>

          {/* Center: Built and Designed by ARC AI */}
          <div className="text-white/80 flex items-center justify-center gap-2 text-xs font-bold justify-self-center">
            <span>Built and Designed by</span>
            <a
              href="https://www.arcai.agency"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center transition-all duration-300 hover:scale-105"
              title="ARC AI - AI Automation and Software Company"
            >
              <Image
                src="/arc-logo.png"
                alt="ARC AI | AI Automation & Software Company"
                width={110}
                height={32}
                className="h-7.5 w-auto object-contain translate-y-[2px]"
              />
            </a>
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center justify-center md:justify-end gap-5 text-white/70 justify-self-center md:justify-self-end">
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

      {/* Fixed Glassmorphism Blur Bar — bottom of viewport, persistent */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none select-none"
        style={{ height: '60px' }}
      >
        <div
          className="w-full h-full"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 100%)',
          }}
        />
      </div>

    </div>
  );
}
