import styles from "./Benefits.module.css";

const benefits = [
  {
    icon: "🎯",
    iconClass: "cardIconPrimary",
    glowClass: "glowPrimary",
    title: "Aprende con los mejores",
    description:
      "Conecta con coaches verificados, expertos en tu rol, que te guiarán con métodos probados para elevar tu nivel de juego. Tu camino al éxito, respaldado por profesionales.",
  },
  {
    icon: "📈",
    iconClass: "cardIconSecondary",
    glowClass: "glowSecondary",
    title: "Formatos flexibles",
    description:
      "Elige cómo quieres aprender: sesiones individuales para un enfoque total, o entrenamientos en dúo y equipo para mejorar la coordinación y sinergia con tus compañeros. Se adapta a tu forma de jugar.",
  },
  {
    icon: "🏆",
    iconClass: "cardIconAccent",
    glowClass: "glowAccent",
    title: "Elige con seguridad",
    description:
      "Filtra por rango, especialidad y precio para encontrar al coach que encaje contigo sin sorpresas. Elige basándote en valoraciones reales y un sistema de reputación totalmente transparente.",
  },
];

export default function Benefits() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>¿Por qué coaching?</span>
          <h2 className={styles.sectionTitle}>
            Juega como un pro,{" "}
            <span className="gradient-text">con un pro a tu lado</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Recibe un acompañamiento totalmente personalizado diseñado para tus
            necesidades específicas, tus debilidades y tus metas. No es una guía
            genérica; es un plan de entrenamiento hecho a medida para que subas
            de nivel.
          </p>
        </div>

        <div className={styles.grid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={`glass-card ${styles.card}`}>
              <div className={styles.cardGlow + " " + styles[benefit.glowClass]}></div>
              <div className={`${styles.cardIcon} ${styles[benefit.iconClass]}`}>
                {benefit.icon}
              </div>
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardDescription}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
