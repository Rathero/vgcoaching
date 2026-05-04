import styles from "./HowItWorks.module.css";

const steps = [
  {
    number: "01",
    icon: "🎮",
    title: "Elige tu videojuego",
    description: "Empieza con League of Legends. Pronto más videojuegos.",
  },
  {
    number: "02",
    icon: "🔍",
    title: "Encuentra tu coach",
    description: "Aplica diferentes filtros y encuentra el coach que más se adapta a ti.",
  },
  {
    number: "03",
    icon: "📅",
    title: "Reserva tu sesión",
    description: "Elige horario, tipo de coaching y duración.",
  },
  {
    number: "04",
    icon: "🚀",
    title: "Mejora tu rendimiento",
    description: "Sesiones de coaching adaptadas a tus metas, desde análisis de partidas hasta entrenamiento avanzado en tiempo real.",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="como-funciona">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Así de simple</span>
          <h2 className={styles.sectionTitle}>
            De cero a coaching en{" "}
            <span className="gradient-text">menos de 2 minutos</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Sin complicaciones. Encuentra al coach perfecto, reserva cuando
            te venga bien, y empieza a subir de nivel.
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((step) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.stepNumber}>
                <div className={styles.stepNumberInner}>{step.number}</div>
              </div>
              <div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
