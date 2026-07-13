import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { getPageCopy } from "@/lib/content";
import { Hero } from "@/sections/Hero";
import { PhilosophyShowcase } from "@/sections/PhilosophyShowcase";
import { ContactCta } from "@/sections/ContactCta";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getPageCopy("home", locale as Locale);
  return { title: copy.title, description: copy.intro };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main id="main-content">
      <Hero locale={locale as Locale} />
      <PhilosophyShowcase locale={locale as Locale} />
      <ContactCta locale={locale as Locale} />
    </main>
  );
}
