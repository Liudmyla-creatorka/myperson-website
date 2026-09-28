import type { Locale } from "@/i18n/routing";
import { getFooterContent } from "@/lib/content";
import { pageUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import type { FounderContent } from "@/types/content";

// Built only from data that already exists in site-config and the content
// layer, and only from facts that are visible on the page. No address,
// ratings, reviews, prices or clients are asserted here.

const ORGANIZATION_ID = `${siteConfig.siteUrl}/#organization`;
const WEBSITE_ID = `${siteConfig.siteUrl}/#website`;
const FOUNDER_ID = `${siteConfig.siteUrl}/#founder`;

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
  /** Only on pages where the founder is visibly named. */
  founder?: FounderContent;
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
  founder,
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
        ...(founder && { founder: { "@id": FOUNDER_ID } }),
      },
      // No sameAs: the Instagram/Facebook profiles on the site belong to the brand, not the person.
      ...(founder
        ? [
            {
              "@type": "Person",
              "@id": FOUNDER_ID,
              name: founder.name,
              jobTitle: founder.role,
              worksFor: organizationRef,
            },
          ]
        : []),
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
