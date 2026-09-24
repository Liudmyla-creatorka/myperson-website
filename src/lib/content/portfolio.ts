import type { Locale } from "@/i18n/routing";
import type { PortfolioItem } from "@/types/content";

export async function getPortfolioItems(
  locale: Locale,
): Promise<PortfolioItem[]> {
  const data = (await import(`../../content/${locale}/portfolio.json`))
    .default as PortfolioItem[];
  return data;
}
