import Image from "next/image";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getFooterContent } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import styles from "./Footer.module.css";

type FooterProps = {
  locale: Locale;
};

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations("footer");
  const { description } = await getFooterContent(locale);
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container className={styles.grid}>
        <div className={styles.column}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>
              <Image
                src="/images/logo-light.jpg"
                alt=""
                fill
                sizes="2rem"
                className={styles.brandMarkImage}
              />
            </span>
            <span className={styles.brandName}>{siteConfig.name}</span>
          </div>
          <p className={styles.subtitle}>{siteConfig.tagline}</p>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.column}>
          <p className={styles.columnHeading}>{t("contactHeading")}</p>
          <a href={`mailto:${siteConfig.email}`} className={styles.link}>
            {siteConfig.email}
          </a>
          <a href={`tel:${siteConfig.phoneHref}`} className={styles.link}>
            {siteConfig.phone}
          </a>
          <a
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            WhatsApp
          </a>
        </div>

        <div className={styles.column}>
          <p className={styles.columnHeading}>{t("socialHeading")}</p>
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Instagram
          </a>
          <a
            href={siteConfig.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Facebook
          </a>
        </div>
      </Container>

      <Container className={styles.bottom}>
        <p className={styles.copyright}>
          © {year} {siteConfig.name} | {siteConfig.tagline} | myperson.agency
        </p>
      </Container>
    </footer>
  );
}
