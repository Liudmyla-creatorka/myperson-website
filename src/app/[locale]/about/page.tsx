import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getPageCopy } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
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
    title: copy.title,
    description: copy.intro,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const copy = await getPageCopy("about", locale as Locale);

  return (
    <main id="main-content">
      <Container className={styles.wrapper}>
        <h1>{copy.title}</h1>
        <p className={styles.intro}>{copy.intro}</p>
      </Container>

      <MethodShowcase locale={locale as Locale} />
    </main>
  );
}
