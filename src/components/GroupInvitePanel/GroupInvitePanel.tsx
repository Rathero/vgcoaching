"use client";

import { useState } from "react";
import type { Booking, GroupPlayer } from "@/lib/types";
import styles from "./GroupInvitePanel.module.css";

interface Props {
  booking: Booking;
  userToken: string;
  onUpdate?: () => void;
}

export default function GroupInvitePanel({ booking, userToken, onUpdate }: Props) {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maxInvites = (booking.maxPlayers || 5) - 1;
  const currentPlayers = booking.invitedPlayers || [];
  const spotsLeft = maxInvites - currentPlayers.length;

  const handleInvite = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/session/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({
          bookingId: booking.id,
          email: email.trim(),
          displayName: displayName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al invitar");
        return;
      }

      setEmail("");
      setDisplayName("");
      onUpdate?.();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (playerEmail: string) => {
    if (!confirm("¿Eliminar a este jugador de la sesión?")) return;

    try {
      const res = await fetch("/api/session/invite", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({ bookingId: booking.id, email: playerEmail }),
      });

      if (res.ok) {
        onUpdate?.();
      }
    } catch { /* ignore */ }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h4 className={styles.title}>
          {booking.groupType === "duo" ? "👥 Invitar Duo" : "👥 Invitar Equipo"}
        </h4>
        <span className={styles.spotsCount}>
          {spotsLeft > 0
            ? `${spotsLeft} plaza${spotsLeft > 1 ? "s" : ""} libre${spotsLeft > 1 ? "s" : ""}`
            : "Completo ✓"
          }
        </span>
      </div>

      {/* Player slots visualization */}
      <div className={styles.slots}>
        {/* Slot 1 = buyer (always filled) */}
        <div className={`${styles.slot} ${styles.slotFilled} ${styles.slotOwner}`}>
          <span className={styles.slotAvatar}>👑</span>
          <span className={styles.slotName}>Tú</span>
        </div>

        {/* Invited players */}
        {currentPlayers.map((player: GroupPlayer, i: number) => (
          <div key={i} className={`${styles.slot} ${styles.slotFilled} ${player.status === "accepted" ? styles.slotAccepted : styles.slotPending}`}>
            <span className={styles.slotAvatar}>
              {player.status === "accepted" ? "✅" : "⏳"}
            </span>
            <div className={styles.slotInfo}>
              <span className={styles.slotName}>{player.displayName || player.email}</span>
              <span className={styles.slotStatus}>
                {player.status === "accepted" ? "Confirmado" : "Pendiente"}
              </span>
            </div>
            <button
              className={styles.slotRemove}
              onClick={() => handleRemove(player.email)}
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: spotsLeft }).map((_, i) => (
          <div key={`empty-${i}`} className={`${styles.slot} ${styles.slotEmpty}`}>
            <span className={styles.slotAvatar}>+</span>
            <span className={styles.slotName}>Invitar jugador</span>
          </div>
        ))}
      </div>

      {/* Invite form */}
      {spotsLeft > 0 && (
        <div className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formRow}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email del jugador"
              className={styles.input}
            />
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Nombre (opcional)"
              className={`${styles.input} ${styles.inputSmall}`}
            />
            <button
              className={styles.inviteBtn}
              onClick={handleInvite}
              disabled={loading || !email.trim()}
            >
              {loading ? "..." : "Invitar"}
            </button>
          </div>
          <p className={styles.hint}>
            Si el jugador ya tiene cuenta, aparecerá en su panel automáticamente. Si no, le aparecerá cuando se registre.
          </p>
        </div>
      )}
    </div>
  );
}
