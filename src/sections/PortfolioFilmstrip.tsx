"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { PortfolioItem } from "@/types/content";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import styles from "./PortfolioFilmstrip.module.css";

type PortfolioFilmstripProps = {
  eyebrow: string;
  heading: string;
  videoSrc: string;
  posterImage: string;
  items: PortfolioItem[];
  closeLabel: string;
  viewCaseStudyLabel: string;
  hoverHintLabel: string;
};

export function PortfolioFilmstrip({
  eyebrow,
  heading,
  videoSrc,
  posterImage,
  items,
  closeLabel,
  viewCaseStudyLabel,
  hoverHintLabel,
}: PortfolioFilmstripProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  function openItem(index: number, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    videoRef.current?.pause();
    setActiveIndex(index);
  }

  function closeModal() {
    if (activeIndex === null) return;
    videoRef.current?.play();
    const trigger = lastTriggerRef.current;

    if (prefersReducedMotion) {
      setActiveIndex(null);
      trigger?.focus();
      return;
    }

    gsap.to(frameRef.current, {
      opacity: 0,
      scale: 0.96,
      y: 10,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setActiveIndex(null);
        trigger?.focus();
      },
    });
  }

  useEffect(() => {
    if (activeIndex === null) return;

    const overlay = overlayRef.current;
    const frame = frameRef.current;

    if (prefersReducedMotion) {
      gsap.set(overlay, { opacity: 1 });
      gsap.set(frame, { opacity: 1, scale: 1, y: 0 });
    } else {
      gsap.set(overlay, { opacity: 0 });
      gsap.set(frame, { opacity: 0, scale: 0.94, y: 16 });
      gsap.to(overlay, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.to(frame, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
        delay: 0.05,
      });
    }
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, prefersReducedMotion]);

  return (
    <section className={styles.section}>
      <video
        ref={videoRef}
        className={styles.video}
        src={videoSrc}
        poster={posterImage}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className={styles.veil} aria-hidden="true" />

      {/* The reel itself lives in the video's own upper-left footage — no
          separate graphic drawn on top of it. The header is pushed to the
          right half of the row so it never sits over that reel. */}
      <Container className={styles.headerRow}>
        <div className={styles.headerText}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.heading}>{heading}</h2>
        </div>
      </Container>

      <Container className={styles.hotspotLayer}>
        {items.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            className={styles.hotspot}
            aria-label={`${item.title} — ${item.subtitle}`}
            onClick={(event) => openItem(index, event.currentTarget)}
          >
            <span className={styles.hotspotHint} aria-hidden="true">
              {hoverHintLabel}
            </span>
            <span className="visually-hidden">
              {String(index + 1).padStart(2, "0")}. {item.title}
            </span>
          </button>
        ))}
      </Container>

      {activeItem && activeIndex !== null && (
        <div
          ref={overlayRef}
          className={styles.modalOverlay}
          onClick={closeModal}
        >
          <div
            ref={frameRef}
            className={styles.filmFrame}
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.modalClose}
              onClick={closeModal}
              aria-label={closeLabel}
            >
              ×
            </button>

            <div className={styles.sprocketRow} aria-hidden="true" />
            <div className={styles.filmLabelRow} aria-hidden="true">
              <span className={styles.filmLabel}>KODAK PORTRA 400</span>
              <span className={styles.frameNumber}>
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
            </div>

            <div className={styles.frameImageWrap}>
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                sizes="(min-width: 48rem) 28rem, 90vw"
                style={{ objectFit: "contain" }}
              />
            </div>

            <div className={styles.frameBody}>
              <p className={styles.modalTags}>{activeItem.tags}</p>
              <h3 id="portfolio-modal-title" className={styles.modalTitle}>
                {activeItem.title}
              </h3>
              <p className={styles.modalSubtitle}>{activeItem.subtitle}</p>
              <Link
                href={`/portfolio/${activeItem.slug}`}
                className={styles.modalLink}
              >
                {viewCaseStudyLabel}
              </Link>
            </div>

            <div className={styles.filmLabelRow} aria-hidden="true">
              <span className={styles.frameNumber}>
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className={styles.filmLabel}>KODAK PORTRA 400</span>
            </div>
            <div className={styles.sprocketRow} aria-hidden="true" />
          </div>
        </div>
      )}
    </section>
  );
}
