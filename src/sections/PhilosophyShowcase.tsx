import Image from "next/image";

import type { Locale } from "@/i18n/routing";
import { getHomePhilosophy } from "@/lib/content";
import { CardSpotlight } from "@/components/CardSpotlight";
import styles from "./PhilosophyShowcase.module.css";

type PhilosophyShowcaseProps = {
  locale: Locale;
};

export async function PhilosophyShowcase({ locale }: PhilosophyShowcaseProps) {
  const { eyebrow, title, paragraphs } = await getHomePhilosophy(locale);

  return (
    <section className={styles.section}>
      <div className={styles.visual}>
        <Image
          src="/images/philosophy-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className={styles.backdrop}
          aria-hidden="true"
        />
        <div className={styles.scrim} aria-hidden="true" />
      </div>

      <CardSpotlight />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.heading}>{title}</h2>

        <div className={styles.textBlock}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
