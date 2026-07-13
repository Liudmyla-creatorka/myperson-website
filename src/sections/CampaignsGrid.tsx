"use client";

import { useRef, useState } from "react";

import type { CampaignItem } from "@/types/content";
import styles from "./CampaignsShowcase.module.css";

type CampaignsGridProps = {
  items: CampaignItem[];
};

export function CampaignsGrid({ items }: CampaignsGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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

        return (
          <div key={item.slug} className={styles.campaignFrame}>
            <div
              className={styles.campaignCard}
              data-state={state}
              tabIndex={0}
              onMouseEnter={() => activate(index)}
              onMouseLeave={() => deactivate(index)}
              onFocus={() => activate(index)}
              onBlur={() => deactivate(index)}
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
