"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import styles from "./LanguageSwitcher.module.css";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={loc === locale ? styles.active : styles.option}
          aria-current={loc === locale ? "page" : undefined}
        >
          {t(loc)}
        </Link>
      ))}
    </div>
  );
}
