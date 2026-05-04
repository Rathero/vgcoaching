"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./FeaturedCoaches.module.css";

export function FeaturedCoachesHeader() {
  const { t } = useI18n();
  return (
    <>
      <span className={styles.sectionLabel}>{t("featuredCoaches", "label")}</span>
      <h2 className={styles.sectionTitle}>
        {t("featuredCoaches", "title1")}<span className="gradient-text">{t("featuredCoaches", "title2")}</span>
      </h2>
      <p className={styles.sectionSubtitle}>
        {t("featuredCoaches", "subtitle")}
      </p>
    </>
  );
}

export function SessionsLabel({ count }: { count: number }) {
  const { t } = useI18n();
  return <>{count} {t("featuredCoaches", "sessions")}</>;
}

export function PriceLabel({ hasPrice, formattedPrice }: { hasPrice: boolean; formattedPrice?: string }) {
  const { t } = useI18n();
  if (hasPrice) {
    return (
      <>
        <span className={styles.price}>{formattedPrice}</span>
        <span className={styles.priceLabel}>{t("featuredCoaches", "perSession")}</span>
      </>
    );
  }
  return <span className={styles.priceLabel}>{t("featuredCoaches", "checkPrice")}</span>;
}

export function ViewProfileBtn() {
  const { t } = useI18n();
  return <>{t("featuredCoaches", "viewProfile")}</>;
}

export function ViewAllCoachesLink() {
  const { t } = useI18n();
  return (
    <a href="/games" className="btn btn-secondary">
      {t("featuredCoaches", "viewAllCoaches")}
    </a>
  );
}
