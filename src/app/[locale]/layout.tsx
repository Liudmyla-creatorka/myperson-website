import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Montserrat, Playfair_Display } from "next/font/google";

import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import "@/styles/globals.css";

const bodyFont = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  variable: "--font-sans-loaded",
  display: "swap",
});

const headingFont = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-serif-loaded",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Restricts [locale] to exactly the values above (pl/en). Without this,
// Next.js treats [locale] as an open dynamic segment: any unmatched path
// with no dot in it (e.g. a browser's automatic /favicon.ico request,
// since it has no static favicon.ico to serve) falls through to this
// route with an arbitrary string as `locale`, which then reaches every
// section's content-loading call before the layout's own notFound()
// check has a chance to stop it. dynamicParams:false makes Next 404 at
// the router level for any value outside generateStaticParams, before
// any Server Component in this segment executes.
export const dynamicParams = false;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale as Locale);

  const t = await getTranslations("common");

  return (
    <html lang={locale} className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SmoothScroll />
          <a href="#main-content" className="skip-link">
            {t("skipToContent")}
          </a>
          <Header />
          {children}
          <Footer locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
