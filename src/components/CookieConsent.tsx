"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";

import styles from "./CookieConsent.module.css";

const STORAGE_KEY = "cookie-consent";

type ConsentState = "accepted" | "declined" | null;

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  // null = not yet read from localStorage (avoids a hydration mismatch);
  // undefined would also render the banner, so this must stay a tri-state.
  const [consent, setConsent] = useState<ConsentState | undefined>(undefined);

  useEffect(() => {
    setConsent(localStorage.getItem(STORAGE_KEY) as ConsentState);
  }, []);

  function choose(value: "accepted" | "declined") {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  }

  return (
    <>
      {consent === "accepted" && gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');`}
          </Script>
        </>
      ) : null}
      {consent === "accepted" && clarityId ? (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");`}
        </Script>
      ) : null}

      {consent === null ? (
        <div className={styles.banner} role="dialog" aria-label={t("message")}>
          <p className={styles.message}>{t("message")}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.decline}
              onClick={() => choose("declined")}
            >
              {t("decline")}
            </button>
            <button
              type="button"
              className={styles.accept}
              onClick={() => choose("accepted")}
            >
              {t("accept")}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
