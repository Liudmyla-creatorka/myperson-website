import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import styles from "./Footer.module.css";

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <span>MY PERSON</span>
        <span>
          © {year} MY PERSON. {t("rights")}
        </span>
      </Container>
    </footer>
  );
}
