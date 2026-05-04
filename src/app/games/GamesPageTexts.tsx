"use client";

import { useI18n } from "@/lib/i18n";

export function GamesPageHeader() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t("gamesPage", "title")}</h1>
      <p>{t("gamesPage", "subtitle")}</p>
    </>
  );
}

export function GameCardActive({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <>
      {children}
      <p>{t("gamesPage", "findCoaches")}</p>
      <span>{t("gamesPage", "viewCoaches")}</span>
    </>
  );
}

export function GameCardDesc() {
  const { t } = useI18n();
  return <p>{t("gamesPage", "findCoaches")}</p>;
}

export function GameCardBtn() {
  const { t } = useI18n();
  return <span>{t("gamesPage", "viewCoaches")}</span>;
}

export function GameComingSoon() {
  const { t } = useI18n();
  return <span>{t("gamesPage", "comingSoon")}</span>;
}
