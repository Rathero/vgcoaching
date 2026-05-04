"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./page.module.css";

export function GamesPageHeader() {
  const { t } = useI18n();
  return (
    <>
      <h1 className={styles.title}>{t("gamesPage", "title")}</h1>
      <p className={styles.subtitle}>{t("gamesPage", "subtitle")}</p>
    </>
  );
}

export function GameCardDesc() {
  const { t } = useI18n();
  return <>{t("gamesPage", "findCoaches")}</>;
}

export function GameCardBtn() {
  const { t } = useI18n();
  return <>{t("gamesPage", "viewCoaches")}</>;
}

export function GameComingSoon() {
  const { t } = useI18n();
  return <>{t("gamesPage", "comingSoon")}</>;
}
