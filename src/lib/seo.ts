import type { Metadata } from "next";

import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

type BuildPageMetadataInput = {
  locale: Locale;
  /** Route path after the locale segment — "" for the home page, otherwise
   *  a leading-slash path like "/portfolio" or "/portfolio/aurora". */
  path: string;
  title: string;
  description: string;
};

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: BuildPageMetadataInput): Metadata {
  const url = `${siteConfig.siteUrl}/${locale}${path}`;
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `${siteConfig.siteUrl}/${loc}${path}`]),
  );

  return {
    title,
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
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
