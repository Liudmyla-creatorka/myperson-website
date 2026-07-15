"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import styles from "./HeroBackground.module.css";

const MASK_ID = "hero-reveal-mask";
const FILTER_ID = "hero-reveal-liquid";

// Fixed per-blob offsets (px, from the tracked cursor point) and radii —
// merged by the blur below into one blob, then the merged shape's edge is
// warped by turbulence so the outline reads as liquid, not geometric.
const BLOBS = [
  { dx: -22, dy: 9, rx: 188, ry: 154, freqX: 0.13, freqY: 0.1, phase: 0 },
  { dx: 28, dy: -14, rx: 147, ry: 125, freqX: 0.17, freqY: 0.14, phase: 1.7 },
  { dx: -11, dy: -22, rx: 125, ry: 106, freqX: 0.09, freqY: 0.19, phase: 3.1 },
  { dx: 17, dy: 19, rx: 112, ry: 96, freqX: 0.21, freqY: 0.11, phase: 4.4 },
];

const JITTER_AMOUNT = 8; // px, small "not computer-generated" wobble
const MAX_STRETCH = 0.3; // clamp for velocity-based squash/stretch

export function HeroBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const blobRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const wrapper = wrapperRef.current;
    const group = groupRef.current;
    if (!wrapper || !group) return;

    const state = { x: 0, y: 0, reveal: 0 };
    const previous = { x: 0, y: 0 };

    const setX = gsap.quickTo(state, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    const setY = gsap.quickTo(state, "y", {
      duration: 0.6,
      ease: "power3.out",
    });
    // Driven through the same manual setAttribute path as transform below —
    // GSAP's normal style-based quickTo on the <g>'s opacity is not honored
    // reliably for elements used as <mask> content in this engine, so the
    // reveal strength is tracked as plain state and applied every tick.
    const setReveal = gsap.quickTo(state, "reveal", {
      duration: 0.5,
      ease: "power2.out",
    });

    // getBoundingClientRect() forces a synchronous layout read — fine once,
    // but calling it on every single pointermove/touchmove (which can fire
    // well over 60x/sec on some touchscreens) is a real per-event cost for
    // a rect that essentially never changes mid-gesture. Cached instead,
    // refreshed only on resize/orientation change.
    let rect = wrapper.getBoundingClientRect();
    function refreshRect() {
      rect = wrapper!.getBoundingClientRect();
    }

    // Shared by both input paths below: given a point in viewport
    // coordinates, converts to wrapper-local space and updates reveal
    // strength based on whether that point is actually over the Hero.
    function updateFromPoint(clientX: number, clientY: number) {
      const withinBounds =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      setX(clientX - rect.left);
      setY(clientY - rect.top);
      setReveal(withinBounds ? 1 : 0);
    }

    // Tracked on window (not the wrapper) so the reveal keeps following the
    // cursor even where the Hero content (headline/CTAs) sits on top and
    // would otherwise intercept pointer events before they reach this
    // element — the same reasoning CursorLight already uses.
    function handlePointerMove(event: PointerEvent) {
      updateFromPoint(event.clientX, event.clientY);
    }

    // Touch has no persistent hover, so there's no "pointer left the
    // section" event the way mouseleave/pointermove-outside gives us for
    // free — touchend/touchcancel are what stand in for that, fading the
    // reveal back out once the finger lifts. touchmove is intentionally
    // *not* preventDefault()'d: the reveal tracks the finger passively
    // alongside normal page scrolling rather than capturing the gesture,
    // so dragging/scrolling through the Hero sweeps the reveal across it
    // instead of breaking scroll.
    //
    // touchmove can fire far more often than the screen actually repaints
    // on some hardware — coalesced to at most one update per animation
    // frame rather than processing every raw event.
    let pendingTouch: { x: number; y: number } | null = null;
    let touchRafId: number | null = null;

    function flushTouch() {
      touchRafId = null;
      if (pendingTouch) {
        updateFromPoint(pendingTouch.x, pendingTouch.y);
        pendingTouch = null;
      }
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      pendingTouch = { x: touch.clientX, y: touch.clientY };
      if (touchRafId === null) {
        touchRafId = requestAnimationFrame(flushTouch);
      }
    }

    function handleTouchStart(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      updateFromPoint(touch.clientX, touch.clientY);
    }

    function handleTouchEnd() {
      setReveal(0);
    }

    let elapsed = 0;
    function tick(_time: number, deltaMs: number) {
      const dt = Math.max(deltaMs / 1000, 0.001);
      elapsed += dt;

      const velocityX = (state.x - previous.x) / dt;
      const velocityY = (state.y - previous.y) / dt;
      previous.x = state.x;
      previous.y = state.y;

      const speed = Math.hypot(velocityX, velocityY);
      const stretch = Math.min(speed / 1000, MAX_STRETCH);
      const angle = (Math.atan2(velocityY, velocityX) * 180) / Math.PI;

      group!.setAttribute("opacity", `${state.reveal}`);
      group!.setAttribute(
        "transform",
        `translate(${state.x} ${state.y}) rotate(${angle}) scale(${1 + stretch} ${1 - stretch * 0.4}) rotate(${-angle})`,
      );

      BLOBS.forEach((blob, index) => {
        const el = blobRefs.current[index];
        if (!el) return;
        const jitterX =
          Math.sin(elapsed * blob.freqX + blob.phase) * JITTER_AMOUNT;
        const jitterY =
          Math.cos(elapsed * blob.freqY + blob.phase) * JITTER_AMOUNT;
        el.setAttribute("cx", `${blob.dx + jitterX}`);
        el.setAttribute("cy", `${blob.dy + jitterY}`);
      });

      // Slow ambient drift of the noise pattern itself, so the blob's edge
      // keeps subtly breathing even when the cursor is still.
      if (turbulenceRef.current) {
        const freq = 0.014 + Math.sin(elapsed * 0.05) * 0.004;
        turbulenceRef.current.setAttribute(
          "baseFrequency",
          `${freq.toFixed(4)}`,
        );
      }
    }

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (isFinePointer) {
      window.addEventListener("pointermove", handlePointerMove);
    } else {
      window.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      window.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
      window.addEventListener("touchcancel", handleTouchEnd, {
        passive: true,
      });
    }

    window.addEventListener("resize", refreshRect);
    gsap.ticker.add(tick);

    return () => {
      if (isFinePointer) {
        window.removeEventListener("pointermove", handlePointerMove);
      } else {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("touchcancel", handleTouchEnd);
        if (touchRafId !== null) cancelAnimationFrame(touchRafId);
      }
      window.removeEventListener("resize", refreshRect);
      gsap.ticker.remove(tick);
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={wrapperRef} className={styles.wrapper} aria-hidden="true">
      <svg className={styles.maskDefs} aria-hidden="true">
        <defs>
          <filter
            id={FILTER_ID}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="soft" />
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.014"
              numOctaves={2}
              seed={7}
              result="noise"
            />
            <feDisplacementMap
              in="soft"
              in2="noise"
              scale={95}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <mask id={MASK_ID}>
            <rect
              x="-5000"
              y="-5000"
              width="10000"
              height="10000"
              fill="white"
            />
            <g
              ref={groupRef}
              className={styles.maskGroup}
              filter={`url(#${FILTER_ID})`}
              opacity={0}
            >
              {BLOBS.map((blob, index) => (
                <ellipse
                  key={index}
                  ref={(el) => {
                    blobRefs.current[index] = el;
                  }}
                  cx={blob.dx}
                  cy={blob.dy}
                  rx={blob.rx}
                  ry={blob.ry}
                  fill="black"
                />
              ))}
            </g>
          </mask>
        </defs>
      </svg>
      <Image
        src="/images/hero-color.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.colorLayer}
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
      <Image
        src="/images/hero-sketch.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.sketchLayer}
        style={{
          objectFit: "cover",
          objectPosition: "center",
          ...(prefersReducedMotion
            ? {}
            : { mask: `url(#${MASK_ID})`, WebkitMask: `url(#${MASK_ID})` }),
        }}
      />
    </div>
  );
}
