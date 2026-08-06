import Image from "next/image";
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
    { href: "/landing-pages", label: t("landingPages") },
    { href: "/about", label: t("about") },
    { href: "/#kontakt", label: t("contact") },
  ] as const;

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>
            <Image
              src="/images/logo.jpg"
              alt=""
              fill
              sizes="2.25rem"
              className={styles.logoMarkImage}
            />
          </span>
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
        <div className={styles.actions}>
          <LanguageSwitcher />
        </div>
      </Container>
    </header>
  );
}
