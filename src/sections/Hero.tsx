import type { Locale } from "@/i18n/routing";
import { getPageCopy } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { HeroBackground } from "@/sections/HeroBackground";
import { CursorLight } from "@/sections/CursorLight";
import { HeroContent } from "@/sections/HeroContent";
import styles from "./Hero.module.css";

type HeroProps = {
  locale: Locale;
};

export async function Hero({ locale }: HeroProps) {
  const copy = await getPageCopy("home", locale);

  return (
    <section className={styles.hero}>
      <HeroBackground />
      <CursorLight />
      <Container className={styles.container}>
        <HeroContent copy={copy} />
      </Container>
    </section>
  );
}
