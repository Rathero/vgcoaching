import Link from "next/link";
import { getFeaturedCoaches } from "@/lib/firestore";
import { formatPrice, rankColors, rankImages } from "@/lib/utils";
import { FeaturedCoachesHeader, SessionsLabel, PriceLabel, ViewProfileBtn, ViewAllCoachesLink } from "./FeaturedCoachesTexts";
import styles from "./FeaturedCoaches.module.css";

export default async function FeaturedCoaches() {
  let coaches: Awaited<ReturnType<typeof getFeaturedCoaches>> = [];

  try {
    coaches = await getFeaturedCoaches();
  } catch {
    // Firestore might not be configured yet
  }

  // If no verified + listed coaches exist, don't render the section at all
  if (coaches.length === 0) return null;

  return (
    <section className={styles.section} id="coaches">
      <div className={styles.container}>
        <div className={styles.header}>
          <FeaturedCoachesHeader />
        </div>

        <div className={styles.grid}>
          {coaches.map(({ coach, gameData, minPrice }) => {
            const rankStyle = gameData?.rank ? rankColors[gameData.rank] || {} : {};
            return (
              <Link
                key={coach.id}
                href={`/games/${gameData?.gameId ? "league-of-legends" : "league-of-legends"}/coach/${coach.slug}`}
                className={`glass-card ${styles.card}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {/* Banner */}
                <div className={styles.cardHeader}>
                  <div
                    className={styles.cardBanner}
                    style={{ background: "linear-gradient(135deg, #1a1040 0%, #0d1b2a 100%)" }}
                  />
                  <div className={styles.cardBannerOverlay} />
                  {coach.avatar?.startsWith("http") ? (
                    <img
                      src={coach.avatar}
                      alt={coach.displayName}
                      className={styles.cardAvatarImg}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={styles.cardAvatar}>{coach.avatar}</div>
                  )}
                </div>

                {/* Body */}
                <div className={styles.cardBody}>
                  <div className={styles.cardNameRow}>
                    <span className={styles.cardName}>{coach.displayName}</span>
                    <span className={styles.cardFlag}>{coach.countryFlag}</span>
                    {coach.verified && (
                      <span className={styles.verifiedBadge}>✓</span>
                    )}
                  </div>

                  <div className={styles.cardMeta}>
                    {gameData?.rank && (
                      <span className={styles.rankBadge} style={rankStyle}>
                        {rankImages[gameData.rankTier] && (
                          <img src={rankImages[gameData.rankTier]} alt={gameData.rank} className={styles.rankEmblem} />
                        )}
                        {gameData.rank}
                      </span>
                    )}
                    {coach.ratingAvg > 0 && (
                      <span className={styles.rating}>⭐ {coach.ratingAvg}</span>
                    )}
                    {coach.totalSessions > 0 && (
                      <span className={styles.sessions}>
                        <SessionsLabel count={coach.totalSessions} />
                      </span>
                    )}
                  </div>

                  {gameData?.roles && gameData.roles.length > 0 && (
                    <div className={styles.cardRoles}>
                      {gameData.roles.map((role) => (
                        <span key={role.id} className={styles.roleTag}>
                          {role.icon} {role.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {gameData?.specialties && gameData.specialties.length > 0 && (
                    <div className={styles.cardSpecialties}>
                      {gameData.specialties.slice(0, 3).map((spec: string) => (
                        <span key={spec} className={styles.specialtyTag}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles.cardFooter}>
                    <div>
                      <PriceLabel hasPrice={minPrice > 0} formattedPrice={minPrice > 0 ? formatPrice(minPrice) : undefined} />
                    </div>
                    <span className={styles.cardBtn}><ViewProfileBtn /></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className={styles.ctaRow}>
          <ViewAllCoachesLink />
        </div>
      </div>
    </section>
  );
}
