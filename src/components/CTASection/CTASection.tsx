"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./CTASection.module.css";

export default function CTASection() {
  const { t } = useI18n();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.ctaBox}>
          <div className={styles.ctaBg}></div>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              {t("cta", "title1")}
              <span className="gradient-text">{t("cta", "title2")}</span>
            </h2>
            <p className={styles.ctaSubtitle}>
              {t("cta", "subtitle")}
            </p>
            <div className={styles.ctaActions}>
              <a href="/games" className="btn btn-primary">
                {t("cta", "button")}
              </a>
            </div>
            <p className={styles.ctaNote}>
              {t("cta", "note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
