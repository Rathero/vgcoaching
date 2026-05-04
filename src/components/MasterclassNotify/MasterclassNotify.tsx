"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import styles from "./MasterclassNotify.module.css";

export default function MasterclassNotify() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "masterclass", name, email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setName("");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.successCard}>
        <span className={styles.successIcon}>✅</span>
        <h3 className={styles.successTitle}>{t("masterclassNotify", "successTitle")}</h3>
        <p className={styles.successText}>
          {t("masterclassNotify", "successText")}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.notifyCard}>
      <h3 className={styles.notifyTitle}>{t("masterclassNotify", "title")}</h3>
      <p className={styles.notifyText}>
        {t("masterclassNotify", "text")}
      </p>
      <form className={styles.notifyForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t("masterclassNotify", "namePlaceholder")}
          value={name}
          onChange={e => setName(e.target.value)}
          className={styles.notifyInput}
          required
        />
        <input
          type="email"
          placeholder={t("masterclassNotify", "emailPlaceholder")}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={styles.notifyInput}
          required
        />
        <button
          type="submit"
          className={styles.notifyBtn}
          disabled={status === "loading"}
        >
          {status === "loading" ? t("masterclassNotify", "submitting") : t("masterclassNotify", "submit")}
        </button>
      </form>
      {status === "error" && (
        <p className={styles.notifyError}>{t("masterclassNotify", "error")}</p>
      )}
    </div>
  );
}
