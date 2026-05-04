"use client";

import { useI18n } from "@/lib/i18n";

export function FeaturedCoachesHeader() {
  const { t } = useI18n();
  return (
    <>
      <span style={{}}>{t("featuredCoaches", "label")}</span>
      <h2>
        {t("featuredCoaches", "title1")}<span className="gradient-text">{t("featuredCoaches", "title2")}</span>
      </h2>
      <p>
        {t("featuredCoaches", "subtitle")}
      </p>
    </>
  );
}

export function FeaturedCoachesTexts() {
  const { t } = useI18n();
  return {
    sessions: t("featuredCoaches", "sessions"),
    perSession: t("featuredCoaches", "perSession"),
    checkPrice: t("featuredCoaches", "checkPrice"),
    viewProfile: t("featuredCoaches", "viewProfile"),
    viewAllCoaches: t("featuredCoaches", "viewAllCoaches"),
  };
}

export function SessionsLabel({ count }: { count: number }) {
  const { t } = useI18n();
  return <span>{count} {t("featuredCoaches", "sessions")}</span>;
}

export function PriceLabel({ hasPrice, formattedPrice }: { hasPrice: boolean; formattedPrice?: string }) {
  const { t } = useI18n();
  if (hasPrice) {
    return (
      <>
        <span>{formattedPrice}</span>
        <span>{t("featuredCoaches", "perSession")}</span>
      </>
    );
  }
  return <span>{t("featuredCoaches", "checkPrice")}</span>;
}

export function ViewProfileBtn() {
  const { t } = useI18n();
  return <span>{t("featuredCoaches", "viewProfile")}</span>;
}

export function ViewAllCoachesLink() {
  const { t } = useI18n();
  return (
    <a href="/games" className="btn btn-secondary">
      {t("featuredCoaches", "viewAllCoaches")}
    </a>
  );
}
