"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
  /** Accepted for compatibility with callers; the timing is self-contained. */
  isVideoLoaded?: boolean;
}

const DURATION = 1100; // ms for the line to fill

/**
 * Minimal welcome screen shown on first paint.
 *
 * Deliberately plain: a greeting, the brand, and a thin progress line. It
 * hands control back through `onComplete` once the exit animation finishes.
 */
export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep the callback stable so a parent re-render cannot cancel the exit.
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Time-based progress, so it behaves the same regardless of frame rate.
  useEffect(() => {
    let frame: number;
    const start = Date.now();

    const tick = () => {
      const pct = Math.min(Math.round(((Date.now() - start) / DURATION) * 100), 100);
      setProgress(pct);
      if (pct < 100) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".welcome-item",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }
      );
    }, overlayRef);
    return () => ctx.revert();
  }, []);

  // Exit
  useEffect(() => {
    if (progress < 100) return;

    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap
          .timeline({
            onComplete: () => onCompleteRef.current?.(),
          })
          .to(contentRef.current, { opacity: 0, y: -10, duration: 0.4, ease: "power2.in" })
          .to(overlayRef.current, { opacity: 0, duration: 0.45, ease: "power2.inOut" }, "-=0.2");
      }, overlayRef);
      return () => ctx.revert();
    }, 250);

    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] flex select-none items-center justify-center overflow-hidden bg-[#f8f9fa]"
    >
      <div ref={contentRef} className="flex flex-col items-center px-6">
        <h1 className="welcome-item font-display text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
          Welcome
        </h1>

        <span className="welcome-item mt-3 font-display text-[10px] font-extrabold uppercase tracking-[0.35em] text-stone-400">
          Green Engineering Systems
        </span>

        <div className="welcome-item mt-8 h-px w-40 overflow-hidden rounded-full bg-stone-200 sm:w-52">
          <div
            className="h-full rounded-full bg-[#00AC4E] transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
