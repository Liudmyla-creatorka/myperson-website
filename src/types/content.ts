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
