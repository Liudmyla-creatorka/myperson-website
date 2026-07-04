"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

type ScrollRevealListProps = {
  children: ReactNode;
  className?: string;
};

export function ScrollRevealList({
  children,
  className,
}: ScrollRevealListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.children) as HTMLElement[];

    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      items,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
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
  }, [prefersReducedMotion]);

  return (
    <ul role="list" ref={listRef} className={className}>
      {children}
    </ul>
  );
}
