import styles from "./Testimonials.module.css";

const testimonials = [
  {
    text: "De Oro IV a Platino I en 3 semanas. Mi coach me hizo ver errores de positioning que ni sabía que cometía. Cada partida ahora se siente diferente.",
    name: "Carlos M.",
    avatar: "👨‍💻",
    meta: "Mid main · 3 sesiones",
    rankFrom: "Oro IV",
    rankTo: "Platino I",
  },
  {
    text: "Llevaba 2 años estancado en Plata. En 5 sesiones de jungle pathing con JungleKing77 subí a Oro III. Lo mejor es que ahora entiendo POR QUÉ hago lo que hago.",
    name: "Lucía R.",
    avatar: "👩‍🎮",
    meta: "Jungle main · 5 sesiones",
    rankFrom: "Plata II",
    rankTo: "Oro III",
  },
  {
    text: "No es solo mejorar mecánicamente. Mi coach me enseñó a leer el mapa, a trackear al jungler enemigo y a tomar decisiones macro. El elo vino solo.",
    name: "Andrés P.",
    avatar: "🧑‍💻",
    meta: "Top main · 8 sesiones",
    rankFrom: "Platino IV",
    rankTo: "Esmeralda II",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section} id="testimonios">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Testimonios reales</span>
          <h2 className={styles.sectionTitle}>
            No lo decimos nosotros,{" "}
            <span className="gradient-text">lo dicen ellos</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <div key={i} className={`glass-card ${styles.card}`}>
              <span className={styles.quote}>&ldquo;</span>
              <p className={styles.text}>{t.text}</p>
              <div className={styles.author}>
                <div className={styles.authorAvatar}>{t.avatar}</div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{t.name}</div>
                  <div className={styles.authorMeta}>{t.meta}</div>
                </div>
                <div className={styles.rankChange}>
                  <span className={styles.rankFrom}>{t.rankFrom}</span>
                  <span className={styles.rankArrow}>↑</span>
                  <span className={styles.rankTo}>{t.rankTo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
