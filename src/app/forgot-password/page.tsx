"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import styles from "../login/page.module.css";

export default function ForgotPasswordPage() {
  const { user, loading, resetPassword } = useAuth();
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
          setError("No existe una cuenta con este email.");
          break;
        case "auth/invalid-email":
          setError("Email no válido.");
          break;
        case "auth/too-many-requests":
          setError("Demasiados intentos. Espera unos minutos.");
          break;
        default:
          setError("Error al enviar el email. Inténtalo de nuevo.");
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
          <h1 className={styles.title}>Recuperar contraseña</h1>
          <p className={styles.subtitle}>
            Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <form className={styles.form} onSubmit={handleReset}>
            {error && <div className={styles.error}>{error}</div>}
            {success && (
              <div className={styles.success}>
                ✅ Email enviado. Revisa tu bandeja de entrada (y la carpeta de spam) para restablecer tu contraseña.
              </div>
            )}

            {!success && (
              <>
                <input
                  type="email"
                  placeholder="Email de tu cuenta"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={styles.input}
                  required
                  autoComplete="email"
                />

                <button type="submit" className={styles.emailBtn} disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar enlace de recuperación"}
                </button>
              </>
            )}
          </form>

          <div className={styles.links}>
            <Link href="/login" className={styles.link}>← Volver a iniciar sesión</Link>
          </div>
        </div>
      </div>
    </>
  );
}
