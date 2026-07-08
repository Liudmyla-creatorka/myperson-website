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

    // clearProps removes the inline transform/opacity GSAP leaves behind
    // once the reveal settles — otherwise those inline styles permanently
    // outrank any CSS rule that also targets opacity or transform (e.g.
    // the Usługi cards' hover lift, or their sibling-dimming effect).
    const tween = gsap.fromTo(
      items,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger,
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
