import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getPageCopy } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { LandingPagesShowcase } from "@/sections/LandingPagesShowcase";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("landingPages", locale as Locale);
  return buildPageMetadata({
    locale: locale as Locale,
    path: "/landing-pages",
    title: copy.title,
    description: copy.intro,
  });
}

export default async function LandingPagesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const copy = await getPageCopy("landingPages", locale as Locale);

  return (
    <main id="main-content">
      <h1 className="visually-hidden">{copy.title}</h1>

      <LandingPagesShowcase locale={locale as Locale} />
    </main>
  );
}
