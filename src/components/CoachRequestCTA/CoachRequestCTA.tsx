"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import styles from "./CoachRequestCTA.module.css";

const roleOptions = [
  { id: "top", label: "🗡️ Top" },
  { id: "jungle", label: "🌲 Jungle" },
  { id: "mid", label: "⚔️ Mid" },
  { id: "adc", label: "🏹 ADC" },
  { id: "support", label: "🛡️ Support" },
];

interface Props {
  gameSlug: string;
}

export default function CoachRequestCTA({ gameSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { t } = useI18n();

  const toggleRole = (id: string) =>
    setRoles(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "coach_request",
          name,
          email,
          roles,
          specifications,
          gameSlug,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.successCard}>
          <span className={styles.successIcon}>🎉</span>
          <h3 className={styles.successTitle}>{t("coachRequestCTA", "successTitle")}</h3>
          <p className={styles.successText}>
            {t("coachRequestCTA", "successText")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.ctaCard}>
        <div className={styles.ctaContent}>
          <h3 className={styles.ctaTitle}>{t("coachRequestCTA", "title")}</h3>
          <p className={styles.ctaText}>
            {t("coachRequestCTA", "text")}
          </p>
          {!open && (
            <button className={styles.ctaBtn} onClick={() => setOpen(true)}>
              {t("coachRequestCTA", "button")}
            </button>
          )}
        </div>

        {open && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder={t("coachRequestCTA", "namePlaceholder")}
                value={name}
                onChange={e => setName(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="email"
                placeholder={t("coachRequestCTA", "emailPlaceholder")}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t("coachRequestCTA", "roleLabel")}</label>
              <div className={styles.roleGrid}>
                {roleOptions.map(role => (
                  <button
                    key={role.id}
                    type="button"
                    className={`${styles.roleBtn} ${roles.includes(role.id) ? styles.roleBtnActive : ""}`}
                    onClick={() => toggleRole(role.id)}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t("coachRequestCTA", "specLabel")}</label>
              <textarea
                placeholder={t("coachRequestCTA", "specPlaceholder")}
                value={specifications}
                onChange={e => setSpecifications(e.target.value)}
                className={styles.textarea}
                rows={3}
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === "loading"}
            >
              {status === "loading" ? t("coachRequestCTA", "submitting") : t("coachRequestCTA", "submit")}
            </button>

            {status === "error" && (
              <p className={styles.formError}>{t("coachRequestCTA", "error")}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
