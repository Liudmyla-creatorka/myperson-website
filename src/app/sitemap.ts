import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

const staticPaths = ["", "/portfolio", "/services", "/landing-pages", "/about"];

function alternates(path: string) {
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `${siteConfig.siteUrl}/${loc}${path}`]),
  );
  languages["x-default"] = `${siteConfig.siteUrl}/${routing.defaultLocale}${path}`;
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${siteConfig.siteUrl}/${locale}${path}`,
      alternates: { languages: alternates(path) },
    })),
  );
}
