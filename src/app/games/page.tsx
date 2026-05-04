import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { getGames } from "@/lib/firestore";
import { GamesPageHeader, GameCardDesc, GameCardBtn, GameComingSoon } from "./GamesPageTexts";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function GamesPage() {
  const games = await getGames();

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <GamesPageHeader />
          </div>

          <div className={styles.grid}>
            {games.map(game => (
              <div key={game.id} className={styles.cardWrapper}>
                {game.active ? (
                  <Link href={`/games/${game.slug}`} className={`glass-card ${styles.card} ${styles.cardActive}`}>
                    <span className={styles.icon}>{game.icon}</span>
                    <h2 className={styles.gameName}>{game.name}</h2>
                    <p className={styles.gameDesc}><GameCardDesc /></p>
                    <span className={styles.cardBtn}><GameCardBtn /></span>
                  </Link>
                ) : (
                  <div className={`glass-card ${styles.card} ${styles.cardDisabled}`}>
                    <span className={styles.icon}>{game.icon}</span>
                    <h2 className={styles.gameName}>{game.name}</h2>
                    <span className={styles.comingSoon}><GameComingSoon /></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
