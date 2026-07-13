import Image from "next/image";

import type { Locale } from "@/i18n/routing";
import { getHomeCaseStudyBises } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { CinematicVideoBackdrop } from "@/components/CinematicVideoBackdrop";
import styles from "./CaseStudyBises.module.css";

type CaseStudyBisesProps = {
  locale: Locale;
};

export async function CaseStudyBises({ locale }: CaseStudyBisesProps) {
  const { eyebrow, title, description, images, siteCta, instagramCta } =
    await getHomeCaseStudyBises(locale);

  return (
    <section className={styles.section}>
      <CinematicVideoBackdrop kind="image" imageSrc="/images/reel-portfolio.png" />

      <Container className={styles.headerRow}>
        <div className={styles.headerText}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
      </Container>

      <Container className={styles.imageGrid}>
        {images.map((image) => (
          <button
            key={image.src}
            type="button"
            className={styles.imageCell}
            aria-label={`${image.variant} — ${image.tags}`}
          >
            <Image
              src={image.src}
              alt={image.variant}
              fill
              sizes="(min-width: 48rem) 22rem, 45vw"
              style={{ objectFit: "cover" }}
            />
            <span className={styles.imageOverlay} aria-hidden="true">
              <span className={styles.imageVariant}>{image.variant}</span>
              <span className={styles.imageTags}>{image.tags}</span>
            </span>
          </button>
        ))}
      </Container>

      <Container className={styles.ctaRow}>
        <a
          href={siteCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaLink}
        >
          {siteCta.label}
        </a>
        {instagramCta.href && (
          <a
            href={instagramCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaLink}
          >
            {instagramCta.label}
          </a>
        )}
      </Container>
    </section>
  );
}
