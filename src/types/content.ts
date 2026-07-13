export interface Service {
  slug: string;
  title: string;
  summary: string;
}

export interface PortfolioItem {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  image: string;
  /** Modal-only fields for the Home hotspot popup (see PortfolioFilmstrip) —
   *  additive, kept separate from category/year so the /portfolio route's
   *  grid and detail pages, which read category/year, are unaffected. */
  subtitle: string;
  tags: string;
}

export interface PageCta {
  label: string;
  href: string;
}

export interface PageCopy {
  title: string;
  intro: string;
  eyebrow?: string;
  primaryCta?: PageCta;
  secondaryCta?: PageCta;
}

export interface HomeServiceCard {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface HomeServicesContent {
  title: string;
  intro: string;
  items: HomeServiceCard[];
}

export interface MethodStep {
  slug: string;
  title: string;
  summary: string;
}

export interface MethodContent {
  title: string;
  intro: string;
  items: MethodStep[];
}

export interface CampaignItem {
  slug: string;
  videoSrc: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface CampaignsContent {
  eyebrow: string;
  title: string;
  intro: string;
  items: CampaignItem[];
}

export interface CaseStudyImage {
  src: string;
  variant: string;
  tags: string;
}

export interface CaseStudyContent {
  eyebrow: string;
  title: string;
  description: string;
  images: CaseStudyImage[];
  siteCta: PageCta;
  instagramCta: PageCta;
}

export interface BeforeAfterItem {
  slug: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

export interface BeforeAfterContent {
  eyebrow: string;
  title: string;
  intro: string;
  items: BeforeAfterItem[];
}

export interface PhilosophyContent {
  eyebrow: string;
  title: string;
  paragraphs: string[];
}

export interface ContactCtaContent {
  eyebrow: string;
  title: string;
  subheading: string;
  ctaLabel: string;
}

export interface FooterContent {
  description: string;
}
