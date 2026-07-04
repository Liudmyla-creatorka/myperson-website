import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getPageCopy, getPortfolioItems } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("portfolio", locale as Locale);
  return { title: copy.title, description: copy.intro };
}

export default async function PortfolioPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const copy = await getPageCopy("portfolio", locale as Locale);
  const items = await getPortfolioItems(locale as Locale);

  return (
    <main id="main-content">
      <Container className={styles.wrapper}>
        <header>
          <h1>{copy.title}</h1>
          <p className={styles.intro}>{copy.intro}</p>
        </header>
        <ul role="list" className={styles.grid}>
          {items.map((item) => (
            <li key={item.slug}>
              <Link href={`/portfolio/${item.slug}`} className={styles.card}>
                <span className={styles.meta}>
                  {item.category} · {item.year}
                </span>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
