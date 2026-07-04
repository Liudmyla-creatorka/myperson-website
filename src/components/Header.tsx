import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import styles from "./Header.module.css";

export async function Header() {
  const t = await getTranslations("nav");

  const links = [
    { href: "/", label: t("home") },
    { href: "/portfolio", label: t("portfolio") },
    { href: "/services", label: t("services") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.logo}>
          MY PERSON
        </Link>
        <nav aria-label="Primary" className={styles.nav}>
          <ul role="list" className={styles.navList}>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitcher />
      </Container>
    </header>
  );
}
