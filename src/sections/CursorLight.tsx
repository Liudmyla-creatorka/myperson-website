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
    if (!el) return;

    if (window.matchMedia("(pointer: fine)").matches) {
      const setX = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const setY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

      function handlePointerMove(event: PointerEvent) {
        setX(event.clientX);
        setY(event.clientY);
      }

      window.addEventListener("pointermove", handlePointerMove);
      return () => window.removeEventListener("pointermove", handlePointerMove);
    }

    // Touch devices have no persistent pointer position, so the spot can't
    // "follow" anything at rest — it idly drifts instead, so the glow never
    // reads as a dead, static element. A real touchmove takes over
    // immediately (overwrite:"auto" lets the new tween cancel whichever of
    // the two — idle or follow — is currently animating x/y), and idling
    // resumes shortly after the finger lifts.
    let idleTween: gsap.core.Tween | null = null;
    let idleTimeout: ReturnType<typeof setTimeout> | null = null;

    function startIdleFloat() {
      idleTween = gsap.to(el, {
        x: `+=${40 + Math.random() * 30}`,
        y: `+=${30 + Math.random() * 30}`,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        overwrite: "auto",
      });
    }

    function clearIdleTimer() {
      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = null;
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      idleTween?.kill();
      clearIdleTimer();
      gsap.to(el, {
        x: touch.clientX,
        y: touch.clientY,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    function handleTouchStart() {
      idleTween?.kill();
    }

    function handleTouchEnd() {
      clearIdleTimer();
      idleTimeout = setTimeout(startIdleFloat, 1200);
    }

    gsap.set(el, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    startIdleFloat();

    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      idleTween?.kill();
      clearIdleTimer();
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isOwner, prefersReducedMotion]);

  if (!isOwner || prefersReducedMotion) return null;

  return createPortal(
    <div ref={ref} className={styles.light} aria-hidden="true" />,
    document.body,
  );
}
