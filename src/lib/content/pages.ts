import type { Locale } from "@/i18n/routing";
import type {
  BeforeAfterContent,
  BrandContent,
  CampaignsContent,
  CaseStudyContent,
  ContactCtaContent,
  FounderContent,
  HomeServicesContent,
  MethodContent,
  PageCopy,
  PhilosophyContent,
} from "@/types/content";

type PageKey =
  | "home"
  | "portfolio"
  | "services"
  | "about"
  | "landingPages";

interface PagesData extends Record<PageKey, PageCopy> {
  homeServices: HomeServicesContent;
  homeMethod: MethodContent;
  homeCampaigns: CampaignsContent;
  homeCaseStudyBises: CaseStudyContent;
  homeBeforeAfter: BeforeAfterContent;
  homePhilosophy: PhilosophyContent;
  homeContact: ContactCtaContent;
  founder: FounderContent;
  brand: BrandContent;
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

export async function getHomeCampaigns(
  locale: Locale,
): Promise<CampaignsContent> {
  const data = await loadPagesData(locale);
  return data.homeCampaigns;
}

export async function getHomeCaseStudyBises(
  locale: Locale,
): Promise<CaseStudyContent> {
  const data = await loadPagesData(locale);
  return data.homeCaseStudyBises;
}

export async function getHomeBeforeAfter(
  locale: Locale,
): Promise<BeforeAfterContent> {
  const data = await loadPagesData(locale);
  return data.homeBeforeAfter;
}

export async function getHomePhilosophy(
  locale: Locale,
): Promise<PhilosophyContent> {
  const data = await loadPagesData(locale);
  return data.homePhilosophy;
}

export async function getHomeContact(
  locale: Locale,
): Promise<ContactCtaContent> {
  const data = await loadPagesData(locale);
  return data.homeContact;
}

export async function getBrandContent(locale: Locale): Promise<BrandContent> {
  const data = await loadPagesData(locale);
  return data.brand;
}

export async function getFounder(locale: Locale): Promise<FounderContent> {
  const data = await loadPagesData(locale);
  return data.founder;
}
