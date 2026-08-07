"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./AubeDemo.module.css";

const ingredients = [
  {
    kicker: "01 / Ukojenie",
    title: "Rumianek",
    display: "Cisza dla skóry.",
    copy: "Ekstrakt z rumianku otula skórę kojącą pielęgnacją, pomaga przywrócić komfort i pozostawia ją miękką w dotyku.",
    image: "/aube/chamomile.png",
    tone: "light",
    align: "left",
  },
  {
    kicker: "02 / Nawilżenie",
    title: "Kwas hialuronowy",
    display: "Nawilżenie, które zostaje.",
    copy: "Kwas hialuronowy pomaga zatrzymać wodę w naskórku. Skóra staje się gładsza, sprężysta i świeża — bez uczucia ciężkości.",
    image: "/aube/hyaluronic.jpeg",
    tone: "dark",
    align: "right",
  },
  {
    kicker: "03 / Odżywienie",
    title: "Olej z pestek winogron",
    display: "Miękkość bez ciężkości.",
    copy: "Lekki olej z pestek winogron wspiera barierę skóry, wygładza i nadaje subtelny blask, zachowując jedwabiste wykończenie.",
    image: "/aube/grape-oil.jpeg",
    tone: "dark",
    align: "left",
  },
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function AubeDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    let frame = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      frame = 0;
      const root = rootRef.current;
      const hero = heroRef.current;
      if (!root) return;

      if (hero) {
        const rect = hero.getBoundingClientRect();
        const distance = Math.max(1, hero.offsetHeight - window.innerHeight);
        const p = clamp(-rect.top / distance);
        const heroVideo = heroVideoRef.current;

        if (heroVideo && heroVideo.readyState >= 1 && Number.isFinite(heroVideo.duration)) {
          const duration = Math.max(0, heroVideo.duration - 0.035);
          const targetTime = clamp(p / 0.9) * duration;
          if (Math.abs(heroVideo.currentTime - targetTime) > 0.018) {
            heroVideo.currentTime = targetTime;
          }
        }

        root.style.setProperty("--aube-hero-p", p.toFixed(4));
        root.style.setProperty("--aube-copy-alpha", String(clamp(1 - Math.max(0, p - 0.54) / 0.24)));
        root.style.setProperty("--aube-nav-alpha", String(clamp(1 - Math.max(0, p - 0.6) / 0.18)));
      }

      sceneRefs.current.forEach((scene) => {
        if (!scene) return;
        const rect = scene.getBoundingClientRect();
        const travel = Math.max(1, scene.offsetHeight - window.innerHeight);
        const p = clamp(-rect.top / travel);
        scene.style.setProperty("--aube-scene-scale", (1.085 - p * 0.085).toFixed(4));
        scene.style.setProperty("--aube-scene-y", `${(1 - p) * 2.8}vh`);
        scene.style.setProperty("--aube-copy-y", `${(1 - p) * 54}px`);
        scene.style.setProperty("--aube-scene-alpha", String(clamp(p * 2.5 + 0.12)));
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onPointer = (event: PointerEvent) => {
      if (reduced) return;
      rootRef.current?.style.setProperty("--aube-pointer-x", (event.clientX / window.innerWidth).toFixed(4));
      rootRef.current?.style.setProperty("--aube-pointer-y", (event.clientY / window.innerHeight).toFixed(4));
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("pointermove", onPointer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToFormula = () => {
    rootRef.current?.querySelector<HTMLElement>("[data-aube-formula]")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={rootRef} className={styles.demoRoot} aria-label="AUBE — demonstracyjny landing page MY PERSON">
      <section ref={heroRef} className={styles.heroStory} aria-label="AUBE Body Serum">
        <div className={styles.heroSticky}>
          <div className={styles.heroAtmosphere} aria-hidden="true" />
          <video
            ref={heroVideoRef}
            className={styles.heroVideo}
            src="/aube/drop-scroll.mp4"
            poster="/aube/hero-wide.png"
            preload="auto"
            muted
            playsInline
            aria-hidden="true"
          />
          <div className={styles.cursorAura} aria-hidden="true" />

          <header className={styles.aubeTopbar}>
            <div className={styles.brandLockup} aria-label="AUBE">
              <span>AUBE</span>
              <small>BODY SERUM</small>
            </div>
            <nav className={styles.microNav} aria-label="Nawigacja demonstracyjna AUBE">
              <button type="button" onClick={scrollToFormula}>Formuła</button>
              <button type="button" onClick={scrollToFormula}>Składniki</button>
              <span>AUBE</span>
            </nav>
            <div className={styles.aubeActions}>
              <span className={styles.demoBadge}>DEMO / CONCEPT</span>
              <span className={styles.cartPill} aria-live="polite">Koszyk ({inCart ? 1 : 0})</span>
            </div>
          </header>

          <div className={styles.speciesName} aria-hidden="true">
            <span>BOTANICA</span>
            <span>AUBE</span>
          </div>

          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Botanical body serum / 100 ml</p>
            <h2>Natura zamknięta<br /><em>w każdej kropli.</em></h2>
          </div>

          <div className={styles.heroAside}>
            <p>Lekkie serum do ciała z rumiankiem, kwasem hialuronowym i olejem z pestek winogron. Nawilża, koi i przywraca skórze naturalną miękkość.</p>
            <button type="button" onClick={scrollToFormula}>Poznaj formułę <span>↘</span></button>
          </div>

          <p className={styles.scrollCue}>Scroll to enter <span>↓</span></p>
        </div>
      </section>

      <div data-aube-formula>
        {ingredients.map((ingredient, index) => (
          <section
            key={ingredient.title}
            ref={(node) => { sceneRefs.current[index] = node; }}
            className={`${styles.ingredientScene} ${ingredient.tone === "light" ? styles.toneLight : styles.toneDark} ${ingredient.align === "right" ? styles.alignRight : ""}`}
          >
            <div className={styles.sceneSticky}>
              <img className={styles.sceneImage} src={ingredient.image} alt="" />
              <div className={styles.sceneShade} />
              <div className={styles.sceneNumber}>0{index + 1}</div>
              <article className={styles.ingredientCopy}>
                <p className={styles.eyebrow}>{ingredient.kicker}</p>
                <h2>{ingredient.title}</h2>
                <h3>{ingredient.display}</h3>
                <p className={styles.ingredientBody}>{ingredient.copy}</p>
                <div className={styles.ingredientLine}><span /></div>
              </article>
              <p className={styles.edgeLabel}>AUBE / active botanical formula</p>
            </div>
          </section>
        ))}
      </div>

      <section
        ref={(node) => { sceneRefs.current[3] = node; }}
        className={`${styles.ingredientScene} ${styles.bottleScene} ${styles.toneDark}`}
      >
        <div className={`${styles.sceneSticky} ${styles.bottleStage}`}>
          <div className={styles.bottleHaze} />
          <img className={styles.bottleImage} src="/aube/bottle-wide.jpeg" alt="Flakon AUBE Body Serum" />
          <div className={styles.bottleVignette} />
          <div className={styles.bottleCopy}>
            <p className={styles.eyebrow}>AUBE / Botanical body serum</p>
            <h2>Twoja skóra.<br /><em>Twój rytuał.</em></h2>
            <p>Trzy aktywne składniki. Jedna lekka formuła stworzona dla codziennego komfortu, nawilżenia i miękkości skóry.</p>
          </div>
          <aside className={styles.purchaseCard} aria-label="Zakup AUBE Body Serum">
            <div className={styles.purchaseMeta}><span>Body serum / 100 ml</span><span>01</span></div>
            <div className={styles.purchasePrice}><span>Cena</span><strong>189 PLN</strong></div>
            <button
              className={`${styles.addToCart} ${inCart ? styles.isAdded : ""}`}
              type="button"
              onClick={() => setInCart(true)}
            >
              <span>{inCart ? "Dodano do koszyka" : "Dodaj do koszyka"}</span>
              <span aria-hidden="true">{inCart ? "✓" : "+"}</span>
            </button>
          </aside>
          <footer className={styles.demoFooter}>
            <span>AUBE — DEMO / CONCEPT BRAND</span>
            <span>Interactive experience by MY PERSON</span>
          </footer>
        </div>
      </section>
    </div>
  );
}
