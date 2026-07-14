import type { Locale } from "@/i18n/routing";
import { getHomeCampaigns } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { CinematicVideoBackdrop } from "@/components/CinematicVideoBackdrop";
import { CampaignsGrid } from "./CampaignsGrid";
import styles from "./CampaignsShowcase.module.css";

type CampaignsShowcaseProps = {
  locale: Locale;
};

export async function CampaignsShowcase({ locale }: CampaignsShowcaseProps) {
  const { eyebrow, title, intro, items } = await getHomeCampaigns(locale);

  return (
    <section className={styles.section}>
      <CinematicVideoBackdrop kind="image" imageSrc="/images/reel-portfolio.png" />

      <Container className={styles.headerRow}>
        <div className={styles.headerText}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.intro}>{intro}</p>
        </div>
      </Container>

      <Container>
        <CampaignsGrid
          items={items}
          muteLabel={locale === "pl" ? "Wycisz dźwięk" : "Mute sound"}
          unmuteLabel={locale === "pl" ? "Włącz dźwięk" : "Unmute sound"}
        />
      </Container>
    </section>
  );
}
