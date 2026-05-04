"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CoachingOption } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import styles from "./BookingSidebar.module.css";

interface Props {
  options: CoachingOption[];
  coachSlug: string;
  gameSlug: string;
  commissionRate?: number;
}

const TYPE_ICONS: Record<string, string> = {
  live_coaching: "🎬",
  vod_review: "📹",
  duo_coaching: "🤝",
  champion_specific: "⚔️",
  group_coaching: "👥",
};

export default function BookingSidebar({ options, coachSlug, gameSlug, commissionRate = 0.05 }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  const handleBook = () => {
    if (!selectedId) return;
    router.push(`/games/${gameSlug}/coach/${coachSlug}/book?option=${selectedId}`);
  };

  const selectedOption = options.find(o => o.id === selectedId);

  return (
    <div className={styles.sidebarWrap}>
      <div className={`glass-card ${styles.bookingCard}`}>
        <h3 className={styles.bookingTitle}>Reservar sesión</h3>
        <div className={styles.optionList}>
          {options.map(opt => {
            return (
              <div
                key={opt.id}
                className={`${styles.optionCard} ${selectedId === opt.id ? styles.optionCardActive : ""}`}
                onClick={() => setSelectedId(opt.id)}
              >
                <div className={styles.optionHeader}>
                  <div className={styles.optionName}>
                    {TYPE_ICONS[opt.type] || "🎮"} {opt.name}
                  </div>
                  {opt.type === "group_coaching" && (
                    <span className={styles.groupBadge}>
                      {(opt.maxPlayers || 5) <= 2 ? "👥 Duo" : "👥 Equipo"}
                    </span>
                  )}
                </div>
                <div className={styles.optionDesc}>{opt.description}</div>
                <div className={styles.optionMeta}>
                  <span className={styles.optionDuration}>⏱ {opt.durationMinutes} min</span>
                  <span className={styles.optionPrice}>{formatPrice(opt.priceCents)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price breakdown when selected */}
        {selectedOption && commissionRate > 0 && (
          <div className={styles.priceBreakdown}>
            <div className={styles.breakdownRow}>
              <span>Precio del coach</span>
              <span>{formatPrice(selectedOption.priceCents)}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span>Comisión plataforma ({(commissionRate * 100).toFixed(0)}%)</span>
              <span>{formatPrice(Math.round(selectedOption.priceCents * commissionRate))}</span>
            </div>
            <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
              <span>Total</span>
              <span>{formatPrice(Math.round(selectedOption.priceCents * (1 + commissionRate)))}</span>
            </div>
          </div>
        )}

        <button className={styles.bookBtn} disabled={!selectedId} onClick={handleBook}>
          {selectedId ? "Continuar con la reserva →" : "Selecciona una opción"}
        </button>
      </div>
    </div>
  );
}
