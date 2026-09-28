import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getHomeServices, getPageCopy } from "@/lib/content";
import { buildPageMetadata, pageSeo, pageUrl } from "@/lib/seo";
import { buildPageJsonLd, organizationRef } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { ServicesShowcase } from "@/sections/ServicesShowcase";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("services", locale as Locale);
  return buildPageMetadata({
    locale: locale as Locale,
    path: "/services",
    ...pageSeo(copy),
  });
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const [copy, services] = await Promise.all([
    getPageCopy("services", locale as Locale),
    getHomeServices(locale as Locale),
  ]);
  const url = pageUrl(locale as Locale, "/services");
  const jsonLd = await buildPageJsonLd({
    locale: locale as Locale,
    path: "/services",
    ...pageSeo(copy),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: services.items.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        // A service with its own page shares that page's Service @id.
        item: service.href
          ? {
              "@type": "Service",
              "@id": `${pageUrl(locale as Locale, service.href)}#service`,
              url: pageUrl(locale as Locale, service.href),
              name: service.title,
              description: service.summary,
              provider: organizationRef,
            }
          : {
              "@type": "Service",
              "@id": `${url}#${service.slug}`,
              name: service.title,
              description: service.summary,
              provider: organizationRef,
            },
      })),
    },
  });

  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />
      <h1 className="visually-hidden">{copy.title}</h1>

      <ServicesShowcase locale={locale as Locale} />
    </main>
  );
}
