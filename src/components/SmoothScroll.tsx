"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    function onTick(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return null;
}
