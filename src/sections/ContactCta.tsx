import type { Locale } from "@/i18n/routing";
import { getHomeContact } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import styles from "./ContactCta.module.css";

type ContactCtaProps = {
  locale: Locale;
};

export async function ContactCta({ locale }: ContactCtaProps) {
  const { eyebrow, title, subheading, ctaLabel } = await getHomeContact(locale);

  return (
    <section id="kontakt" className={styles.section}>
      <Container className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subheading}>{subheading}</p>
        <a
          href={siteConfig.tallyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          {ctaLabel}
        </a>
      </Container>
    </section>
  );
}
