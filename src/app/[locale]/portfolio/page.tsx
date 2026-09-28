import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getPageCopy, getPortfolioItems } from "@/lib/content";
import { buildPageMetadata, pageSeo, pageUrl } from "@/lib/seo";
import {
  absoluteUrl,
  buildPageJsonLd,
  organizationRef,
} from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { PortfolioReel } from "@/sections/PortfolioReel";
import { CampaignsShowcase } from "@/sections/CampaignsShowcase";
import { BeforeAfterShowcase } from "@/sections/BeforeAfterShowcase";
import { CaseStudyBises } from "@/sections/CaseStudyBises";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("portfolio", locale as Locale);
  return buildPageMetadata({
    locale: locale as Locale,
    path: "/portfolio",
    ...pageSeo(copy),
  });
}

export default async function PortfolioPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const [copy, works] = await Promise.all([
    getPageCopy("portfolio", locale as Locale),
    getPortfolioItems(locale as Locale),
  ]);
  const url = pageUrl(locale as Locale, "/portfolio");
  const jsonLd = await buildPageJsonLd({
    locale: locale as Locale,
    path: "/portfolio",
    ...pageSeo(copy),
    pageType: "CollectionPage",
    // Works are anchors inside this one page — there are no per-work URLs.
    extraNodes: works.map((work) => ({
      "@type": "CreativeWork",
      "@id": `${url}#work-${work.slug}`,
      name: work.title,
      ...(work.subtitle !== work.title && { alternativeHeadline: work.subtitle }),
      description: work.summary,
      image: absoluteUrl(work.image),
      dateCreated: work.year,
      creator: organizationRef,
    })),
  });

  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />
      <h1 className="visually-hidden">{copy.title}</h1>

      <PortfolioReel locale={locale as Locale} />
      <CampaignsShowcase locale={locale as Locale} />
      <BeforeAfterShowcase locale={locale as Locale} />
      <CaseStudyBises locale={locale as Locale} />
    </main>
  );
}
