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
              No importa si estás en Hierro o en Diamante. Siempre hay un
              siguiente nivel. Déjanos ayudarte a llegar.
            </p>
            <div className={styles.ctaActions}>
              <a href="/games" className="btn btn-primary">
                Encuentra tu coach →
              </a>
              <a href="#como-funciona" className="btn btn-secondary">
                Saber más
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
