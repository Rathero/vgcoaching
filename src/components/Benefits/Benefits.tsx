import styles from "./Benefits.module.css";

const benefits = [
  {
    icon: "🎯",
    iconClass: "cardIconPrimary",
    glowClass: "glowPrimary",
    title: "Aprende lo que YouTube no te enseña",
    description:
      "Feedback personalizado en tiempo real sobre TUS partidas, TUS errores y TUS hábitos. No guías genéricas — coaching hecho a medida para ti.",
  },
  {
    icon: "📈",
    iconClass: "cardIconSecondary",
    glowClass: "glowSecondary",
    title: "Resultados desde la primera sesión",
    description:
      "Nuestros alumnos suben una media de 2 divisiones en el primer mes. Porque no se trata de jugar más, sino de jugar mejor.",
  },
  {
    icon: "🏆",
    iconClass: "cardIconAccent",
    glowClass: "glowAccent",
    title: "Coaches que han competido al más alto nivel",
    description:
      "Ex-profesionales de LEC, LCS y competiciones internacionales. No solo saben jugar — saben enseñar.",
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
            Cada partida puede ser una lección o una frustración. Elige aprender
            con alguien que ya pasó por donde tú estás.
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
