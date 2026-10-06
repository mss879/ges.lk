"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

/**
 * A number that counts up when it scrolls into view.
 *
 * The server renders the final value, so crawlers and no-JS visitors read
 * "10+ Years" rather than "0+". On the client, a counter that starts off-screen
 * is quietly reset to 0 and animates when it appears; one already on screen at
 * load keeps its final value instead of flashing back to zero.
 */
export default function CountUp({
  end,
  duration = 1.5,
  decimals = 0,
  suffix = "",
  prefix = "",
}: CountUpProps) {
  const [value, setValue] = useState(end);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const visibleNow = rect.top < window.innerHeight && rect.bottom > 0;
    if (visibleNow) return;

    setValue(0);
    const obj = { val: 0 };
    let tween: gsap.core.Tween | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        tween = gsap.to(obj, {
          val: end,
          duration,
          ease: "power3.out",
          onUpdate: () => setValue(obj.val),
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [end, duration]);

  return (
    <span ref={elementRef}>
      {prefix}
      {value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
