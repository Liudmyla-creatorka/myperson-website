import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getPageCopy } from "@/lib/content";
import { ServicesShowcase } from "@/sections/ServicesShowcase";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("services", locale as Locale);
  return { title: copy.title, description: copy.intro };
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const copy = await getPageCopy("services", locale as Locale);

  return (
    <main id="main-content">
      <h1 className="visually-hidden">{copy.title}</h1>

      <ServicesShowcase locale={locale as Locale} />
    </main>
  );
}
