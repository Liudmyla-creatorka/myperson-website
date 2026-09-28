import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getPageCopy } from "@/lib/content";
import { buildPageMetadata, pageSeo, pageUrl } from "@/lib/seo";
import { buildPageJsonLd, organizationRef } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { LandingPagesShowcase } from "@/sections/LandingPagesShowcase";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("landingPages", locale as Locale);
  return buildPageMetadata({
    locale: locale as Locale,
    path: "/landing-pages",
    ...pageSeo(copy),
  });
}

export default async function LandingPagesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const copy = await getPageCopy("landingPages", locale as Locale);
  const jsonLd = await buildPageJsonLd({
    locale: locale as Locale,
    path: "/landing-pages",
    ...pageSeo(copy),
    mainEntity: {
      "@type": "Service",
      "@id": `${pageUrl(locale as Locale, "/landing-pages")}#service`,
      name: copy.title,
      description: copy.intro,
      provider: organizationRef,
    },
  });

  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />
      <LandingPagesShowcase locale={locale as Locale} />
    </main>
  );
}
