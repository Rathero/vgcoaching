"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./Benefits.module.css";

export default function Benefits() {
  const { t } = useI18n();

  const benefits = [
    {
      icon: "🎯",
      iconClass: "cardIconPrimary",
      glowClass: "glowPrimary",
      title: t("benefits", "card1Title"),
      description: t("benefits", "card1Desc"),
    },
    {
      icon: "📈",
      iconClass: "cardIconSecondary",
      glowClass: "glowSecondary",
      title: t("benefits", "card2Title"),
      description: t("benefits", "card2Desc"),
    },
    {
      icon: "🏆",
      iconClass: "cardIconAccent",
      glowClass: "glowAccent",
      title: t("benefits", "card3Title"),
      description: t("benefits", "card3Desc"),
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>{t("benefits", "label")}</span>
          <h2 className={styles.sectionTitle}>
            {t("benefits", "title1")}
            <span className="gradient-text">{t("benefits", "title2")}</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            {t("benefits", "subtitle")}
          </p>
        </div>

        <div className={styles.grid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={`glass-card ${styles.card}`}>
              <div className={styles.cardGlow + " " + styles[benefit.glowClass]}></div>
              <div className={`${styles.cardIcon} ${styles[benefit.iconClass]}`}>
                {benefit.icon}
              </div>
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardDescription}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
