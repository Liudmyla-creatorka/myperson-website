"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import styles from "./ServicesShowcase.module.css";

// Local counterpart to CursorLight: instead of one shared, viewport-tracking
// glow, each card gets its own instance tracking pointer position relative
// to *that card* (not window), scoped by listening on the card itself
// rather than window. This is what lets it sit at a fixed z-index between
// a single card's own tint layer and its text layer — a shared, portaled
// CursorLight can only exist in one place in the DOM at a time, so it
// can't be "inside" four different cards' stacking order at once.
export function ServicesCardSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = ref.current;
    const card = el?.parentElement;
    if (!el || !card || !window.matchMedia("(pointer: fine)").matches) return;

    const setX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const setY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    function handlePointerMove(event: PointerEvent) {
      const rect = card!.getBoundingClientRect();
      setX(event.clientX - rect.left);
      setY(event.clientY - rect.top);
    }

    card.addEventListener("pointermove", handlePointerMove);
    return () => card.removeEventListener("pointermove", handlePointerMove);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return <div ref={ref} className={styles.spotlight} aria-hidden="true" />;
}
