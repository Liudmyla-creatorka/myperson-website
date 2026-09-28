import type { Metadata } from "next";

import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import type { PageCopy, PageSeo } from "@/types/content";

export function pageSeo(copy: PageCopy): PageSeo {
  return copy.seo ?? { title: copy.title, description: copy.intro };
}

const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  pl: "pl_PL",
  en: "en_US",
};

type BuildPageMetadataInput = {
  locale: Locale;
  /** Route path after the locale segment — "" for the home page, otherwise
   *  a leading-slash path like "/portfolio" or "/services". */
  path: string;
  title: string;
  description: string;
  /** Skip the layout's "%s | MY PERSON" template (for titles that already carry the brand). */
  absoluteTitle?: boolean;
};

export function pageUrl(locale: Locale, path: string) {
  return `${siteConfig.siteUrl}/${locale}${path}`;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: BuildPageMetadataInput): Metadata {
  const url = pageUrl(locale, path);
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, pageUrl(loc, path)]),
  );
  languages["x-default"] = pageUrl(routing.defaultLocale, path);
  // Child pages replace the layout's openGraph object wholesale, so the
  // locale's generated share image has to be referenced explicitly here.
  const shareImage = `/${locale}/opengraph-image`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: OPEN_GRAPH_LOCALE[locale],
      alternateLocale: routing.locales
        .filter((loc) => loc !== locale)
        .map((loc) => OPEN_GRAPH_LOCALE[loc]),
      type: "website",
      images: [{ url: shareImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}
