import type { Locale } from "@/i18n/routing";
import type { PageCopy } from "@/types/content";

type PageKey = "home" | "portfolio" | "services" | "about" | "contact";

export async function getPageCopy(
  page: PageKey,
  locale: Locale,
): Promise<PageCopy> {
  const data = (await import(`../../content/${locale}/pages.json`))
    .default as Record<PageKey, PageCopy>;
  return data[page];
}
