"use client";
import { useState } from "react";
import styles from "./MasterclassNotify.module.css";

export default function MasterclassNotify() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
        <h3 className={styles.successTitle}>¡Te avisaremos!</h3>
        <p className={styles.successText}>
          Cuando lancemos la primera masterclass, serás el primero en enterarte.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.notifyCard}>
      <h3 className={styles.notifyTitle}>🔔 Avísame cuando haya una masterclass</h3>
      <p className={styles.notifyText}>
        Déjanos tu nombre y email y te avisaremos en cuanto tengamos la primera masterclass lista.
      </p>
      <form className={styles.notifyForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          className={styles.notifyInput}
          required
        />
        <input
          type="email"
          placeholder="Tu email"
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
          {status === "loading" ? "Enviando..." : "Avísame"}
        </button>
      </form>
      {status === "error" && (
        <p className={styles.notifyError}>Ha ocurrido un error. Inténtalo de nuevo.</p>
      )}
    </div>
  );
}
