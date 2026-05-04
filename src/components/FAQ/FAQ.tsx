"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import styles from "./FAQ.module.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useI18n();

  const faqs = [
    { question: t("faq", "q1"), answer: t("faq", "a1") },
    { question: t("faq", "q2"), answer: t("faq", "a2") },
    { question: t("faq", "q3"), answer: t("faq", "a3") },
    { question: t("faq", "q4"), answer: t("faq", "a4") },
    { question: t("faq", "q5"), answer: t("faq", "a5") },
    { question: t("faq", "q6"), answer: t("faq", "a6") },
    { question: t("faq", "q7"), answer: t("faq", "a7") },
  ];

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className={styles.section} id="faq">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>{t("faq", "label")}</span>
          <h2 className={styles.sectionTitle}>
            {t("faq", "title1")}<span className="gradient-text">{t("faq", "title2")}</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            {t("faq", "subtitle")}
          </p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`${styles.faqItem} ${openIndex === i ? styles.faqItemOpen : ""}`}
            >
              <button className={styles.faqQuestion} onClick={() => toggle(i)}>
                <span>{faq.question}</span>
                <span className={styles.faqIcon}>
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              <div
                className={styles.faqAnswerWrap}
                style={{
                  maxHeight: openIndex === i ? "500px" : "0",
                }}
              >
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
