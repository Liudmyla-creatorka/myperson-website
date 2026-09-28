import type { Locale } from "@/i18n/routing";
import { getFooterContent } from "@/lib/content";
import { pageUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

// Built only from data that already exists in site-config and the content
// layer, and only from facts that are visible on the page. No address,
// ratings, reviews, prices or clients are asserted here.

const ORGANIZATION_ID = `${siteConfig.siteUrl}/#organization`;
const WEBSITE_ID = `${siteConfig.siteUrl}/#website`;

type JsonLdNode = Record<string, unknown>;

export type PageType = "WebPage" | "CollectionPage" | "AboutPage";

type PageJsonLdInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  pageType?: PageType;
  /** What the page is primarily about (a service, or a list of services). */
  mainEntity?: JsonLdNode;
  /** Creative works shown on the page; must be CreativeWork nodes with an @id. */
  hasPart?: JsonLdNode[];
};

export const organizationRef = { "@id": ORGANIZATION_ID };

export function absoluteUrl(path: string) {
  return `${siteConfig.siteUrl}${path}`;
}

export async function buildPageJsonLd({
  locale,
  path,
  title,
  description,
  pageType = "WebPage",
  mainEntity,
  hasPart = [],
}: PageJsonLdInput) {
  const { description: organizationDescription } = await getFooterContent(locale);
  const url = pageUrl(locale, path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        description: organizationDescription,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/images/logo.jpg"),
          width: 2048,
          height: 2048,
        },
        email: siteConfig.email,
        telephone: siteConfig.phoneHref,
        sameAs: [siteConfig.instagram, siteConfig.facebook],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        inLanguage: ["pl", "en"],
        publisher: organizationRef,
      },
      {
        "@type": pageType,
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { "@id": WEBSITE_ID },
        about: organizationRef,
        ...(mainEntity && { mainEntity }),
        ...(hasPart.length > 0 && {
          hasPart: hasPart.map((node) => ({ "@id": node["@id"] })),
        }),
      },
      ...hasPart,
    ],
  };
}
