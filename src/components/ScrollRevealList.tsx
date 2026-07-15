"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

type ScrollRevealListProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function ScrollRevealList({
  children,
  className,
  stagger = 0.1,
}: ScrollRevealListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.children) as HTMLElement[];

    if (prefersReducedMotion) {
      gsap.set(items, { clearProps: "transform,opacity" });
      return;
    }

    // Narrow/coarse-pointer viewports get a shorter travel distance and
    // duration — less repaint area moving, fewer total frames to hit
    // 60fps on mid-tier mobile hardware — rather than the full desktop
    // reveal, which has more headroom to be lush.
    const isCompact = window.matchMedia(
      "(max-width: 47.99rem), (pointer: coarse)",
    ).matches;

    // clearProps removes the inline transform/opacity GSAP leaves behind
    // once the reveal settles — otherwise those inline styles permanently
    // outrank any CSS rule that also targets opacity or transform (e.g.
    // the Usługi cards' hover lift, or their sibling-dimming effect).
    const tween = gsap.fromTo(
      items,
      { opacity: 0, y: isCompact ? 16 : 32 },
      {
        opacity: 1,
        y: 0,
        duration: isCompact ? 0.5 : 0.8,
        ease: isCompact ? "power2.out" : "power3.out",
        stagger: isCompact ? Math.min(stagger, 0.06) : stagger,
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: list,
          start: "top 85%",
          once: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [prefersReducedMotion, stagger]);

  return (
    <ul role="list" ref={listRef} className={className}>
      {children}
    </ul>
  );
}
