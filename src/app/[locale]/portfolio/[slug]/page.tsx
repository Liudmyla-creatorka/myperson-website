import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { routing, type Locale } from "@/i18n/routing";
import { getPortfolioItemBySlug, getPortfolioItems } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const paramsPerLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const items = await getPortfolioItems(locale);
      return items.map((item) => ({ locale, slug: item.slug }));
    }),
  );
  return paramsPerLocale.flat();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getPortfolioItemBySlug(slug, locale as Locale);
  if (!item) return {};
  return { title: item.title, description: item.summary };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const item = await getPortfolioItemBySlug(slug, locale as Locale);

  if (!item) {
    notFound();
  }

  return (
    <main id="main-content">
      <Container className={styles.wrapper}>
        <span className={styles.meta}>
          {item.category} · {item.year}
        </span>
        <h1>{item.title}</h1>
        <p className={styles.summary}>{item.summary}</p>
      </Container>
    </main>
  );
}
