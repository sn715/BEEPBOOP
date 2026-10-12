"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

// Leans its first child gently toward the mouse (mouse/trackpad only, respects reduced motion)
export default function Tilt({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  function canTilt() {
    return (
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }

  function setTilt(x: string, y: string) {
    const target = ref.current?.firstElementChild as HTMLElement | null;
    target?.style.setProperty("--tilt-x", x);
    target?.style.setProperty("--tilt-y", y);
  }

  function handleMove(event: MouseEvent<HTMLElement>) {
    if (!ref.current || !canTilt()) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt(`${(-y * 8).toFixed(2)}deg`, `${(x * 10).toFixed(2)}deg`);
  }

  return (
    <figure ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={() => setTilt("0deg", "0deg")}>
      {children}
    </figure>
  );
}
