"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { PageCopy } from "@/types/content";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import styles from "./HeroContent.module.css";

const MAGNETIC_RADIUS = 90;
const MAGNETIC_STRENGTH = 0.3;
const HOVER_SCALE = 1.03;
const PRESS_SCALE = 0.97;

type HeroContentProps = {
  copy: PageCopy;
};

export function HeroContent({ copy }: HeroContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const primaryCtaRef = useRef<HTMLAnchorElement>(null);
  const secondaryCtaRef = useRef<HTMLAnchorElement>(null);
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

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const buttons = [primaryCtaRef.current, secondaryCtaRef.current].filter(
      (el): el is HTMLAnchorElement => Boolean(el),
    );
    if (buttons.length === 0) return;

    function animateTo(button: HTMLAnchorElement, vars: gsap.TweenVars) {
      gsap.to(button, {
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
        ...vars,
      });
    }

    function handlePointerMove(event: PointerEvent) {
      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);

        if (distance < MAGNETIC_RADIUS) {
          const pull = 1 - distance / MAGNETIC_RADIUS;
          animateTo(button, {
            x: dx * MAGNETIC_STRENGTH * pull,
            y: dy * MAGNETIC_STRENGTH * pull,
            scale: 1 + (HOVER_SCALE - 1) * pull,
          });
        } else {
          animateTo(button, { x: 0, y: 0, scale: 1 });
        }
      });
    }

    const buttonCleanups = buttons.map((button) => {
      function handlePointerDown() {
        gsap.to(button, {
          scale: PRESS_SCALE,
          duration: 0.15,
          ease: "power2.out",
          overwrite: true,
        });
      }
      function handlePointerUp() {
        animateTo(button, { scale: HOVER_SCALE, duration: 0.2 });
      }
      function handleFocus() {
        animateTo(button, { scale: HOVER_SCALE });
      }
      function handleBlur() {
        animateTo(button, { x: 0, y: 0, scale: 1 });
      }

      button.addEventListener("pointerdown", handlePointerDown);
      button.addEventListener("pointerup", handlePointerUp);
      button.addEventListener("focus", handleFocus);
      button.addEventListener("blur", handleBlur);

      return () => {
        button.removeEventListener("pointerdown", handlePointerDown);
        button.removeEventListener("pointerup", handlePointerUp);
        button.removeEventListener("focus", handleFocus);
        button.removeEventListener("blur", handleBlur);
      };
    });

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      buttonCleanups.forEach((cleanup) => cleanup());
      buttons.forEach((button) => {
        gsap.set(button, { x: 0, y: 0, scale: 1 });
      });
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
          <Link
            ref={primaryCtaRef}
            href={copy.primaryCta.href}
            className={styles.primaryCta}
          >
            {copy.primaryCta.label}
          </Link>
        ) : null}
        {copy.secondaryCta ? (
          <Link
            ref={secondaryCtaRef}
            href={copy.secondaryCta.href}
            className={styles.secondaryCta}
          >
            {copy.secondaryCta.label}
          </Link>
        ) : null}
      </div>
      <div ref={scrollCueRef} className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>{t("scroll")}</span>
      </div>
      <div
        data-fade
        className={`${styles.glassCard} ${styles.glassCardRec}`}
        aria-hidden="true"
      >
        <span className={styles.recDot} />
        <span>REC</span>
      </div>
      <div
        data-fade
        className={`${styles.glassCard} ${styles.glassCardTimecode}`}
        aria-hidden="true"
      >
        00:24:12:07
      </div>
    </div>
  );
}
