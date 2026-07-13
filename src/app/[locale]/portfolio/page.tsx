import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getPageCopy } from "@/lib/content";
import { PortfolioReel } from "@/sections/PortfolioReel";
import { CampaignsShowcase } from "@/sections/CampaignsShowcase";
import { BeforeAfterShowcase } from "@/sections/BeforeAfterShowcase";
import { CaseStudyBises } from "@/sections/CaseStudyBises";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("portfolio", locale as Locale);
  return { title: copy.title, description: copy.intro };
}

export default async function PortfolioPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const copy = await getPageCopy("portfolio", locale as Locale);

  return (
    <main id="main-content">
      <h1 className="visually-hidden">{copy.title}</h1>

      <PortfolioReel locale={locale as Locale} />
      <CampaignsShowcase locale={locale as Locale} />
      <BeforeAfterShowcase locale={locale as Locale} />
      <CaseStudyBises locale={locale as Locale} />
    </main>
  );
}
