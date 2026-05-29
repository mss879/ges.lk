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

export default function CountUp({
  end,
  duration = 1.5,
  decimals = 0,
  suffix = "",
  prefix = "",
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: end,
        duration: duration,
        ease: "power3.out",
        onUpdate: () => {
          setValue(obj.val);
        },
      });
    });
    return () => ctx.revert();
  }, [end, duration]);

  return (
    <span ref={elementRef}>
      {prefix}
      {value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
