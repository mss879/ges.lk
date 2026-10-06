"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A muted, looping background video that costs nothing until it is about to
 * be seen.
 *
 * The homepage's two decorative clips sit well below the fold but used to
 * autoplay on load — ~5 MB downloaded by every visitor before they scrolled.
 * Here the <video> renders with just a poster; the source is attached when the
 * element comes within ~300px of the viewport, and playback pauses again when
 * it scrolls away. Visitors who prefer reduced motion get the poster only.
 */
export default function LazyVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          // play() rejects if the source is still being attached; the
          // autoplay attribute takes over in that case.
          video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      poster={poster}
      autoPlay={active}
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
    />
  );
}
