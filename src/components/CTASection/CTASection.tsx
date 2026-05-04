import styles from "./CTASection.module.css";

export default function CTASection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.ctaBox}>
          <div className={styles.ctaBg}></div>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Tu siguiente victoria{" "}
              <span className="gradient-text">empieza aquí</span>
            </h2>
            <p className={styles.ctaSubtitle}>
              Del rango Hierro al Diamante, cada nivel exige una nueva estrategia.
              No dejes tu progresión al azar: domina el juego y marca la diferencia en cada partida.
            </p>
            <div className={styles.ctaActions}>
              <a href="/games" className="btn btn-primary">
                Encuentra tu coach →
              </a>
            </div>
            <p className={styles.ctaNote}>
              Sin suscripciones · Paga solo por sesión · Cancela cuando quieras
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
