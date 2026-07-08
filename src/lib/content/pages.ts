import type { Locale } from "@/i18n/routing";
import type {
  HomeServicesContent,
  MethodContent,
  PageCopy,
} from "@/types/content";

type PageKey = "home" | "portfolio" | "services" | "about" | "contact";

interface PagesData extends Record<PageKey, PageCopy> {
  homeServices: HomeServicesContent;
  homeMethod: MethodContent;
}

async function loadPagesData(locale: Locale): Promise<PagesData> {
  return (await import(`../../content/${locale}/pages.json`))
    .default as PagesData;
}

export async function getPageCopy(
  page: PageKey,
  locale: Locale,
): Promise<PageCopy> {
  const data = await loadPagesData(locale);
  return data[page];
}

export async function getHomeServices(
  locale: Locale,
): Promise<HomeServicesContent> {
  const data = await loadPagesData(locale);
  return data.homeServices;
}

export async function getMethodSteps(locale: Locale): Promise<MethodContent> {
  const data = await loadPagesData(locale);
  return data.homeMethod;
}
