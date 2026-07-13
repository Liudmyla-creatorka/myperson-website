import type { Locale } from "@/i18n/routing";
import { getPageCopy, getPortfolioItems } from "@/lib/content";
import { PortfolioFilmstrip } from "@/sections/PortfolioFilmstrip";

type PortfolioReelProps = {
  locale: Locale;
};

export async function PortfolioReel({ locale }: PortfolioReelProps) {
  const [copy, items] = await Promise.all([
    getPageCopy("portfolio", locale),
    getPortfolioItems(locale),
  ]);

  return (
    <PortfolioFilmstrip
      eyebrow={copy.eyebrow ?? copy.title}
      heading={copy.title}
      videoSrc="/videos/portfolio-reel.mp4"
      posterImage="/images/reel-portfolio.png"
      items={items}
      closeLabel={locale === "pl" ? "Zamknij" : "Close"}
      viewCaseStudyLabel={
        locale === "pl" ? "Zobacz pełne case study" : "View full case study"
      }
      hoverHintLabel={locale === "pl" ? "Zobacz" : "View"}
    />
  );
}
