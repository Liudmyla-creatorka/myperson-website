import type { Locale } from "@/i18n/routing";
import { getHomeServices } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { ScrollRevealList } from "@/components/ScrollRevealList";
import { ServicesCardSpotlight } from "@/sections/ServicesCardSpotlight";
import styles from "./ServicesShowcase.module.css";

type ServicesShowcaseProps = {
  locale: Locale;
};

// Bespoke per-card treatment (span, aspect ratio, numeral bleed edge) keyed
// by the content-layer's stable slug, not array position — the asymmetric
// editorial layout is a designed composition, not a repeating pattern.
const CARD_LAYOUT: Record<string, string> = {
  "brand-identity": "cardBrandIdentity",
  "editorial-content": "cardEditorialContent",
  "visual-strategy": "cardVisualStrategy",
  "video-production": "cardVideoProduction",
};

export async function ServicesShowcase({ locale }: ServicesShowcaseProps) {
  const { title, intro, items } = await getHomeServices(locale);

  return (
    <section className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />
      <Container className={styles.content}>
        <p className={styles.eyebrow}>{intro}</p>
        <h2 className={styles.heading}>{title}</h2>
        <ScrollRevealList className={styles.grid} stagger={0.08}>
          {items.map((service, index) => {
            const layoutClass = CARD_LAYOUT[service.slug];
            return (
              <li
                key={service.slug}
                className={`${styles.card} ${layoutClass ? styles[layoutClass] : ""}`}
              >
                <ServicesCardSpotlight />
                <span className={styles.numeral} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.textBlock}>
                  <h3 className={styles.title}>{service.title}</h3>
                  <p className={styles.summary}>{service.summary}</p>
                  <ul role="list" className={styles.tags}>
                    {service.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ScrollRevealList>
      </Container>
    </section>
  );
}
