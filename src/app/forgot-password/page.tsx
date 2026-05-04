"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import styles from "../login/page.module.css";

export default function ForgotPasswordPage() {
  const { user, loading, resetPassword } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) return null;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      switch (code) {
        case "auth/user-not-found":
          setError(t("forgotPassword", "errNotFound"));
          break;
        case "auth/invalid-email":
          setError(t("forgotPassword", "errInvalidEmail"));
          break;
        case "auth/too-many-requests":
          setError(t("forgotPassword", "errTooMany"));
          break;
        default:
          setError(t("forgotPassword", "errDefault"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={`glass-card ${styles.card}`}>
          <div className={styles.icon}>🔑</div>
          <h1 className={styles.title}>{t("forgotPassword", "title")}</h1>
          <p className={styles.subtitle}>
            {t("forgotPassword", "subtitle")}
          </p>

          <form className={styles.form} onSubmit={handleReset}>
            {error && <div className={styles.error}>{error}</div>}
            {success && (
              <div className={styles.success}>
                {t("forgotPassword", "success")}
              </div>
            )}

            {!success && (
              <>
                <input
                  type="email"
                  placeholder={t("forgotPassword", "emailPlaceholder")}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={styles.input}
                  required
                  autoComplete="email"
                />

                <button type="submit" className={styles.emailBtn} disabled={submitting}>
                  {submitting ? t("forgotPassword", "submitting") : t("forgotPassword", "submit")}
                </button>
              </>
            )}
          </form>

          <div className={styles.links}>
            <Link href="/login" className={styles.link}>{t("forgotPassword", "back")}</Link>
          </div>
        </div>
      </div>
    </>
  );
}
