"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Coach, CoachGame } from "@/lib/types";
import { rankColors, formatPrice } from "@/lib/utils";
import styles from "./CoachFilters.module.css";

const ranks = ["Challenger", "Grandmaster", "Master", "Diamond"];

const allRoles = [
  { id: "top", name: "Top", icon: "🗡️" },
  { id: "jungle", name: "Jungle", icon: "🌲" },
  { id: "mid", name: "Mid", icon: "⚔️" },
  { id: "adc", name: "ADC", icon: "🏹" },
  { id: "support", name: "Support", icon: "🛡️" },
];

interface Props {
  coaches: { coach: Coach; gameData: CoachGame; minPrice: number }[];
  gameSlug: string;
}

export default function CoachFilters({ coaches, gameSlug }: Props) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("rating");

  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    coaches.forEach(({ gameData }) => gameData.specialties.forEach(s => set.add(s)));
    return Array.from(set);
  }, [coaches]);

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const filtered = useMemo(() => {
    let result = [...coaches];
    if (selectedRoles.length > 0) result = result.filter(({ gameData }) => gameData.roles.some(r => selectedRoles.includes(r.id)));
    if (selectedRanks.length > 0) result = result.filter(({ gameData }) => selectedRanks.includes(gameData.rank));
    if (selectedSpecialties.length > 0) result = result.filter(({ gameData }) => gameData.specialties.some(s => selectedSpecialties.includes(s)));
    result.sort((a, b) => {
      if (sortBy === "rating") return b.coach.ratingAvg - a.coach.ratingAvg;
      if (sortBy === "sessions") return b.coach.totalSessions - a.coach.totalSessions;
      if (sortBy === "price_asc") return a.minPrice - b.minPrice;
      if (sortBy === "price_desc") return b.minPrice - a.minPrice;
      return 0;
    });
    return result;
  }, [coaches, selectedRoles, selectedRanks, selectedSpecialties, sortBy]);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Línea / Rol</div>
          <div className={styles.filterOptions}>
            {allRoles.map(r => (
              <button key={r.id} className={`${styles.filterBtn} ${selectedRoles.includes(r.id) ? styles.filterBtnActive : ""}`} onClick={() => toggleFilter(selectedRoles, r.id, setSelectedRoles)}>
                {r.icon} {r.name}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Rango</div>
          <div className={styles.filterOptions}>
            {ranks.map(r => (
              <button key={r} className={`${styles.filterBtn} ${selectedRanks.includes(r) ? styles.filterBtnActive : ""}`} onClick={() => toggleFilter(selectedRanks, r, setSelectedRanks)}>
                👑 {r}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Especialidad</div>
          <div className={styles.filterOptions}>
            {allSpecialties.map(s => (
              <button key={s} className={`${styles.filterBtn} ${selectedSpecialties.includes(s) ? styles.filterBtnActive : ""}`} onClick={() => toggleFilter(selectedSpecialties, s, setSelectedSpecialties)}>
                {s}
              </button>
            ))}
          </div>
        </div>
        {(selectedRoles.length > 0 || selectedRanks.length > 0 || selectedSpecialties.length > 0) && (
          <button className={styles.clearBtn} onClick={() => { setSelectedRoles([]); setSelectedRanks([]); setSelectedSpecialties([]); }}>
            Limpiar filtros
          </button>
        )}
      </aside>

      <div>
        <div className={styles.sortBar}>
          <span className={styles.resultCount}>{filtered.length} coach{filtered.length !== 1 ? "es" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</span>
          <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="rating">Mejor valorados</option>
            <option value="sessions">Más sesiones</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.noResults}>
            <p style={{ fontSize: "2rem", marginBottom: "8px" }}>🔍</p>
            <p>No hay coaches con esos filtros. Prueba con otros criterios.</p>
          </div>
        ) : (
          <div className={styles.coachGrid}>
            {filtered.map(({ coach, gameData, minPrice }) => {
              const rankColor = rankColors[gameData.rankTier];
              return (
                <Link key={coach.id} href={`/games/${gameSlug}/coach/${coach.slug}`} className={`glass-card ${styles.card}`}>
                  <div className={styles.cardTop}>
                    {coach.avatar.startsWith('http') ? (
                      <img src={coach.avatar} alt={coach.displayName} className={styles.cardAvatar} referrerPolicy="no-referrer" />
                    ) : (
                      <div className={styles.cardAvatar}>{coach.avatar}</div>
                    )}
                    <div className={styles.cardInfo}>
                      <div className={styles.cardNameRow}>
                        <span className={styles.cardName}>{coach.displayName}</span>
                        <span className={styles.cardFlag}>{coach.countryFlag}</span>
                        {coach.verified && <span className={styles.verified}>✓</span>}
                      </div>
                      <div className={styles.cardMeta}>
                        <span className={styles.rankBadge} style={{ background: `${rankColor}15`, color: rankColor, border: `1px solid ${rankColor}40` }}>
                          👑 {gameData.rank}
                        </span>
                        {coach.ratingAvg > 0 && <span className={styles.rating}>⭐ {coach.ratingAvg}</span>}
                        {coach.totalSessions > 0 && <span>{coach.totalSessions} sesiones</span>}
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardBio}>{coach.bio}</p>
                    <div className={styles.cardTags}>
                      {gameData.roles.map(r => <span key={r.id} className={`${styles.tag} ${styles.tagRole}`}>{r.icon} {r.name}</span>)}
                      {gameData.specialties.slice(0, 3).map(s => <span key={s} className={styles.tag}>{s}</span>)}
                    </div>
                    <div className={styles.cardFooter}>
                      <div><span className={styles.price}>{formatPrice(minPrice)}</span><span className={styles.priceLabel}> desde</span></div>
                      <span className={styles.cardBtn}>Ver perfil</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
