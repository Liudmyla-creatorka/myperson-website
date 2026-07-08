import type { Locale } from "@/i18n/routing";
import { getMethodSteps } from "@/lib/content";
import { MethodFilmstrip } from "@/sections/MethodFilmstrip";

type MethodProps = {
  locale: Locale;
};

export async function Method({ locale }: MethodProps) {
  const { title, intro, items } = await getMethodSteps(locale);

  return <MethodFilmstrip title={title} intro={intro} steps={items} />;
}
