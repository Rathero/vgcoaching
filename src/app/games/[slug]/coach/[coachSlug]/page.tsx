import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import BookingSidebar from "@/components/BookingSidebar/BookingSidebar";
import CoachGallery from "@/components/CoachGallery/CoachGallery";
import { TwitchIcon, InstagramIcon, TwitterIcon, DiscordIcon, YouTubeIcon } from "@/components/SocialIcons/SocialIcons";
import { getGame, getCoach, getCoachGame, getCoachOptions, getCoachReviews, getCommissionRate, rankColors } from "@/lib/firestore";
import { rankImages } from "@/lib/utils";
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

  const displayRating = reviews.length > 0 
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : coach.ratingAvg;

  const rankColor = rankColors[gameData.rankTier];
  const commissionRate = getCommissionRate(coach);

  const hasSocials = coach.twitchUsername || coach.instagramUsername || coach.twitterUsername || coach.discordUsername || coach.youtubeChannel;

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <Link href={`/games/${slug}`} className={styles.back}>← Volver a coaches</Link>

          <div className={`${styles.layout} ${options.length === 0 ? styles.layoutSingle : ''}`}>
            <div>
              <div className={styles.profileHeader}>
                {coach.avatar.startsWith('http') ? (
                  <img src={coach.avatar} alt={coach.displayName} className={styles.avatar} referrerPolicy="no-referrer" />
                ) : (
                  <div className={styles.avatar}>{coach.avatar}</div>
                )}
                <div className={styles.headerInfo}>
                  <div className={styles.nameRow}>
                    <h1 className={styles.name}>{coach.displayName}</h1>
                    <span className={styles.flag}>{coach.countryFlag}</span>
                    {coach.verified && <span className={styles.verifiedBig}>✓</span>}
                  </div>
                  <div className={styles.metaRow}>
                    {reviews.length > 0 && <span className={styles.ratingBig}>⭐ {displayRating}</span>}
                    {(coach.totalSessions > 0 || coach.totalStudents > 0 || coach.eloUpRate > 0) && (
                      <>
                        {coach.totalSessions > 0 && <span className={styles.stat}><span className={styles.statValue}>{coach.totalSessions}</span> sesiones</span>}
                        {coach.totalStudents > 0 && <span className={styles.stat}><span className={styles.statValue}>{coach.totalStudents}</span> alumnos</span>}
                        {coach.eloUpRate > 0 && <span className={styles.stat}><span className={styles.statValue}>{coach.eloUpRate}%</span> suben de elo</span>}
                      </>
                    )}
                  </div>
                  <div className={styles.languages}>
                    {coach.languages.map(l => <span key={l} className={styles.langTag}>🗣️ {l}</span>)}
                    {coach.riotGameName && (
                      <span className={styles.langTag} style={{ background: 'rgba(210,60,60,0.12)', color: '#D23C3C', borderColor: 'rgba(210,60,60,0.3)' }}>
                        ⚔️ {coach.riotGameName}#{coach.riotTagLine}
                      </span>
                    )}
                    {coach.twitchUsername && (
                      <a href={`https://twitch.tv/${coach.twitchUsername}`} target="_blank" rel="noopener noreferrer" className={styles.socialTag} style={{ '--social-color': '#9146FF' } as React.CSSProperties}>
                        <TwitchIcon size={14} /> {coach.twitchUsername}
                      </a>
                    )}
                    {coach.instagramUsername && (
                      <a href={`https://instagram.com/${coach.instagramUsername}`} target="_blank" rel="noopener noreferrer" className={styles.socialTag} style={{ '--social-color': '#E4405F' } as React.CSSProperties}>
                        <InstagramIcon size={14} /> @{coach.instagramUsername}
                      </a>
                    )}
                    {coach.twitterUsername && (
                      <a href={`https://x.com/${coach.twitterUsername}`} target="_blank" rel="noopener noreferrer" className={styles.socialTag} style={{ '--social-color': '#ffffff' } as React.CSSProperties}>
                        <TwitterIcon size={14} /> @{coach.twitterUsername}
                      </a>
                    )}
                    {coach.discordUsername && (
                      <span className={styles.socialTag} style={{ '--social-color': '#5865F2' } as React.CSSProperties}>
                        <DiscordIcon size={14} /> {coach.discordUsername}
                      </span>
                    )}
                    {coach.youtubeChannel && (
                      <a href={`https://youtube.com/channel/${coach.youtubeChannel}`} target="_blank" rel="noopener noreferrer" className={styles.socialTag} style={{ '--social-color': '#FF0000' } as React.CSSProperties}>
                        <YouTubeIcon size={14} /> YouTube
                      </a>
                    )}
                  </div>
                </div>

                {/* Big rank emblem floating right */}
                {rankImages[gameData.rankTier] && (
                  <div className={styles.rankEmblemBig}>
                    <img src={rankImages[gameData.rankTier]} alt={gameData.rank} />
                    <span className={styles.rankEmblemLabel} style={{ color: rankColor }}>{gameData.rank}</span>
                  </div>
                )}
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>📖 Sobre mí</h2>
                <p className={styles.bio}>{coach.longBio}</p>
              </div>

              {coach.galleryImages && coach.galleryImages.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>📸 Galería</h2>
                  <CoachGallery images={coach.galleryImages} />
                </div>
              )}

              {game.slug === 'league-of-legends' && gameData.roles.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>🎮 Líneas</h2>
                <div className={styles.rolesGrid}>
                  {gameData.roles.map(r => <span key={r.id} className={styles.roleChip}>{r.icon} {r.name}</span>)}
                </div>
              </div>
              )}

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>🎯 Especialidades</h2>
                <div className={styles.specGrid}>
                  {gameData.specialties.map(s => <span key={s} className={styles.specChip}>{s}</span>)}
                </div>
              </div>

              {gameData.champions && gameData.champions.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>⚔️ Campeones</h2>
                <div className={styles.champGrid}>
                  {gameData.champions.map(c => <span key={c} className={styles.champChip}>{c}</span>)}
                </div>
              </div>
              )}

              {reviews.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>💬 Opiniones ({reviews.length})</h2>

                {/* Rating summary */}
                  <div className={`glass-card ${styles.ratingSummary}`}>
                    <div className={styles.ratingBigNumber}>
                      <span className={styles.ratingValue}>{displayRating}</span>
                      <span className={styles.ratingMax}>/5</span>
                    </div>
                    <div className={styles.ratingStarsLarge}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={s <= Math.round(displayRating) ? styles.starFilledLg : styles.starEmptyLg}>★</span>
                      ))}
                    </div>
                    <span className={styles.ratingCount}>{reviews.length} valoracion{reviews.length !== 1 ? "es" : ""}</span>
                    <div className={styles.ratingBars}>
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = reviews.filter(r => r.rating === star).length;
                        const pct = (count / reviews.length) * 100;
                        return (
                          <div key={star} className={styles.ratingBarRow}>
                            <span className={styles.ratingBarLabel}>{star}★</span>
                            <div className={styles.ratingBarTrack}>
                              <div className={styles.ratingBarFill} style={{ width: `${pct}%` }} />
                            </div>
                            <span className={styles.ratingBarCount}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                {reviews.map(r => {
                  const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : "";
                  return (
                    <div key={r.id} className={`glass-card ${styles.reviewCard}`}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewAvatar}>{r.studentAvatar || "🎮"}</div>
                        <div style={{ flex: 1 }}>
                          <div className={styles.reviewName}>{r.studentName}</div>
                          <div className={styles.reviewMeta}>
                            {r.sessionsCount ? `${r.sessionsCount} sesiones · ` : ""}{dateStr}
                          </div>
                        </div>
                        <span className={styles.reviewStars}>{"⭐".repeat(r.rating)}</span>
                      </div>
                      {r.comment && <p className={styles.reviewText}>&ldquo;{r.comment}&rdquo;</p>}
                      {r.rankBefore && r.rankAfter && (
                        <div className={styles.reviewRank}>
                          <span className={styles.rankFrom}>{r.rankBefore}</span>
                          <span className={styles.rankArrow}>→</span>
                          <span className={styles.rankTo}>{r.rankAfter}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              )}
            </div>

            {options.length > 0 && <BookingSidebar options={options} coachSlug={coachSlug} gameSlug={slug} commissionRate={commissionRate} />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
