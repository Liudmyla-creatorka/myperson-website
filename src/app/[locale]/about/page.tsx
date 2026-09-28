import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getFounder, getPageCopy } from "@/lib/content";
import { buildPageMetadata, pageSeo } from "@/lib/seo";
import { buildPageJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/ui/Container";
import { MethodShowcase } from "@/sections/MethodShowcase";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("about", locale as Locale);
  return buildPageMetadata({
    locale: locale as Locale,
    path: "/about",
    ...pageSeo(copy),
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const [copy, founder] = await Promise.all([
    getPageCopy("about", locale as Locale),
    getFounder(locale as Locale),
  ]);
  const jsonLd = await buildPageJsonLd({
    locale: locale as Locale,
    path: "/about",
    ...pageSeo(copy),
    pageType: "AboutPage",
    founder,
  });

  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />
      <Container className={styles.wrapper}>
        <h1>{copy.title}</h1>
        <p className={styles.intro}>{copy.intro}</p>
        <p className={styles.founder}>
          {founder.name} — {founder.role}.
        </p>
      </Container>

      <MethodShowcase locale={locale as Locale} />
    </main>
  );
}
