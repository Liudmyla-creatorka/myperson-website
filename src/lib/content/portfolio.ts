import type { Locale } from "@/i18n/routing";
import type { PortfolioItem } from "@/types/content";

export async function getPortfolioItems(
  locale: Locale,
): Promise<PortfolioItem[]> {
  const data = (await import(`../../content/${locale}/portfolio.json`))
    .default as PortfolioItem[];
  return data;
}

export async function getPortfolioItemBySlug(
  slug: string,
  locale: Locale,
): Promise<PortfolioItem | undefined> {
  const items = await getPortfolioItems(locale);
  return items.find((item) => item.slug === slug);
}
