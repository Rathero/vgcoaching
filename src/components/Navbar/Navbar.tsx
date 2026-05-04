"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./Navbar.module.css";

interface GameItem {
  id: string;
  slug: string;
  name: string;
  icon: string;
  active: boolean;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [gameMenuOpen, setGameMenuOpen] = useState(false);
  const [games, setGames] = useState<GameItem[]>([]);
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Detect current game from URL
  const currentGameSlug = pathname.match(/^\/games\/([^/]+)/)?.[1];
  const currentGame = games.find(g => g.slug === currentGameSlug);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch games from Firestore
  useEffect(() => {
    async function fetchGames() {
      try {
        const q = query(collection(db, "games"), orderBy("sortOrder"));
        const snap = await getDocs(q);
        setGames(snap.docs.map(d => ({ id: d.id, ...d.data() } as GameItem)));
      } catch {
        // Fallback for when Firestore is not configured
        setGames([
          { id: "lol", slug: "league-of-legends", name: "League of Legends", icon: "⚔️", active: true },
          { id: "val", slug: "valorant", name: "Valorant", icon: "🔫", active: false },
          { id: "tft", slug: "teamfight-tactics", name: "TFT", icon: "♟️", active: false },
        ]);
      }
    }
    fetchGames();
  }, []);

  // Close menu on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setGameMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContent}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>🎮</div>
          <div className={styles.logoText}>
            Dar<span>gog</span>
          </div>
        </Link>

        <div className={styles.navLinks}>
          {/* Game Selector Dropdown */}
          <div className={styles.gameSelectorWrap} ref={menuRef}>
            <button
              className={styles.gameSelector}
              onClick={() => setGameMenuOpen(!gameMenuOpen)}
            >
              <span className={styles.gameSelectorIcon}>
                {currentGame ? currentGame.icon : "🎮"}
              </span>
              {currentGame ? currentGame.name : "Coaches"}
              <span className={`${styles.gameSelectorArrow} ${gameMenuOpen ? styles.gameSelectorArrowOpen : ""}`}>▼</span>
            </button>
            {gameMenuOpen && (
              <div className={styles.gameDropdown}>
                {games.map(game => (
                  game.active ? (
                    <Link
                      key={game.id}
                      href={`/games/${game.slug}`}
                      className={`${styles.gameDropdownItem} ${game.slug === currentGameSlug ? styles.gameDropdownItemActive : ""}`}
                      onClick={() => setGameMenuOpen(false)}
                    >
                      <span className={styles.gameDropdownIcon}>{game.icon}</span>
                      <span>{game.name}</span>
                    </Link>
                  ) : (
                    <div key={game.id} className={`${styles.gameDropdownItem} ${styles.gameDropdownItemDisabled}`}>
                      <span className={styles.gameDropdownIcon}>{game.icon}</span>
                      <span>{game.name}</span>
                      <span className={styles.gameDropdownBadge}>Pronto</span>
                    </div>
                  )
                ))}
                <div className={styles.gameDropdownDivider} />
                <Link
                  href="/games"
                  className={styles.gameDropdownItem}
                  onClick={() => setGameMenuOpen(false)}
                >
                  <span className={styles.gameDropdownIcon}>📋</span>
                  <span>Ver todos los juegos</span>
                </Link>
              </div>
            )}
          </div>

          <Link href="/masterclass" className={styles.navLink}>
            Masterclass
          </Link>
          <a href="/#como-funciona" className={styles.navLink}>
            Cómo funciona
          </a>
          <a href="/#testimonios" className={styles.navLink}>
            Testimonios
          </a>
        </div>

        <div className={styles.navActions}>
          {!loading && (
            <>
              {user ? (
                <div className={styles.userMenu}>
                  <Link href="/dashboard" className={styles.userLink}>
                    <span className={styles.userAvatar}>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" width={28} height={28} style={{ borderRadius: "50%" }} />
                      ) : (
                        user.displayName?.[0]?.toUpperCase() || "👤"
                      )}
                    </span>
                    <span className={styles.userName}>{user.displayName || "Mi perfil"}</span>
                  </Link>
                  <button className="btn btn-ghost" onClick={signOut}>Salir</button>
                </div>
              ) : (
                <Link href="/login" className="btn btn-ghost">Iniciar sesión</Link>
              )}
            </>
          )}
          <Link href="/games" className="btn btn-primary">Encuentra tu coach</Link>

          <button className={styles.mobileMenuBtn} aria-label="Abrir menú">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
