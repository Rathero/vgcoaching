"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  const { t } = useI18n();

  const steps = [
    {
      number: "01",
      icon: "🎮",
      title: t("howItWorks", "step1Title"),
      description: t("howItWorks", "step1Desc"),
    },
    {
      number: "02",
      icon: "🔍",
      title: t("howItWorks", "step2Title"),
      description: t("howItWorks", "step2Desc"),
    },
    {
      number: "03",
      icon: "📅",
      title: t("howItWorks", "step3Title"),
      description: t("howItWorks", "step3Desc"),
    },
    {
      number: "04",
      icon: "🚀",
      title: t("howItWorks", "step4Title"),
      description: t("howItWorks", "step4Desc"),
    },
  ];

  return (
    <section className={styles.section} id="como-funciona">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>{t("howItWorks", "label")}</span>
          <h2 className={styles.sectionTitle}>
            {t("howItWorks", "title1")}
            <span className="gradient-text">{t("howItWorks", "title2")}</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            {t("howItWorks", "subtitle")}
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((step) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.stepNumber}>
                <div className={styles.stepNumberInner}>{step.number}</div>
              </div>
              <div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
