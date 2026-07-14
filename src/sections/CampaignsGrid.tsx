"use client";

import { useRef, useState } from "react";

import type { CampaignItem } from "@/types/content";
import { SoundToggle } from "@/components/SoundToggle";
import { gsap } from "@/lib/gsap";
import styles from "./CampaignsShowcase.module.css";

type CampaignsGridProps = {
  items: CampaignItem[];
  muteLabel: string;
  unmuteLabel: string;
};

export function CampaignsGrid({
  items,
  muteLabel,
  unmuteLabel,
}: CampaignsGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [soundOnIndex, setSoundOnIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  function silence(index: number) {
    const video = videoRefs.current[index];
    if (!video) return;
    gsap.to(video, {
      volume: 0,
      duration: 0.3,
      ease: "power1.in",
      onComplete: () => {
        video.muted = true;
      },
    });
  }

  function activate(index: number) {
    setActiveIndex(index);
    videoRefs.current[index]?.play().catch(() => {});
    items.forEach((_, i) => {
      if (i !== index) videoRefs.current[i]?.pause();
    });
  }

  function deactivate(index: number) {
    setActiveIndex((current) => (current === index ? null : current));
    videoRefs.current[index]?.pause();
    setSoundOnIndex((current) => {
      if (current === index) {
        silence(index);
        return null;
      }
      return current;
    });
  }

  function toggleSound(index: number) {
    const video = videoRefs.current[index];
    if (!video) return;

    if (soundOnIndex === index) {
      silence(index);
      setSoundOnIndex(null);
      return;
    }

    if (soundOnIndex !== null) silence(soundOnIndex);

    video.muted = false;
    video.volume = 0;
    gsap.to(video, { volume: 1, duration: 0.5, ease: "power1.out" });
    setSoundOnIndex(index);
  }

  return (
    <div className={styles.grid}>
      {items.map((item, index) => {
        const state =
          activeIndex === null
            ? "idle"
            : activeIndex === index
              ? "active"
              : "dimmed";

        const side = index === 0 ? "left" : "right";

        const soundOn = soundOnIndex === index;

        return (
          <div key={item.slug} className={styles.campaignFrame}>
            <div
              className={styles.campaignCard}
              data-state={state}
              tabIndex={0}
              onMouseEnter={() => activate(index)}
              onMouseLeave={() => deactivate(index)}
              onFocus={() => activate(index)}
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                ) {
                  deactivate(index);
                }
              }}
              onClick={() => toggleSound(index)}
              aria-label={`${item.title} — ${item.subtitle}`}
            >
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className={styles.campaignVideo}
                src={item.videoSrc}
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
              />

              {state === "active" && (
                <SoundToggle
                  muted={!soundOn}
                  onToggle={() => toggleSound(index)}
                  labelMuted={unmuteLabel}
                  labelUnmuted={muteLabel}
                  className={styles.soundToggle}
                />
              )}
            </div>

            <div className={styles.campaignMeta} data-side={side}>
              <h3 className={styles.campaignTitle}>{item.title}</h3>
              <p className={styles.campaignSubtitle}>{item.subtitle}</p>
              <p className={styles.campaignDescription}>{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
