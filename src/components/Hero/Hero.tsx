"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./Hero.module.css";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className={styles.hero} id="hero">
      {/* Animated Background */}
      <div className={styles.heroBg}>
        <div className={styles.heroGrid}></div>
      </div>

      {/* Floating Particles */}
      <div className={styles.particles}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>

      {/* Content */}
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot}></span>
          {t("hero", "badge")}
        </div>

        <h1 className={styles.heroTitle}>
          {t("hero", "title1")}
          <br />
          <span className={styles.heroTitleHighlight}>{t("hero", "title2")}</span>
        </h1>

        <p className={styles.heroSubtitle}>
          {t("hero", "subtitle")}
        </p>

        <div className={styles.heroActions}>
          <a href="/games" className="btn btn-primary">
            {t("hero", "cta")}
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
