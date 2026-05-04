"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const { t } = useI18n();

  const testimonials = [
    {
      text: t("testimonials", "t1Text"),
      name: "Carlos M.",
      avatar: "👨‍💻",
      meta: t("testimonials", "t1Meta"),
      rankFrom: "Oro IV",
      rankTo: "Platino I",
    },
    {
      text: t("testimonials", "t2Text"),
      name: "Lucía R.",
      avatar: "👩‍🎮",
      meta: t("testimonials", "t2Meta"),
      rankFrom: "Plata II",
      rankTo: "Oro III",
    },
    {
      text: t("testimonials", "t3Text"),
      name: "Andrés P.",
      avatar: "🧑‍💻",
      meta: t("testimonials", "t3Meta"),
      rankFrom: "Platino IV",
      rankTo: "Esmeralda II",
    },
  ];

  return (
    <section className={styles.section} id="testimonios">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>{t("testimonials", "label")}</span>
          <h2 className={styles.sectionTitle}>
            {t("testimonials", "title1")}
            <span className="gradient-text">{t("testimonials", "title2")}</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {testimonials.map((tst, i) => (
            <div key={i} className={`glass-card ${styles.card}`}>
              <span className={styles.quote}>&ldquo;</span>
              <p className={styles.text}>{tst.text}</p>
              <div className={styles.author}>
                <div className={styles.authorAvatar}>{tst.avatar}</div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{tst.name}</div>
                  <div className={styles.authorMeta}>{tst.meta}</div>
                </div>
                <div className={styles.rankChange}>
                  <span className={styles.rankFrom}>{tst.rankFrom}</span>
                  <span className={styles.rankArrow}>↑</span>
                  <span className={styles.rankTo}>{tst.rankTo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
