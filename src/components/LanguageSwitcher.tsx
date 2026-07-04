"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import styles from "./LanguageSwitcher.module.css";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("languageSwitcher");

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          className={loc === locale ? styles.active : styles.option}
          aria-current={loc === locale}
          onClick={() => router.replace(pathname, { locale: loc })}
        >
          {t(loc)}
        </button>
      ))}
    </div>
  );
}
