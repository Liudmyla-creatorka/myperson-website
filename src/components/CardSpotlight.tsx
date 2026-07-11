"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import styles from "./CardSpotlight.module.css";

// A local, per-card cursor-follow glow: tracks pointer position relative to
// *this card* (not window), scoped by listening on the card itself rather
// than window. This is what lets it sit at a fixed z-index between a
// single card's own tint layer and its text layer — a shared, portaled
// cursor light can only exist in one place in the DOM at a time, so it
// can't be "inside" several different cards' stacking order at once.
// Mount it as the first child of any `position: relative` card that owns
// a `::before` tint/blur layer and a text layer above it.
export function CardSpotlight() {
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

  // data-card-spotlight is a stable, unscoped hook: CSS Modules hash class
  // names per file, so a consuming section's own module (e.g. "card:hover
  // .spotlight") can't reach this component's module-scoped .spotlight
  // class directly. The section's CSS targets this attribute instead (via
  // :global(...)) to flip opacity on hover/focus.
  return (
    <div
      ref={ref}
      className={styles.spotlight}
      data-card-spotlight=""
      aria-hidden="true"
    />
  );
}
