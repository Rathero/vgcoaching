import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      {/* Animated Background */}
      <div className={styles.heroBg}>
        <div className={styles.heroGrid}></div>
      </div>

      {/* Floating Particles */}
      <div className={styles.particles}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>

      {/* Content */}
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot}></span>
          Nuevo: Coaching de League of Legends disponible
        </div>

        <h1 className={styles.heroTitle}>
          Domina el juego.
          <br />
          <span className={styles.heroTitleHighlight}>Escala tu elo.</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Entrena 1 a 1 con jugadores profesionales y ex-competidores.
          Coaching personalizado para subir de elo de verdad, no promesas vacías.
        </p>

        <div className={styles.heroActions}>
          <a href="/games" className="btn btn-primary">
            Encuentra tu coach
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
