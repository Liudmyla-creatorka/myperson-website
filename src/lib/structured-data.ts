import type { Locale } from "@/i18n/routing";
import { getBrandContent, getFounder } from "@/lib/content";
import { pageUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

// Built only from data that already exists in site-config and the content
// layer, and only from facts that are visible on the page. No address,
// ratings, reviews, prices or clients are asserted here. One exception,
// approved by the owner: the founder is part of the global Organization on
// every page (the visible founder line is only on /about), because it is
// the factual link between MY PERSON, myperson.agency and its founder.

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
  const [brand, founder] = await Promise.all([
    getBrandContent(locale),
    getFounder(locale),
  ]);
  const url = pageUrl(locale, path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: siteConfig.name,
        // Visible as the footer brand name + tagline and at the start of
        // the brand description.
        alternateName: `${siteConfig.name} — ${siteConfig.tagline}`,
        url: siteConfig.siteUrl,
        description: brand.description,
        knowsAbout: brand.knowsAbout,
        areaServed: brand.areaServed,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/images/logo.jpg"),
          width: 2048,
          height: 2048,
        },
        email: siteConfig.email,
        telephone: siteConfig.phoneHref,
        // LinkedIn (company page) is deliberately left out until its outdated
        // positioning is updated by hand; see CLAUDE.md → SEO.
        sameAs: [siteConfig.instagram, siteConfig.facebook],
        founder: { "@id": FOUNDER_ID },
      },
      // No sameAs: the Instagram/Facebook profiles on the site belong to the brand, not the person.
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: founder.name,
        jobTitle: founder.role,
        worksFor: organizationRef,
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
