"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./page.module.css";

export function MasterclassBadge() {
  const { t } = useI18n();
  return <>{t("masterclassPage", "badge")}</>;
}

export function MasterclassSubtitle() {
  const { t } = useI18n();
  return <>{t("masterclassPage", "subtitle")}</>;
}

export function ComingSoonTitle() {
  const { t } = useI18n();
  return <>{t("masterclassPage", "comingSoonTitle")}</>;
}

export function ComingSoonText() {
  const { t } = useI18n();
  return <>{t("masterclassPage", "comingSoonText")}</>;
}

export function TopicsList() {
  const { t } = useI18n();
  const topics = [
    { icon: "🌊", title: t("masterclassPage", "topic1Title"), desc: t("masterclassPage", "topic1Desc") },
    { icon: "🗺️", title: t("masterclassPage", "topic2Title"), desc: t("masterclassPage", "topic2Desc") },
    { icon: "🌲", title: t("masterclassPage", "topic3Title"), desc: t("masterclassPage", "topic3Desc") },
    { icon: "⚔️", title: t("masterclassPage", "topic4Title"), desc: t("masterclassPage", "topic4Desc") },
    { icon: "👁️", title: t("masterclassPage", "topic5Title"), desc: t("masterclassPage", "topic5Desc") },
    { icon: "🧠", title: t("masterclassPage", "topic6Title"), desc: t("masterclassPage", "topic6Desc") },
  ];
  return (
    <>
      {topics.map((topic, i) => (
        <div key={i} className={styles.topicCard}>
          <span className={styles.topicIcon}>{topic.icon}</span>
          <div>
            <strong>{topic.title}</strong>
            <span className={styles.topicDesc}>{topic.desc}</span>
          </div>
        </div>
      ))}
    </>
  );
}

export function SlotsText({ current, max }: { current: number; max: number }) {
  const { t } = useI18n();
  return <>👥 {current}/{max} {t("masterclassPage", "slots")}</>;
}

export function BookSlotBtn() {
  const { t } = useI18n();
  return <>{t("masterclassPage", "bookSlot")}</>;
}
