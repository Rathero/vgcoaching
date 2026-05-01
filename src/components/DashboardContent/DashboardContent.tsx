"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import type { Booking } from "@/lib/types";
import styles from "./DashboardContent.module.css";

interface EnrichedBooking extends Booking {
  coachDisplayName?: string;
  coachAvatar?: string;
}

export default function DashboardContent() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [studentBookings, setStudentBookings] = useState<EnrichedBooking[]>([]);
  const [coachBookings, setCoachBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [now, setNow] = useState(new Date());

  // Update clock every 30s for countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudentBookings(data.studentBookings || []);
        setCoachBookings(data.coachBookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) fetchData();
  }, [user, loading, router, fetchData]);

  if (loading || loadingData) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        Cargando tu panel...
      </div>
    );
  }

  // Combine and categorize bookings
  const allBookings = [
    ...studentBookings.map(b => ({ ...b, _role: "student" as const })),
    ...coachBookings.map(b => ({ ...b, _role: "coach" as const, coachDisplayName: "Tu sesión" })),
  ];

  const upcoming = allBookings.filter(b =>
    b.status !== "cancelled" && b.status !== "completed" && b.sessionStatus !== "completed"
  ).sort((a, b) => `${a.scheduledDate}T${a.scheduledTime}`.localeCompare(`${b.scheduledDate}T${b.scheduledTime}`));

  const past = allBookings.filter(b =>
    b.status === "completed" || b.sessionStatus === "completed"
  ).sort((a, b) => `${b.scheduledDate}T${b.scheduledTime}`.localeCompare(`${a.scheduledDate}T${a.scheduledTime}`));

  const canJoin = (booking: typeof allBookings[0]) => {
    // Dev mode: always allow joining for testing
    if (process.env.NODE_ENV === "development") return true;
    const scheduled = new Date(`${booking.scheduledDate}T${booking.scheduledTime}:00`);
    const tenMinBefore = new Date(scheduled.getTime() - 10 * 60 * 1000);
    const sessionEnd = new Date(scheduled.getTime() + 60 * 60 * 1000);
    return now >= tenMinBefore && now <= sessionEnd;
  };

  const getCountdown = (booking: typeof allBookings[0]) => {
    const scheduled = new Date(`${booking.scheduledDate}T${booking.scheduledTime}:00`);
    const tenMinBefore = new Date(scheduled.getTime() - 10 * 60 * 1000);
    const diff = tenMinBefore.getTime() - now.getTime();
    if (diff <= 0) return null;

    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `en ${days}d ${hours % 24}h`;
    }
    if (hours > 0) return `en ${hours}h ${mins}m`;
    return `en ${mins}m`;
  };

  const getStatusClass = (booking: typeof allBookings[0]) => {
    if (booking.sessionStatus === "live") return styles.statusLive;
    if (booking.status === "completed" || booking.sessionStatus === "completed") return styles.statusCompleted;
    if (booking.status === "confirmed") return styles.statusConfirmed;
    return styles.statusPending;
  };

  const getStatusLabel = (booking: typeof allBookings[0]) => {
    if (booking.sessionStatus === "live") return "🔴 EN VIVO";
    if (booking.status === "completed" || booking.sessionStatus === "completed") return "Completada";
    if (booking.status === "confirmed") return "Confirmada";
    return "Pendiente";
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
  };

  const renderBookingCard = (booking: typeof allBookings[0], index: number) => {
    const isLive = booking.sessionStatus === "live";
    const joinable = canJoin(booking);
    const countdown = getCountdown(booking);
    const isPast = booking.status === "completed" || booking.sessionStatus === "completed";

    return (
      <div
        key={`${booking.id}-${booking._role}`}
        className={styles.bookingCard}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className={styles.cardHeader}>
          <div className={styles.cardLeft}>
            <div className={styles.coachAvatar}>
              {(booking as EnrichedBooking).coachAvatar ? (
                <img src={(booking as EnrichedBooking).coachAvatar} alt="" />
              ) : (
                "🎮"
              )}
            </div>
            <div className={styles.coachInfo}>
              <h3>
                {booking._role === "coach" ? (
                  <>Sesión con <strong>{booking.studentName}</strong></>
                ) : (
                  (booking as EnrichedBooking).coachDisplayName || "Coach"
                )}
              </h3>
            </div>
          </div>
          <span className={`${styles.statusBadge} ${getStatusClass(booking)}`}>
            {getStatusLabel(booking)}
          </span>
        </div>

        <div className={styles.cardDetails}>
          <div className={styles.detail}>
            <span>📅</span> {formatDate(booking.scheduledDate)}
          </div>
          <div className={styles.detail}>
            <span>🕐</span> {booking.scheduledTime}h
          </div>
          <div className={styles.detail}>
            <span>⏱</span> 60 min
          </div>
          {booking.notes && (
            <div className={styles.detail}>
              <span>📝</span> {booking.notes.substring(0, 50)}{booking.notes.length > 50 ? "..." : ""}
            </div>
          )}
        </div>

        <div className={styles.cardActions}>
          {!isPast && (
            <>
              <Link
                href={joinable ? `/session/${booking.id}` : "#"}
                className={`${styles.joinBtn} ${isLive ? styles.liveJoinBtn : ""}`}
                onClick={e => { if (!joinable) e.preventDefault(); }}
                style={!joinable ? { opacity: 0.4, pointerEvents: "none" } : {}}
              >
                {isLive ? "🔴 Reconectar" : "🎬 Entrar"}
              </Link>
              <Link href={`/session/${booking.id}/prep`} className={styles.prepBtn}>
                📎 Material
              </Link>
              {countdown && (
                <span className={styles.countdown}>Acceso {countdown}</span>
              )}
            </>
          )}
          {isPast && (
            <>
              {booking.recordingUrl && (
                <a href={booking.recordingUrl} target="_blank" rel="noopener noreferrer" className={styles.prepBtn}>
                  🎥 Ver grabación
                </a>
              )}
              <Link href={`/session/${booking.id}/prep`} className={styles.historyBtn}>
                📋 Ver historial
              </Link>
            </>
          )}
        </div>
      </div>
    );
  };

  const currentList = activeTab === "upcoming" ? upcoming : past;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <h1>Mi Panel</h1>
            <p>Gestiona tus sesiones de coaching</p>
          </div>
          {profile && (
            <span className={`${styles.roleTag} ${profile.role === "coach" ? styles.roleCoach : styles.roleClient}`}>
              {profile.role === "coach" ? "👨‍🏫 Coach" : "🎓 Jugador"}
            </span>
          )}
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "upcoming" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            📅 Próximas
            {upcoming.length > 0 && <span className={styles.tabCount}>{upcoming.length}</span>}
          </button>
          <button
            className={`${styles.tab} ${activeTab === "past" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("past")}
          >
            📜 Historial
            {past.length > 0 && <span className={styles.tabCount}>{past.length}</span>}
          </button>
        </div>

        {currentList.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              {activeTab === "upcoming" ? "📅" : "📜"}
            </div>
            <p>
              {activeTab === "upcoming"
                ? "No tienes sesiones próximas. ¡Reserva una con tu coach favorito!"
                : "Aún no tienes sesiones completadas."
              }
            </p>
            {activeTab === "upcoming" && (
              <Link href="/games" className="btn btn-primary" style={{ marginTop: "var(--space-lg)", display: "inline-flex" }}>
                Encontrar coach
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.bookingsList}>
            {currentList.map((b, i) => renderBookingCard(b, i))}
          </div>
        )}
      </div>
    </div>
  );
}
