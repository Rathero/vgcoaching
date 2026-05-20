"use client";

import Link from "next/link";
import type { UserBundle } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import styles from "./UserBundlesList.module.css";

export interface EnrichedUserBundle extends UserBundle {
  coachName?: string;
  coachSlug?: string;
  optionName?: string;
  gameSlug?: string;
}

interface Props {
  bundles: EnrichedUserBundle[];
}

export default function UserBundlesList({ bundles }: Props) {
  if (bundles.length === 0) return null;

  return (
    <div className={styles.grid}>
      {bundles.map(b => {
        const pct = b.totalSessions > 0 ? (b.remainingSessions / b.totalSessions) * 100 : 0;
        const depleted = b.remainingSessions <= 0;
        return (
          <div key={b.id} className={`glass-card ${styles.card}`}>
            <div className={styles.header}>
              <div>
                <div className={styles.title}>{b.optionName || "Bono de coaching"}</div>
                <div className={styles.subtitle}>con {b.coachName || "Coach"}</div>
              </div>
              <span className={depleted ? styles.depletedBadge : styles.activeBadge}>
                {depleted ? "Agotado" : "Activo"}
              </span>
            </div>
            <div className={styles.counter}>
              <span className={styles.counterBig}>{b.remainingSessions}</span>
              <span className={styles.counterSmall}> / {b.totalSessions} sesiones</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>
            <div className={styles.meta}>
              <span>Pagado: {formatPrice(b.pricePaidCents)}</span>
              <span>{new Date(b.purchasedAt).toLocaleDateString("es-ES")}</span>
            </div>
            {!depleted && b.coachSlug && (
              <Link
                href={`/games/${b.gameSlug || "league-of-legends"}/coach/${b.coachSlug}/book?option=${b.coachingOptionId}&bundle=${b.id}`}
                className={styles.bookBtn}
              >
                Reservar sesión →
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
