import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import BookingSidebar from "@/components/BookingSidebar/BookingSidebar";
import { getGame, getCoach, getCoachGame, getCoachOptions, getCoachReviews, rankColors } from "@/lib/firestore";
import styles from "./page.module.css";

export default async function CoachProfilePage(props: PageProps<"/games/[slug]/coach/[coachSlug]">) {
  const { slug, coachSlug } = await props.params;
  const game = await getGame(slug);
  if (!game) notFound();
  const coach = await getCoach(coachSlug);
  if (!coach) notFound();
  const gameData = await getCoachGame(coach.id, game.id);
  if (!gameData) notFound();

  const options = await getCoachOptions(coach.id);
  const reviews = await getCoachReviews(coach.id);
  const rankColor = rankColors[gameData.rankTier];

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <Link href={`/games/${slug}`} className={styles.back}>← Volver a coaches</Link>

          <div className={styles.layout}>
            <div>
              <div className={styles.profileHeader}>
                <div className={styles.avatar}>{coach.avatar}</div>
                <div>
                  <div className={styles.nameRow}>
                    <h1 className={styles.name}>{coach.displayName}</h1>
                    <span className={styles.flag}>{coach.countryFlag}</span>
                    {coach.verified && <span className={styles.verifiedBig}>✓</span>}
                  </div>
                  <div className={styles.metaRow}>
                    <span className={styles.rankBig} style={{ background: `${rankColor}15`, color: rankColor, border: `1px solid ${rankColor}40` }}>
                      👑 {gameData.rank}
                    </span>
                    <span className={styles.ratingBig}>⭐ {coach.ratingAvg}</span>
                    <span className={styles.stat}><span className={styles.statValue}>{coach.totalSessions}</span> sesiones</span>
                    <span className={styles.stat}><span className={styles.statValue}>{coach.totalStudents}</span> alumnos</span>
                    <span className={styles.stat}><span className={styles.statValue}>{coach.eloUpRate}%</span> suben de elo</span>
                  </div>
                  <div className={styles.languages}>
                    {coach.languages.map(l => <span key={l} className={styles.langTag}>🗣️ {l}</span>)}
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>📖 Sobre mí</h2>
                <p className={styles.bio}>{coach.longBio}</p>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>🎮 Líneas</h2>
                <div className={styles.rolesGrid}>
                  {gameData.roles.map(r => <span key={r.id} className={styles.roleChip}>{r.icon} {r.name}</span>)}
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>🎯 Especialidades</h2>
                <div className={styles.specGrid}>
                  {gameData.specialties.map(s => <span key={s} className={styles.specChip}>{s}</span>)}
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>⚔️ Campeones</h2>
                <div className={styles.champGrid}>
                  {gameData.champions.map(c => <span key={c} className={styles.champChip}>{c}</span>)}
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>💬 Opiniones ({reviews.length})</h2>
                {reviews.map(r => (
                  <div key={r.id} className={`glass-card ${styles.reviewCard}`}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewAvatar}>{r.studentAvatar}</div>
                      <div style={{ flex: 1 }}>
                        <div className={styles.reviewName}>{r.studentName}</div>
                        <div className={styles.reviewMeta}>{r.sessionsCount} sesiones · {r.createdAt}</div>
                      </div>
                      <span className={styles.reviewStars}>{"⭐".repeat(r.rating)}</span>
                    </div>
                    <p className={styles.reviewText}>&ldquo;{r.comment}&rdquo;</p>
                    <div className={styles.reviewRank}>
                      <span className={styles.rankFrom}>{r.rankBefore}</span>
                      <span className={styles.rankArrow}>→</span>
                      <span className={styles.rankTo}>{r.rankAfter}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <BookingSidebar options={options} coachSlug={coachSlug} gameSlug={slug} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
