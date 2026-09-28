import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getPageCopy } from "@/lib/content";
import { buildPageMetadata, pageSeo } from "@/lib/seo";
import { buildPageJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/sections/Hero";
import { PhilosophyShowcase } from "@/sections/PhilosophyShowcase";
import { ContactCta } from "@/sections/ContactCta";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("home", locale as Locale);
  return buildPageMetadata({
    locale: locale as Locale,
    path: "",
    ...pageSeo(copy),
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const copy = await getPageCopy("home", locale as Locale);
  const jsonLd = await buildPageJsonLd({
    locale: locale as Locale,
    path: "",
    ...pageSeo(copy),
  });

  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />
      <Hero locale={locale as Locale} />
      <PhilosophyShowcase locale={locale as Locale} />
      <ContactCta locale={locale as Locale} />
    </main>
  );
}
