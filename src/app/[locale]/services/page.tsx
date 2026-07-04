import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getPageCopy, getServices } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("services", locale as Locale);
  return { title: copy.title, description: copy.intro };
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const copy = await getPageCopy("services", locale as Locale);
  const services = await getServices(locale as Locale);

  return (
    <main id="main-content">
      <Container className={styles.wrapper}>
        <header>
          <h1>{copy.title}</h1>
          <p className={styles.intro}>{copy.intro}</p>
        </header>
        <ul role="list" className={styles.list}>
          {services.map((service) => (
            <li key={service.slug} className={styles.item}>
              <h2>{service.title}</h2>
              <p>{service.summary}</p>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
