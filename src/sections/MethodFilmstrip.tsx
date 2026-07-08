"use client";

import { useLayoutEffect, useRef, type Ref } from "react";

import type { MethodStep } from "@/types/content";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Container } from "@/components/ui/Container";
import styles from "./MethodFilmstrip.module.css";

type MethodFilmstripProps = {
  title: string;
  intro: string;
  steps: MethodStep[];
};

const REEL_SPOKE_ANGLES = [0, 60, 120, 180, 240, 300];

// Tune this to control how much scroll one frame transition consumes.
// Higher = slower, more deliberate (avoids "blew through all 4 steps in
// under a second" on a normal scroll gesture).
const FRAME_SCROLL_MULTIPLIER = 1.35;

// Rounded to 3dp: raw Math.cos/sin output can differ in the last float digit
// between the Node (SSR) and browser (hydration) runtimes, which React flags
// as a hydration mismatch even though the visual difference is imperceptible.
function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

function ReelGraphic({ ref }: { ref?: Ref<SVGSVGElement> }) {
  return (
    <svg ref={ref} viewBox="0 0 120 120" className={styles.reelSvg} aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="none" strokeWidth="3" />
      <circle cx="60" cy="60" r="15" fill="none" strokeWidth="3" />
      {REEL_SPOKE_ANGLES.map((angle) => {
        const radians = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={round(60 + 15 * Math.cos(radians))}
            y1={round(60 + 15 * Math.sin(radians))}
            x2={round(60 + 40 * Math.cos(radians))}
            y2={round(60 + 40 * Math.sin(radians))}
            strokeWidth="2"
          />
        );
      })}
      {REEL_SPOKE_ANGLES.map((angle) => {
        const radians = (angle * Math.PI) / 180;
        return (
          <circle
            key={`hole-${angle}`}
            cx={round(60 + 33 * Math.cos(radians))}
            cy={round(60 + 33 * Math.sin(radians))}
            r="6.5"
            className={styles.reelHole}
          />
        );
      })}
    </svg>
  );
}

export function MethodFilmstrip({ title, intro, steps }: MethodFilmstripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<SVGSVGElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flashRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    const reel = reelRef.current;
    if (!section || !stage || !track) return;

    section.classList.add(styles.pinned);

    const frameCount = steps.length;
    const frameScrollDistance = Math.round(
      window.innerHeight * FRAME_SCROLL_MULTIPLIER,
    );
    const totalScrollDistance = frameCount * frameScrollDistance;
    const trackTravel = (frameCount - 1) * window.innerHeight;

    function setActive(frame: HTMLDivElement, flash: HTMLDivElement | null) {
      gsap.to(frame, {
        opacity: 1,
        scale: 1.05,
        filter: "grayscale(0)",
        duration: 0.5,
      });
      if (flash) {
        gsap.fromTo(flash, { opacity: 0.6 }, { opacity: 0, duration: 0.4 });
      }
    }

    function setInactive(frame: HTMLDivElement) {
      gsap.to(frame, {
        opacity: 0.45,
        scale: 0.85,
        filter: "grayscale(0.88)",
        duration: 0.5,
      });
    }

    let activeIndex = -1;
    const progressStep = frameCount > 1 ? 1 / (frameCount - 1) : 1;

    // 1. Pin the whole section for the total scroll distance, merged with
    // the track-advance tween below (see note there for why).
    //
    // 2. Reel rotation, driven by the same ScrollTrigger's progress.
    const reelTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=" + totalScrollDistance,
      scrub: 1,
      onUpdate: (self) => {
        if (reel) {
          gsap.set(reel, { rotation: self.progress * 360 * 4 });
        }

        // 3 + 4. Which frame is nearest viewport center is a direct,
        // deterministic function of this same progress value (each frame
        // occupies an equal 1/(frameCount-1) share of it), so it's computed
        // here rather than via a per-frame position-based ScrollTrigger.
        // That was the original design (matching "each frame gets its own
        // ScrollTrigger tied to when it crosses viewport center"), but it
        // doesn't work once the frames' position comes from this tween
        // rather than native scroll: tested both with containerAnimation
        // (start/end never resolved, stayed null) and without it (start/end
        // resolved against the frame's pre-transform layout position,
        // wrong at any other point in the scroll). This reproduces the same
        // active/inactive/flash behavior from a source of truth that's
        // already proven reliable — the same progress driving the reel.
        const nextIndex = Math.min(
          frameCount - 1,
          Math.max(0, Math.round(self.progress / progressStep)),
        );
        if (nextIndex !== activeIndex) {
          const prevFrame = frameRefs.current[activeIndex];
          if (prevFrame) setInactive(prevFrame);

          const nextFrame = frameRefs.current[nextIndex];
          if (nextFrame) setActive(nextFrame, flashRefs.current[nextIndex]);

          activeIndex = nextIndex;
        }
      },
    });

    // Track advance carries the pin itself.
    const trackTween = gsap.to(track, {
      y: -trackTravel,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=" + totalScrollDistance,
        pin: true,
        scrub: 1,
      },
    });

    return () => {
      reelTrigger.kill();
      trackTween.scrollTrigger?.kill();
      trackTween.kill();
      section.classList.remove(styles.pinned);
    };
  }, [prefersReducedMotion, steps.length]);

  const frames = steps.map((step, index) => (
    <div key={step.slug} className={styles.frameWrapper}>
      <div
        ref={(el) => {
          frameRefs.current[index] = el;
        }}
        className={styles.frame}
      >
        <div
          ref={(el) => {
            flashRefs.current[index] = el;
          }}
          className={styles.frameFlash}
          aria-hidden="true"
        />
        <div className={styles.frameInner}>
          <span className={styles.frameNumber}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className={styles.frameTitle}>{step.title}</h3>
          <p className={styles.frameSummary}>{step.summary}</p>
        </div>
      </div>
    </div>
  ));

  return (
    <section ref={sectionRef} className={styles.section}>
      <Container className={styles.header}>
        <p className={styles.eyebrow}>{intro}</p>
        <h2 className={styles.heading}>{title}</h2>
      </Container>
      <Container className={styles.stage} ref={stageRef}>
        <div className={styles.reelColumn}>
          <div className={styles.reelSticky}>
            <ReelGraphic ref={reelRef} />
          </div>
        </div>
        <div className={styles.track} ref={trackRef}>
          {frames}
        </div>
      </Container>
    </section>
  );
}
