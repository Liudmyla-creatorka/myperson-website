import type { CSSProperties } from "react";

import { Container } from "@/components/ui/Container";
import { ScrollRevealList } from "@/components/ScrollRevealList";
import { CardSpotlight } from "@/components/CardSpotlight";
import styles from "./PhotoCardGrid.module.css";

export type PhotoCardGridItem = {
  slug: string;
  title: string;
  summary: string;
  tags?: string[];
};

type PhotoCardGridProps = {
  eyebrow: string;
  heading: string;
  backgroundImage: string;
  items: PhotoCardGridItem[];
  // Keyed by the content layer's stable slug, not array position — the
  // asymmetric editorial layout is a designed composition, not a
  // repeating pattern, so a card's grid slot shouldn't shift if content
  // order changes. See cardOne–cardFour in PhotoCardGrid.module.css.
  cardLayout: Record<string, string>;
};

export function PhotoCardGrid({
  eyebrow,
  heading,
  backgroundImage,
  items,
  cardLayout,
}: PhotoCardGridProps) {
  return (
    <section
      className={styles.section}
      style={{ "--pcg-bg-image": `url(${backgroundImage})` } as CSSProperties}
    >
      <div className={styles.glow} aria-hidden="true" />
      <Container className={styles.content}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.heading}>{heading}</h2>
        <ScrollRevealList className={styles.grid} stagger={0.08}>
          {items.map((item, index) => {
            const layoutClass = cardLayout[item.slug];
            return (
              <li
                key={item.slug}
                className={`${styles.card} ${layoutClass ? styles[layoutClass] : ""}`}
              >
                <CardSpotlight />
                <span className={styles.numeral} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.textBlock}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.summary}>{item.summary}</p>
                  {item.tags && item.tags.length > 0 && (
                    <ul role="list" className={styles.tags}>
                      {item.tags.map((tag) => (
                        <li key={tag} className={styles.tag}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ScrollRevealList>
      </Container>
    </section>
  );
}
