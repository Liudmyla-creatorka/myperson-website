import type { Locale } from "@/i18n/routing";
import { AubeDemo } from "@/sections/AubeDemo";
import { Container } from "@/components/ui/Container";
import styles from "./LandingPagesShowcase.module.css";

type LandingPagesShowcaseProps = {
  locale: Locale;
};

const serviceCopy = {
  pl: {
    eyebrow: "STRONY INTERNETOWE & LANDING PAGE'E",
    title: "Tworzymy cyfrowe doświadczenia, nie tylko strony.",
    intro:
      "Projektujemy i realizujemy strony internetowe oraz landing page’e, łącząc strategię, design, treść, interakcję i technologię w jeden spójny system.",
    scopeTitle: "Od koncepcji do działającej strony.",
    scopeIntro:
      "Zakres projektu dobieramy do marki, jej potrzeb i sposobu, w jaki strona ma być wykorzystywana.",
    items: [
      "Koncepcja i struktura",
      "UX/UI & art direction",
      "Content i warstwa wizualna",
      "Animacje i interakcje",
      "Development i responsywność",
      "Formularze, analityka i integracje",
      "Przygotowanie i wdrożenie",
    ],
    pricingTitle: "Zakres, który wynika z potrzeb.",
    pricing:
      "Nie każda strona potrzebuje tych samych funkcji, technologii czy poziomu interakcji. Finalną wycenę przygotowujemy po określeniu potrzeb, funkcjonalności, integracji oraz zakresu projektu.",
    cta: "Porozmawiajmy o projekcie",
  },
  en: {
    eyebrow: "WEBSITES & LANDING PAGES",
    title: "We create digital experiences, not just pages.",
    intro:
      "We design and build websites and landing pages by combining strategy, design, content, interaction and technology into one coherent system.",
    scopeTitle: "From concept to a working website.",
    scopeIntro:
      "The scope is shaped around the brand, its needs and the way the website will be used.",
    items: [
      "Concept and structure",
      "UX/UI & art direction",
      "Content and visual layer",
      "Animation and interaction",
      "Development and responsive design",
      "Forms, analytics and integrations",
      "Launch preparation and deployment",
    ],
    pricingTitle: "A scope built around real needs.",
    pricing:
      "Not every website needs the same functionality, technology or level of interaction. Final pricing is prepared after defining the required functionality, integrations and project scope.",
    cta: "Let’s talk about your project",
  },
} as const;

export function LandingPagesShowcase({ locale }: LandingPagesShowcaseProps) {
  const copy = serviceCopy[locale];

  return (
    <>
      <section className={styles.demoIntro} aria-label="AUBE live demo">
        <div className={styles.demoLabel}>
          <span>MY PERSON / LIVE WEB EXPERIENCE</span>
          <span>AUBE — CONCEPT BRAND</span>
        </div>
        <AubeDemo />
      </section>

      <section className={styles.serviceSection} aria-labelledby="landing-service-title">
        <Container className={styles.serviceInner}>
          <div className={styles.serviceLead}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h1 id="landing-service-title" className={styles.title}>{copy.title}</h1>
            <p className={styles.intro}>{copy.intro}</p>
          </div>

          <div className={styles.scopeGrid}>
            <div>
              <p className={styles.index}>01 / ZAKRES</p>
              <h2>{copy.scopeTitle}</h2>
              <p>{copy.scopeIntro}</p>
            </div>
            <ul className={styles.scopeList}>
              {copy.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className={styles.pricingBlock}>
            <p className={styles.index}>02 / WYCENA</p>
            <div>
              <h2>{copy.pricingTitle}</h2>
              <p>{copy.pricing}</p>
            </div>
          </div>

          <a className={styles.cta} href={`/${locale}/#kontakt`}>
            <span>{copy.cta}</span><span aria-hidden="true">↗</span>
          </a>
        </Container>
      </section>
    </>
  );
}
