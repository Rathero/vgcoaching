import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { getMasterclasses } from "@/lib/firestore";
import styles from "./page.module.css";

export const metadata = {
  title: "Masterclasses — GamesCoaching",
  description: "Aprende de los mejores pros en sesiones en vivo sobre temas específicos de League of Legends.",
};

export default async function MasterclassPage() {
  let masterclasses: Awaited<ReturnType<typeof getMasterclasses>> = [];
  
  try {
    masterclasses = await getMasterclasses("upcoming");
  } catch {
    // Firestore might not have the collection yet
  }

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.badge}>🎓 Aprende de los mejores</span>
            <h1 className={styles.title}>
              Master<span className={styles.gradient}>classes</span>
            </h1>
            <p className={styles.subtitle}>
              Sesiones en vivo con coaches profesionales sobre temas específicos del juego. 
              Aprende wave management, jungle pathing, macro de equipo y mucho más.
            </p>
          </div>

          {masterclasses.length > 0 ? (
            <div className={styles.grid}>
              {masterclasses.map(mc => (
                <div key={mc.id} className={`glass-card ${styles.card}`}>
                  <div className={styles.cardImage}>
                    {mc.imageUrl ? (
                      <img src={mc.imageUrl} alt={mc.title} />
                    ) : (
                      <div className={styles.cardImagePlaceholder}>
                        <span>🎓</span>
                      </div>
                    )}
                    <span className={styles.cardBadge}>
                      {(mc.priceCents / 100).toFixed(0)}€
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardTags}>
                      {mc.tags?.map(tag => (
                        <span key={tag} className={styles.cardTag}>{tag}</span>
                      ))}
                    </div>
                    <h3 className={styles.cardTitle}>{mc.title}</h3>
                    <p className={styles.cardDesc}>{mc.description}</p>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardCoach}>
                        {mc.coachAvatar} {mc.coachName}
                      </span>
                      <span className={styles.cardDate}>
                        📅 {new Date(mc.scheduledDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })} · {mc.scheduledTime}h
                      </span>
                    </div>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardAttendees}>
                        👥 {mc.currentAttendees}/{mc.maxAttendees} plazas
                      </span>
                      <button className={styles.cardBtn}>Reservar plaza</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Coming soon state */
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonGlow} />
              <div className={styles.comingSoonContent}>
                <div className={styles.comingSoonIcon}>
                  <span>🎓</span>
                </div>
                <h2 className={styles.comingSoonTitle}>Próximamente</h2>
                <p className={styles.comingSoonText}>
                  Estamos preparando masterclasses increíbles con los mejores coaches de la plataforma. 
                  Sesiones en vivo donde podrás aprender temas avanzados como:
                </p>
                <div className={styles.topicGrid}>
                  {[
                    { icon: "🌊", title: "Wave Management Avanzado", desc: "Domina las olas como un pro" },
                    { icon: "🗺️", title: "Macro de Equipo", desc: "Rotaciones y objetivos coordinados" },
                    { icon: "🌲", title: "Jungle Pathing Óptimo", desc: "Rutas eficientes para cada situación" },
                    { icon: "⚔️", title: "Trading en Lane", desc: "Gana todos los intercambios" },
                    { icon: "👁️", title: "Control de Visión", desc: "Wardea como un profesional" },
                    { icon: "🧠", title: "Mentalidad Competitiva", desc: "Gestiona el tilt y mejora tu foco" },
                  ].map((topic, i) => (
                    <div key={i} className={styles.topicCard}>
                      <span className={styles.topicIcon}>{topic.icon}</span>
                      <div>
                        <strong>{topic.title}</strong>
                        <span className={styles.topicDesc}>{topic.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.comingSoonPricing}>
                  <span className={styles.priceBadge}>20€ / masterclass</span>
                  <span className={styles.priceNote}>Plazas limitadas · Sesiones en vivo con chat interactivo</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
