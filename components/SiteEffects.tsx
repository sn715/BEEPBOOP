"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

// Page-wide behaviour that works on server-rendered markup:
// CTA tracking, scroll reveal, sticky mobile CTA and the custom cursor.
export default function SiteEffects() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    // ---------- CTA clicks ----------
    function onCtaClick(event: MouseEvent) {
      const el = (event.target as Element).closest<HTMLElement>("[data-cta]");
      if (el) track("ViewContent", { cta: el.dataset.cta });
    }
    document.addEventListener("click", onCtaClick);
    cleanups.push(() => document.removeEventListener("click", onCtaClick));

    // ---------- Scroll reveal ----------
    const items = document.querySelectorAll(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
      );
      items.forEach((el) => observer.observe(el));
      cleanups.push(() => observer.disconnect());
    }

    // ---------- Sticky mobile CTA: hide while a signup form is visible ----------
    const bar = document.querySelector("[data-sticky-cta]");
    if (bar && "IntersectionObserver" in window) {
      const visible = new Set<Element>();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        bar.classList.toggle("is-hidden", visible.size > 0);
      });
      document.querySelectorAll('[data-form="email-capture"]').forEach((form) => observer.observe(form));
      cleanups.push(() => observer.disconnect());
    }

    // ---------- Custom cursor (mouse/trackpad only) ----------
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const cursor = document.createElement("div");
      cursor.className = "cursor is-hidden";
      cursor.setAttribute("aria-hidden", "true");
      cursor.innerHTML = '<span class="cursor__label"></span>';
      document.body.appendChild(cursor);
      document.documentElement.classList.add("has-cursor");

      const label = cursor.querySelector<HTMLElement>(".cursor__label")!;
      const interactive = "a, button, summary, label, [data-cursor-label]";
      let x = 0;
      let y = 0;
      let frame: number | null = null;

      const render = () => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        frame = null;
      };
      const onMove = (event: MouseEvent) => {
        x = event.clientX;
        y = event.clientY;
        cursor.classList.remove("is-hidden");
        if (!frame) frame = requestAnimationFrame(render);
      };
      const onOver = (event: MouseEvent) => {
        const target = event.target as Element;
        const overField = target.closest("input, textarea, select");
        const overInteractive = target.closest<HTMLElement>(interactive);
        const text = overInteractive ? overInteractive.dataset.cursorLabel || "" : "";
        cursor.classList.toggle("is-field", Boolean(overField));
        cursor.classList.toggle("is-hover", Boolean(overInteractive));
        cursor.classList.toggle("has-label", Boolean(text));
        label.textContent = text;
      };
      const onLeave = () => cursor.classList.add("is-hidden");
      const onDown = () => cursor.classList.add("is-down");
      const onUp = () => cursor.classList.remove("is-down");

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseover", onOver);
      document.addEventListener("mouseleave", onLeave);
      document.addEventListener("mousedown", onDown);
      document.addEventListener("mouseup", onUp);
      cleanups.push(() => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseover", onOver);
        document.removeEventListener("mouseleave", onLeave);
        document.removeEventListener("mousedown", onDown);
        document.removeEventListener("mouseup", onUp);
        document.documentElement.classList.remove("has-cursor");
        cursor.remove();
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
