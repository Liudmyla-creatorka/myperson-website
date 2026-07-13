import Image from "next/image";

import type { Locale } from "@/i18n/routing";
import { getHomeBeforeAfter } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { CinematicVideoBackdrop } from "@/components/CinematicVideoBackdrop";
import styles from "./BeforeAfterShowcase.module.css";

type BeforeAfterShowcaseProps = {
  locale: Locale;
};

export async function BeforeAfterShowcase({
  locale,
}: BeforeAfterShowcaseProps) {
  const { eyebrow, title, intro, items } = await getHomeBeforeAfter(locale);

  return (
    <section className={styles.section}>
      <CinematicVideoBackdrop kind="image" imageSrc="/images/reel-portfolio.png" />

      <Container className={styles.headerRow}>
        <div className={styles.headerText}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.intro}>{intro}</p>
        </div>
      </Container>

      <Container className={styles.grid}>
        {items.map((item) => (
          <div key={item.slug} className={styles.cardColumn}>
            <div className={styles.card} tabIndex={0} aria-label={item.title}>
              <Image
                src={item.beforeImage}
                alt=""
                fill
                sizes="(min-width: 48rem) 33vw, 90vw"
                className={styles.beforeImage}
                aria-hidden="true"
              />
              <Image
                src={item.afterImage}
                alt=""
                fill
                sizes="(min-width: 48rem) 33vw, 90vw"
                className={styles.afterImage}
                aria-hidden="true"
              />
              <div className={styles.cardVeil} aria-hidden="true" />
            </div>

            <div className={styles.meta}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
