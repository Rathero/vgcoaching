import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>🎮</div>
              <div className={styles.logoText}>
                Games<span>Coaching</span>
              </div>
            </div>
            <p className={styles.brandDescription}>
              La plataforma de coaching gaming donde los mejores jugadores
              profesionales te ayudan a alcanzar tu verdadero potencial
              competitivo.
            </p>
            <div className={styles.socials}>
              <a
                href="https://x.com/dargog_oficial"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="X (Twitter)"
              >
                𝕏
              </a>
              <a
                href="https://www.instagram.com/dargog_oficial/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="mailto:info.dargog@gmail.com"
                className={styles.socialLink}
                aria-label="Email"
              >
                ✉️
              </a>
            </div>
          </div>

          {/* Juegos */}
          <div className={styles.column}>
            <h4>Juegos</h4>
            <ul>
              <li>
                <a href="/games/league-of-legends">League of Legends</a>
              </li>
              <li>
                <a href="/games/valorant">Valorant (pronto)</a>
              </li>
              <li>
                <a href="/games/teamfight-tactics">TFT (pronto)</a>
              </li>
              <li>
                <a href="/games">Ver todos</a>
              </li>
            </ul>
          </div>

          {/* Plataforma */}
          <div className={styles.column}>
            <h4>Plataforma</h4>
            <ul>
              <li>
                <a href="/#como-funciona">Cómo funciona</a>
              </li>
              <li>
                <a href="/games">Coaches</a>
              </li>
              <li>
                <a href="/become-coach">Hazte coach</a>
              </li>
              <li>
                <a href="/masterclass">Masterclass</a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className={styles.column}>
            <h4>Contacto</h4>
            <ul>
              <li>
                <a href="mailto:info.dargog@gmail.com">info.dargog@gmail.com</a>
              </li>
              <li>
                <a href="https://www.instagram.com/dargog_oficial/" target="_blank" rel="noopener noreferrer">Instagram</a>
              </li>
              <li>
                <a href="https://x.com/dargog_oficial" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} GamesCoaching. Todos los derechos reservados.</p>
          <div className={styles.bottomLinks}>
            <a href="#">Términos de servicio</a>
            <a href="#">Política de privacidad</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
