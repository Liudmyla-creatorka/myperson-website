import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getPortfolioItems } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

const staticPaths = ["", "/portfolio", "/services", "/landing-pages", "/about"];

function alternates(path: string) {
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `${siteConfig.siteUrl}/${loc}${path}`]),
  );
  languages["x-default"] = `${siteConfig.siteUrl}/${routing.defaultLocale}${path}`;
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteConfig.siteUrl}/${locale}${path}`,
        alternates: { languages: alternates(path) },
      });
    }

    const portfolioItems = await getPortfolioItems(locale);
    for (const item of portfolioItems) {
      const path = `/portfolio/${item.slug}`;
      entries.push({
        url: `${siteConfig.siteUrl}/${locale}${path}`,
        alternates: { languages: alternates(path) },
      });
    }
  }

  return entries;
}
