"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>🎮</div>
              <div className={styles.logoText}>
                Dar<span>gog</span>
              </div>
            </div>
            <p className={styles.brandDescription}>
              {t("footer", "brandDescription")}
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
            <h4>{t("footer", "games")}</h4>
            <ul>
              <li>
                <a href="/games/league-of-legends">League of Legends</a>
              </li>
              <li>
                <a href="/games/valorant">{t("footer", "valorantSoon")}</a>
              </li>
              <li>
                <a href="/games/teamfight-tactics">{t("footer", "tftSoon")}</a>
              </li>
              <li>
                <a href="/games">{t("footer", "viewAll")}</a>
              </li>
            </ul>
          </div>

          {/* Plataforma */}
          <div className={styles.column}>
            <h4>{t("footer", "platform")}</h4>
            <ul>
              <li>
                <a href="/#como-funciona">{t("footer", "howItWorks")}</a>
              </li>
              <li>
                <a href="/games">{t("footer", "coaches")}</a>
              </li>
              <li>
                <a href="/become-coach">{t("footer", "becomeCoach")}</a>
              </li>
              <li>
                <a href="/masterclass">{t("footer", "masterclass")}</a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className={styles.column}>
            <h4>{t("footer", "contact")}</h4>
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
          <p>© {new Date().getFullYear()} Dargog. {t("footer", "allRights")}</p>
          <div className={styles.bottomLinks}>
            <a href="#">{t("footer", "terms")}</a>
            <a href="#">{t("footer", "privacy")}</a>
            <a href="#">{t("footer", "cookies")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
