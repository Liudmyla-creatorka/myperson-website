import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getPageCopy } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("home", locale as Locale);
  return { title: copy.title, description: copy.intro };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const copy = await getPageCopy("home", locale as Locale);

  return (
    <main id="main-content" className={styles.hero}>
      <Container>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.intro}>{copy.intro}</p>
      </Container>
    </main>
  );
}
