"use client";

import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { PageCopy } from "@/types/content";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import styles from "./HeroContent.module.css";

type HeroContentProps = {
  copy: PageCopy;
};

export function HeroContent({ copy }: HeroContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const t = useTranslations("hero");

  useLayoutEffect(() => {
    const root = rootRef.current;
    const headline = headlineRef.current;
    const scrollCue = scrollCueRef.current;
    if (!root || !headline) return;

    const rest = root.querySelectorAll<HTMLElement>("[data-fade]");

    if (prefersReducedMotion) {
      gsap.set(headline, { filter: "blur(0px)", opacity: 1 });
      gsap.set(rest, { y: 0, opacity: 1 });
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .fromTo(
        headline,
        { filter: "blur(20px)", opacity: 0 },
        { filter: "blur(0px)", opacity: 1, duration: 1.5, ease: "power2.out" },
      )
      .fromTo(
        rest,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
        "-=0.9",
      );

    const scrollTween = scrollCue
      ? gsap.to(scrollCue, {
          opacity: 0,
          ease: "power1.out",
          scrollTrigger: {
            start: 0,
            end: 200,
            scrub: true,
          },
        })
      : null;

    return () => {
      timeline.kill();
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={rootRef} className={styles.content}>
      {copy.eyebrow ? (
        <span data-fade className={styles.eyebrow}>
          {copy.eyebrow}
        </span>
      ) : null}
      <h1 ref={headlineRef} className={styles.headline}>
        {copy.title}
      </h1>
      <p data-fade className={styles.paragraph}>
        {copy.intro}
      </p>
      <div data-fade className={styles.actions}>
        {copy.primaryCta ? (
          <Link href={copy.primaryCta.href} className={styles.primaryCta}>
            {copy.primaryCta.label}
          </Link>
        ) : null}
        {copy.secondaryCta ? (
          <Link href={copy.secondaryCta.href} className={styles.secondaryCta}>
            {copy.secondaryCta.label}
          </Link>
        ) : null}
      </div>
      <div ref={scrollCueRef} className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>{t("scroll")}</span>
      </div>
    </div>
  );
}
