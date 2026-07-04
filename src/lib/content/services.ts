import type { Locale } from "@/i18n/routing";
import type { Service } from "@/types/content";

export async function getServices(locale: Locale): Promise<Service[]> {
  const data = (await import(`../../content/${locale}/services.json`))
    .default as Service[];
  return data;
}

export async function getServiceBySlug(
  slug: string,
  locale: Locale,
): Promise<Service | undefined> {
  const services = await getServices(locale);
  return services.find((service) => service.slug === slug);
}
