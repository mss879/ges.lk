"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/data/heroSlides";

const AUTOPLAY_MS = 6000;

/**
 * Full-bleed homepage hero slider. Replaces the previous static hero fold.
 * Slides come from `@/data/heroSlides` so the content can move to Supabase
 * later without changing this component.
 */
export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const count = slides.length;

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay — pauses on hover/focus and when the tab is hidden.
  useEffect(() => {
    if (paused || count <= 1) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  // Arrow-key navigation when the slider has focus.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  };

  if (count === 0) return null;

  return (
    <section
      ref={containerRef}
      aria-roledescription="carousel"
      aria-label="Featured GES solutions"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative w-full h-[clamp(540px,78vh,860px)] overflow-hidden bg-[#08150c] outline-none"
    >
      {slides.map((slide, i) => {
        const isActive = i === index;
        return (
          <div
            key={slide.id}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${slide.title}`}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[7000ms] ease-out motion-reduce:transform-none ${
                isActive ? "scale-105" : "scale-100"
              }`}
            />

            {/* Legibility scrim — darker at the bottom-left where the copy sits. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />

            <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 flex flex-col justify-end pb-16 sm:pb-20">
              <div
                className={`max-w-xl transition-all duration-700 ease-out ${
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <p className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#e2ff3a] uppercase mb-4">
                  / {slide.eyebrow} /
                </p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[0.95]">
                  {slide.title}
                </h1>
                <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-md">
                  {slide.description}
                </p>
                <Link
                  href={slide.href}
                  tabIndex={isActive ? 0 : -1}
                  className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#00AC4E] hover:bg-[#019544] text-white text-sm font-bold pl-6 pr-5 py-3.5 transition-colors duration-300"
                >
                  Explore Solutions
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Controls */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors duration-300 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors duration-300 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  i === index ? "w-8 bg-[#e2ff3a]" : "w-3 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
