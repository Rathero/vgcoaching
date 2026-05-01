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
}

export default function BookingSidebar({ options, coachSlug, gameSlug }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  const handleBook = () => {
    if (!selectedId) return;
    router.push(`/games/${gameSlug}/coach/${coachSlug}/book?option=${selectedId}`);
  };

  return (
    <div className={styles.sidebarWrap}>
      <div className={`glass-card ${styles.bookingCard}`}>
        <h3 className={styles.bookingTitle}>Reservar sesión</h3>
        <div className={styles.optionList}>
          {options.map(opt => (
            <div
              key={opt.id}
              className={`${styles.optionCard} ${selectedId === opt.id ? styles.optionCardActive : ""}`}
              onClick={() => setSelectedId(opt.id)}
            >
              <div className={styles.optionName}>{opt.name}</div>
              <div className={styles.optionDesc}>{opt.description}</div>
              <div className={styles.optionMeta}>
                <span className={styles.optionDuration}>⏱ {opt.durationMinutes} min</span>
                <span className={styles.optionPrice}>{formatPrice(opt.priceCents)}</span>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.bookBtn} disabled={!selectedId} onClick={handleBook}>
          {selectedId ? "Continuar con la reserva →" : "Selecciona una opción"}
        </button>
      </div>
    </div>
  );
}
