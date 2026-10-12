"use client";

import { useEffect, useRef, useState } from "react";

// Text lights up word by word as the block scrolls through the viewport
export default function ScrollWords({ className, text }: { className?: string; text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const words = text.trim().split(/\s+/);
  const [lit, setLit] = useState(words.length);

  useEffect(() => {
    const block = ref.current;
    if (!block || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    function update() {
      const rect = block!.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top hits 85% of the viewport, 1 when its bottom reaches 55%
      const start = vh * 0.85;
      const end = vh * 0.55;
      const progress = (start - rect.top) / (rect.height + start - end);
      setLit(Math.round(Math.min(Math.max(progress, 0), 1) * words.length));
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [words.length]);

  return (
    <div ref={ref} className={className} data-scroll-words>
      <p>
        {words.map((word, i) => (
          <span key={i}>
            <span className={`word${i < lit ? " is-lit" : ""}`}>{word}</span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </p>
    </div>
  );
}
