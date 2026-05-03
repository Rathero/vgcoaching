"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import styles from "../login/page.module.css";

export default function RegisterPage() {
  const { user, loading, signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (!displayName.trim()) {
      setError("Introduce tu nombre.");
      return;
    }

    setSubmitting(true);
    try {
      await signUpWithEmail(email, password, displayName.trim());
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      switch (code) {
        case "auth/email-already-in-use":
          setError("Ya existe una cuenta con este email.");
          break;
        case "auth/invalid-email":
          setError("Email no válido.");
          break;
        case "auth/weak-password":
          setError("La contraseña es demasiado débil. Usa al menos 6 caracteres.");
          break;
        default:
          setError("Error al crear la cuenta. Inténtalo de nuevo.");
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
          <div className={styles.icon}>🎮</div>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.subtitle}>Regístrate para reservar sesiones con los mejores coaches.</p>

          {/* Google button */}
          <button className={styles.googleBtn} onClick={signInWithGoogle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Registrarse con Google
          </button>

          <div className={styles.divider}>
            <span>o con email</span>
          </div>

          <form className={styles.form} onSubmit={handleRegister}>
            {error && <div className={styles.error}>{error}</div>}

            <input
              type="text"
              placeholder="Nombre de usuario"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className={styles.input}
              required
              autoComplete="name"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Contraseña (min. 6 caracteres)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="new-password"
              minLength={6}
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="new-password"
              minLength={6}
            />

            <button type="submit" className={styles.emailBtn} disabled={submitting}>
              {submitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className={styles.links}>
            <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>¿Ya tienes cuenta?</span>
            <Link href="/login" className={styles.link}>Iniciar sesión</Link>
          </div>

          <div className={styles.links} style={{ marginTop: 0 }}>
            <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>¿Quieres ser coach?</span>
            <Link href="/become-coach" className={styles.link} style={{ color: "var(--color-warning)" }}>🏆 Registrarse como coach</Link>
          </div>

          <p className={styles.legal}>
            Al registrarte, aceptas nuestros <a href="#">Términos de Servicio</a> y <a href="#">Política de Privacidad</a>.
          </p>
        </div>
      </div>
    </>
  );
}
