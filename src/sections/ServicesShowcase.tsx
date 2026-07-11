import type { Locale } from "@/i18n/routing";
import { getHomeServices } from "@/lib/content";
import { PhotoCardGrid } from "@/components/PhotoCardGrid";

type ServicesShowcaseProps = {
  locale: Locale;
};

// Bespoke per-card treatment (span, aspect ratio, numeral bleed edge) keyed
// by the content-layer's stable slug, not array position — the asymmetric
// editorial layout is a designed composition, not a repeating pattern.
const CARD_LAYOUT: Record<string, string> = {
  "brand-identity": "cardOne",
  "editorial-content": "cardTwo",
  "visual-strategy": "cardThree",
  "video-production": "cardFour",
};

export async function ServicesShowcase({ locale }: ServicesShowcaseProps) {
  const { title, intro, items } = await getHomeServices(locale);

  return (
    <PhotoCardGrid
      eyebrow={intro}
      heading={title}
      backgroundImage="/images/services-contact-sheet.jpg"
      items={items}
      cardLayout={CARD_LAYOUT}
    />
  );
}
