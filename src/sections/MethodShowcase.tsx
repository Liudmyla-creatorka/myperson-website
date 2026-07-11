import type { Locale } from "@/i18n/routing";
import { getMethodSteps } from "@/lib/content";
import { PhotoCardGrid } from "@/components/PhotoCardGrid";

type MethodShowcaseProps = {
  locale: Locale;
};

// Same bespoke-per-card treatment as ServicesShowcase, keyed by the
// content-layer's stable slug — see PhotoCardGrid for the shared
// grid/hover/spotlight implementation both sections use identically.
const CARD_LAYOUT: Record<string, string> = {
  analiza: "cardOne",
  strategia: "cardTwo",
  produkcja: "cardThree",
  weryfikacja: "cardFour",
};

export async function MethodShowcase({ locale }: MethodShowcaseProps) {
  const { title, intro, items } = await getMethodSteps(locale);

  return (
    <PhotoCardGrid
      eyebrow={intro}
      heading={title}
      backgroundImage="/images/method-contact-sheet.jpg"
      items={items}
      cardLayout={CARD_LAYOUT}
    />
  );
}
