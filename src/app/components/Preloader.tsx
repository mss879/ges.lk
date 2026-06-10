"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
  isVideoLoaded: boolean;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState("INITIALIZING SYSTEM...");
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const gridCellsRef = useRef<SVGSVGElement>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep callback ref stable to prevent parent re-renders from clearing the exit timeout
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // High-precision animation frame progress loop: Guarantees exactly 1500ms duration
  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds to reach 100%

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
      
      setProgress(calculatedProgress);

      if (calculatedProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Update status messages dynamically depending on progress
  useEffect(() => {
    if (progress < 20) {
      setPhaseText("HARNESSING SOLAR RADIATION...");
    } else if (progress < 45) {
      setPhaseText("CALIBRATING LITHIUM STORAGE...");
    } else if (progress < 70) {
      setPhaseText("SYNCHRONIZING POWER INVERTERS...");
    } else if (progress < 95) {
      setPhaseText("CONNECTING SMART ECOSYSTEM GRID...");
    } else {
      setPhaseText("SYSTEM OPTIMIZED & ACTIVE");
    }
  }, [progress]);

  // GSAP Entrance Animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const enterTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      
      // Fade in background and glass card with subtle lift
      enterTl.fromTo(
        cardRef.current,
        { opacity: 0, y: 25, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      );

      enterTl.fromTo(
        ".preloader-anim-item",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
        "-=0.8"
      );
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  // Exit timeline when progress completes: Guarantees exactly 1000ms exit flow (200ms hold + 800ms timeline ending at 2.5s total)
  useEffect(() => {
    if (progress === 100) {
      const exitTimeout = setTimeout(() => {
        const ctx = gsap.context(() => {
          const exitTl = gsap.timeline({
            onComplete: () => {
              if (onCompleteRef.current) onCompleteRef.current();
            }
          });

          // High-end lens-zoom exit sequence: card shrinks/fades down, background dissolves
          exitTl.to(cardRef.current, {
            scale: 0.95,
            opacity: 0,
            y: 12,
            duration: 0.6,
            ease: "power4.inOut",
          });

          exitTl.to(
            overlayRef.current,
            {
              opacity: 0,
              scale: 0.98,
              duration: 0.7,
              ease: "power4.inOut",
            },
            "-=0.5"
          );
        }, overlayRef);
      }, 200); // 200ms final system-ready showcase

      return () => clearTimeout(exitTimeout);
    }
  }, [progress]);

  // Generate 24 Solar Cells (6 Columns x 4 Rows)
  const cols = 6;
  const rows = 4;
  const totalCells = cols * rows;
  const activeCells = Math.floor((progress / 100) * totalCells);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] bg-[#f8f9fa] flex items-center justify-center select-none overflow-hidden"
    >
      {/* 1. Fine Engineering Grid Overlay (Luxury Blueprint Background) */}
      <div className="absolute inset-0 grid-background opacity-[0.35] pointer-events-none" />

      {/* 2. Soft Green Radial Sunbeam Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-radial from-primary-green/10 via-primary-green/[0.01] to-transparent blur-[60px] pointer-events-none" />

      {/* 3. Luxury Floating Glassmorphic Panel */}
      <div
        ref={cardRef}
        className="relative w-[88vw] max-w-[480px] p-8 sm:p-10 flex flex-col items-center bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_32px_90px_-20px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] overflow-hidden"
      >
        {/* Subtle glass reflection sheet sweeps */}
        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />

        {/* Minimalist High-End Text Branding (SVG sun logo removed) */}
        <div className="preloader-anim-item flex flex-col items-center mb-10 mt-4">
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[0.5em] text-stone-900 leading-none pl-[0.5em]">
            GES
          </h1>
          <span className="text-[9px] sm:text-[10px] font-extrabold font-display tracking-[0.35em] text-stone-400 uppercase mt-3">
            Green Energy Solutions
          </span>
        </div>

        {/* Smart SVG Solar Array Cells Charging Array */}
        <div className="preloader-anim-item w-full flex flex-col items-center mb-8">
          <span className="text-[9px] font-extrabold font-display tracking-widest text-stone-400 uppercase mb-3.5">
            Photovoltaic Charging Array
          </span>
          <div className="relative p-3 bg-[#f1f5f9]/50 border border-stone-200/50 rounded-2xl shadow-inner w-full flex justify-center">
            <svg
              ref={gridCellsRef}
              viewBox="0 0 230 150"
              className="w-full max-w-[280px] h-auto"
            >
              <defs>
                <linearGradient id="cell-active-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00AC4E" />
                  <stop offset="100%" stopColor="#00AC4E" />
                </linearGradient>
                <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                  <stop offset="0%" stopColor="#00AC4E" />
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Generate columns and rows of solar panel cells */}
              {Array.from({ length: totalCells }).map((_, i) => {
                const colIndex = i % cols;
                const rowIndex = Math.floor(i / cols);
                
                const w = 32;
                const h = 28;
                const gapX = 6;
                const gapY = 6;
                const startX = 6;
                const startY = 8;
                
                const x = startX + colIndex * (w + gapX);
                const y = startY + rowIndex * (h + gapY);
                
                const isActive = i < activeCells;
                
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx="3"
                    className="transition-all duration-500 ease-out"
                    fill={isActive ? "url(#cell-active-grad)" : "#ffffff"}
                    stroke={isActive ? "rgba(0,172,78,0.3)" : "#e2e8f0"}
                    strokeWidth="1"
                    style={{
                      filter: isActive ? "url(#glow)" : "none",
                      opacity: isActive ? 1 : 0.6,
                      transformOrigin: `${x + w/2}px ${y + h/2}px`,
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Linear Elegant Progress Deck */}
        <div className="preloader-anim-item w-full flex flex-col items-center mb-6">
          <div className="w-full flex justify-between items-baseline mb-2">
            <span className="text-[9px] font-black font-display text-primary-green uppercase tracking-widest leading-none">
              Live Grid Feed
            </span>
            <div className="flex items-baseline">
              <span className="text-3xl font-black font-display text-stone-900 tracking-tighter">
                {progress}
              </span>
              <span className="text-[10px] font-extrabold text-stone-400 ml-0.5">%</span>
            </div>
          </div>

          {/* Thin Progress Track & Node */}
          <div className="w-full h-[3px] bg-stone-100 rounded-full relative overflow-hidden shadow-inner border-t border-stone-200/20">
            <div
              className="h-full bg-gradient-to-r from-primary-green to-primary-green rounded-full transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing laser node at progress tip */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#00AC4E] animate-ping" />
            </div>
          </div>
        </div>

        {/* Phase Status Text and Tagline */}
        <div className="preloader-anim-item w-full flex flex-col items-center mt-2">
          {/* Phase text using high-tech monospaced appearance */}
          <p className="text-[10px] font-extrabold font-mono tracking-widest text-stone-500 h-4 text-center select-none uppercase">
            {phaseText}
          </p>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent my-4" />

          {/* Subtext tagline */}
          <span className="text-[8px] font-bold font-display text-stone-400 tracking-[0.25em] uppercase text-center">
            Empowering Sri Lanka · Sustainable Energy
          </span>
        </div>
      </div>
    </div>
  );
}
