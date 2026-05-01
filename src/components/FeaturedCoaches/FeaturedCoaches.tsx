import styles from "./FeaturedCoaches.module.css";

const coaches = [
  {
    name: "DarkMaster",
    flag: "🇪🇸",
    avatar: "🧙‍♂️",
    rank: "Challenger",
    rankClass: "rankChallenger",
    rating: "4.9",
    sessions: 342,
    roles: [
      { icon: "⚔️", name: "Mid" },
      { icon: "🏹", name: "ADC" },
    ],
    specialties: ["Macro", "Wave Management", "Trading"],
    price: "35€",
    online: true,
    verified: true,
    bannerGradient: "linear-gradient(135deg, #1a1040 0%, #0d1b2a 100%)",
  },
  {
    name: "ValkyrieSup",
    flag: "🇦🇷",
    avatar: "🛡️",
    rank: "Grandmaster",
    rankClass: "rankGrandmaster",
    rating: "4.8",
    sessions: 218,
    roles: [
      { icon: "🛡️", name: "Support" },
    ],
    specialties: ["Visión", "Roaming", "Engage Timing"],
    price: "25€",
    online: false,
    verified: true,
    bannerGradient: "linear-gradient(135deg, #2a0a1e 0%, #0d1b2a 100%)",
  },
  {
    name: "JungleKing77",
    flag: "🇲🇽",
    avatar: "🐺",
    rank: "Challenger",
    rankClass: "rankChallenger",
    rating: "5.0",
    sessions: 156,
    roles: [
      { icon: "🌲", name: "Jungle" },
    ],
    specialties: ["Pathing", "Ganking", "Objetivos"],
    price: "40€",
    online: true,
    verified: true,
    bannerGradient: "linear-gradient(135deg, #0a2a1a 0%, #0d1b2a 100%)",
  },
];

export default function FeaturedCoaches() {
  return (
    <section className={styles.section} id="coaches">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Coaches destacados</span>
          <h2 className={styles.sectionTitle}>
            Los mejores, <span className="gradient-text">a tu alcance</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Ex-profesionales y jugadores de élite listos para ayudarte a
            alcanzar tu verdadero potencial.
          </p>
        </div>

        <div className={styles.grid}>
          {coaches.map((coach) => (
            <div key={coach.name} className={`glass-card ${styles.card}`}>
              {/* Banner */}
              <div className={styles.cardHeader}>
                <div
                  className={styles.cardBanner}
                  style={{ background: coach.bannerGradient }}
                />
                <div className={styles.cardBannerOverlay} />
                <div className={styles.cardAvatar}>{coach.avatar}</div>
                {coach.online && <div className={styles.onlineBadge} />}
              </div>

              {/* Body */}
              <div className={styles.cardBody}>
                <div className={styles.cardNameRow}>
                  <span className={styles.cardName}>{coach.name}</span>
                  <span className={styles.cardFlag}>{coach.flag}</span>
                  {coach.verified && (
                    <span className={styles.verifiedBadge}>✓</span>
                  )}
                </div>

                <div className={styles.cardMeta}>
                  <span className={`${styles.rankBadge} ${styles[coach.rankClass]}`}>
                    👑 {coach.rank}
                  </span>
                  <span className={styles.rating}>⭐ {coach.rating}</span>
                  <span className={styles.sessions}>
                    {coach.sessions} sesiones
                  </span>
                </div>

                <div className={styles.cardRoles}>
                  {coach.roles.map((role) => (
                    <span key={role.name} className={styles.roleTag}>
                      {role.icon} {role.name}
                    </span>
                  ))}
                </div>

                <div className={styles.cardSpecialties}>
                  {coach.specialties.map((spec) => (
                    <span key={spec} className={styles.specialtyTag}>
                      {spec}
                    </span>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <div>
                    <span className={styles.price}>{coach.price}</span>
                    <span className={styles.priceLabel}> /sesión</span>
                  </div>
                  <button className={styles.cardBtn}>Ver perfil</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ctaRow}>
          <a href="/games" className="btn btn-secondary">
            Ver todos los coaches →
          </a>
        </div>
      </div>
    </section>
  );
}
