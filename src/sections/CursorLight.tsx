"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import styles from "./CursorLight.module.css";

// Hero and Usługi each mount their own <CursorLight/>, but only one glow
// should ever exist on screen. Portaling to document.body escapes every
// section's own overflow/stacking context, so without this claim, both
// mounted instances would each get their own body-level div, both
// tracking the same pointer and stacking their blend on top of each other.
let claimedBy: symbol | null = null;

export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef<symbol>(Symbol("cursor-light"));
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const id = idRef.current;
    if (claimedBy === null) {
      claimedBy = id;
      setIsOwner(true);
    }
    return () => {
      if (claimedBy === id) claimedBy = null;
    };
  }, []);

  useEffect(() => {
    if (!isOwner || prefersReducedMotion) return;

    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;

    const setX = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const setY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    function handlePointerMove(event: PointerEvent) {
      setX(event.clientX);
      setY(event.clientY);
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [isOwner, prefersReducedMotion]);

  if (!isOwner || prefersReducedMotion) return null;

  return createPortal(
    <div ref={ref} className={styles.light} aria-hidden="true" />,
    document.body,
  );
}
