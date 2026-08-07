import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import { LandingPagesShowcase } from "@/sections/LandingPagesShowcase";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isPolish = locale === "pl";
  return buildPageMetadata({
    locale: locale as Locale,
    path: "/landing-pages",
    title: isPolish
      ? "Strony internetowe i landing page'e — projektowanie"
      : "Website & Landing Page Design",
    description: isPolish
      ? "Projektowanie i realizacja stron internetowych oraz landing page’y: UX/UI, art direction, interakcje, development, integracje i wdrożenie — MY PERSON."
      : "Website and landing page design and development: UX/UI, art direction, interaction, development, integrations and deployment by MY PERSON.",
  });
}

export default async function LandingPagesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main id="main-content">
      <LandingPagesShowcase locale={locale as Locale} />
    </main>
  );
}
