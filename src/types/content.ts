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
