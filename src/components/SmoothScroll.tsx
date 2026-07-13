"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePathname } from "@/i18n/navigation";

// Lenis takes over scroll entirely, so the browser's native "jump to
// #hash on load" behavior never fires. Without this, links like the
// Header's Kontakt -> /#kontakt land on the page without scrolling.
function scrollToHash(lenis: Lenis | null, reducedMotion: boolean) {
  const hash = window.location.hash;
  if (!hash) return;

  const target = document.querySelector(hash);
  if (!(target instanceof HTMLElement)) return;

  if (lenis) {
    lenis.scrollTo(target, { immediate: reducedMotion });
  } else {
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }
}

export function SmoothScroll() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis();
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    function onTick(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisRef.current = null;
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    // A microtask/timeout (not rAF) so this fires even while the tab is
    // backgrounded — rAF is paused for hidden tabs, setTimeout isn't.
    const timeout = setTimeout(
      () => scrollToHash(lenisRef.current, prefersReducedMotion),
      0,
    );
    return () => clearTimeout(timeout);
  }, [pathname, prefersReducedMotion]);

  useEffect(() => {
    function handleHashChange() {
      scrollToHash(lenisRef.current, prefersReducedMotion);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [prefersReducedMotion]);

  return null;
}
