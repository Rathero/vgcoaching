"use client";
import { useState } from "react";
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
          <h3 className={styles.successTitle}>¡Solicitud enviada!</h3>
          <p className={styles.successText}>
            Te avisaremos en cuanto incorporemos nuevos coaches que encajen con lo que buscas.
            ¡Sé el primero en elegir!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.ctaCard}>
        <div className={styles.ctaContent}>
          <h3 className={styles.ctaTitle}>¿Buscas algo más?</h3>
          <p className={styles.ctaText}>
            Apúntate a nuestra lista de novedades y te avisaremos en cuanto incorporemos
            nuevos coaches. ¡Sé el primero en elegir!
          </p>
          {!open && (
            <button className={styles.ctaBtn} onClick={() => setOpen(true)}>
              Quiero que me aviséis
            </button>
          )}
        </div>

        {open && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>¿Qué tipo de coach buscas?</label>
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
              <label className={styles.formLabel}>Especificaciones (opcional)</label>
              <textarea
                placeholder="¿Hay algo específico que busques? Rango, idioma, horarios..."
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
              {status === "loading" ? "Enviando..." : "Enviar solicitud"}
            </button>

            {status === "error" && (
              <p className={styles.formError}>Ha ocurrido un error. Inténtalo de nuevo.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
