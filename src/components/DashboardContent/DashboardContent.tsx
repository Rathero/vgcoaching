"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import type { Booking, Coach } from "@/lib/types";
import SessionReview from "@/components/SessionReview/SessionReview";
import GroupInvitePanel from "@/components/GroupInvitePanel/GroupInvitePanel";
import styles from "./DashboardContent.module.css";

interface EnrichedBooking extends Booking {
  coachDisplayName?: string;
  coachAvatar?: string;
}

export default function DashboardContent() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [studentBookings, setStudentBookings] = useState<EnrichedBooking[]>([]);
  const [coachBookings, setCoachBookings] = useState<Booking[]>([]);
  const [coachDoc, setCoachDoc] = useState<Coach | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [now, setNow] = useState(new Date());
  const [reviewedBookings, setReviewedBookings] = useState<Set<string>>(new Set());
  const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string>("");

  // Update clock every 30s for countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      setUserToken(token);
      const res = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudentBookings(data.studentBookings || []);
        setCoachBookings(data.coachBookings || []);
        setCoachDoc(data.coach || null);

        // Check review status for past student bookings
        const pastStudentBookings = (data.studentBookings || []).filter(
          (b: Booking) => b.status === "completed" || b.sessionStatus === "completed"
        );
        const reviewed = new Set<string>();
        await Promise.all(
          pastStudentBookings.map(async (b: Booking) => {
            try {
              const reviewRes = await fetch(`/api/session/review?bookingId=${b.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (reviewRes.ok) {
                const reviewData = await reviewRes.json();
                if (reviewData.review) reviewed.add(b.id);
              }
            } catch { /* ignore */ }
          })
        );
        setReviewedBookings(reviewed);
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

  // Helper: check if a booking's scheduled time is in the past
  const isBookingPast = (b: typeof allBookings[0]) => {
    const scheduled = new Date(`${b.scheduledDate}T${b.scheduledTime}:00`);
    const sessionEnd = new Date(scheduled.getTime() + 60 * 60 * 1000);
    return now > sessionEnd;
  };

  const upcoming = allBookings.filter(b => {
    // Exclude cancelled, completed, and pending (unpaid) bookings
    if (b.status === "cancelled" || b.status === "completed" || b.sessionStatus === "completed") return false;
    if (b.status === "pending") return false;
    // Exclude past confirmed sessions that never happened
    if (b.status === "confirmed" && b.sessionStatus !== "live" && isBookingPast(b)) return false;
    return true;
  }).sort((a, b) => `${a.scheduledDate}T${a.scheduledTime}`.localeCompare(`${b.scheduledDate}T${b.scheduledTime}`));

  const past = allBookings.filter(b => {
    if (b.status === "completed" || b.sessionStatus === "completed") return true;
    // Past confirmed sessions that were never completed => no_show
    if (b.status === "confirmed" && b.sessionStatus !== "live" && isBookingPast(b)) return true;
    return false;
  }).sort((a, b) => `${b.scheduledDate}T${b.scheduledTime}`.localeCompare(`${a.scheduledDate}T${a.scheduledTime}`));

  const canJoin = (booking: typeof allBookings[0]) => {
    // Dev mode: always allow joining for testing
    if (process.env.NODE_ENV === "development") return true;
    // Demo/coach: always allow joining for demos and coach accounts
    if (user?.email === "rath1212@gmail.com" || profile?.role === "coach") return true;
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
    // Past confirmed but not completed => no_show
    if (booking.status === "confirmed" && isBookingPast(booking)) return styles.statusNoShow;
    if (booking.status === "confirmed") return styles.statusConfirmed;
    return styles.statusPending;
  };

  const getStatusLabel = (booking: typeof allBookings[0]) => {
    if (booking.sessionStatus === "live") return "🔴 EN VIVO";
    if (booking.status === "completed" || booking.sessionStatus === "completed") return "Completada";
    // Past confirmed but not completed => no_show
    if (booking.status === "confirmed" && isBookingPast(booking)) return "No asistida";
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
    const isNoShow = booking.status === "confirmed" && booking.sessionStatus !== "live" && isBookingPast(booking);

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
          {booking.isGroupSession && (
            <span className={styles.groupTag}>
              {booking.groupType === "duo" ? "👥 Duo" : "👥 Equipo"}
            </span>
          )}
          {booking.parentBookingId && (
            <span className={styles.invitedTag}>Invitado</span>
          )}
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
          {!isPast && !isNoShow && (
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
              {booking._role === "student" && !reviewedBookings.has(booking.id) && (
                <button
                  className={styles.reviewBtn}
                  onClick={() => setReviewingBookingId(
                    reviewingBookingId === booking.id ? null : booking.id
                  )}
                >
                  ⭐ Valorar
                </button>
              )}
              {booking._role === "student" && reviewedBookings.has(booking.id) && (
                <span className={styles.reviewedBadge}>✓ Valorado</span>
              )}
            </>
          )}
          {isNoShow && (
            <Link href={`/session/${booking.id}/prep`} className={styles.historyBtn}>
              📋 Ver historial
            </Link>
          )}
        </div>

        {/* Inline review form — only for completed, not no-show */}
        {reviewingBookingId === booking.id && booking._role === "student" && isPast && !isNoShow && (
          <div className={styles.reviewSection}>
            <SessionReview
              bookingId={booking.id}
              coachName={(booking as EnrichedBooking).coachDisplayName || "Coach"}
              onReviewSubmitted={() => {
                setReviewedBookings(prev => new Set([...prev, booking.id]));
                setReviewingBookingId(null);
              }}
            />
          </div>
        )}

        {/* Group invite panel — only for the buyer of group sessions */}
        {booking.isGroupSession && !booking.parentBookingId && booking._role === "student" && !isPast && !isNoShow && userToken && (
          <GroupInvitePanel
            booking={booking}
            userToken={userToken}
            onUpdate={fetchData}
          />
        )}
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
          <div className={styles.headerActions}>
            {profile && profile.role !== "coach" && profile.coachApplicationStatus !== "pending" && (
              <Link href="/become-coach" className={styles.becomeCoachBtn}>
                🏆 Ser Coach
              </Link>
            )}
            {profile && (
              <span className={`${styles.roleTag} ${profile.role === "coach" ? styles.roleCoach : styles.roleClient}`}>
                {profile.role === "coach" ? "👨‍🏫 Coach" : "🎓 Jugador"}
              </span>
            )}
            <button className={styles.logoutBtn} onClick={signOut}>
              Cerrar sesión
            </button>
          </div>
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

        {/* Connections Section — only show when at least one integration is configured */}
        {(() => {
          const riotConfigured = !!process.env.NEXT_PUBLIC_RIOT_CONFIGURED;
          const discordConfigured = !!process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID && process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID !== "your-discord-client-id";
          const isCoach = profile?.role === "coach";
          if (!riotConfigured && !discordConfigured && !isCoach) return null;
          return (
            <div className={styles.connectionsSection}>
              <h2 className={styles.connectionsTitle}>🔗 Conexiones</h2>
              <div className={styles.connectionsGrid}>
                {/* Riot Games */}
                {riotConfigured && (
                  <div className={`glass-card ${styles.connectionCard}`}>
                    <div className={styles.connectionHeader}>
                      <span className={styles.connectionIcon}>⚔️</span>
                      <div>
                        <strong>Riot Games</strong>
                        <span className={styles.connectionDesc}>
                          {profile?.riotGameName
                            ? `${profile.riotGameName}#${profile.riotTagLine}`
                            : "Conecta tu cuenta de LoL"}
                        </span>
                      </div>
                    </div>
                    {profile?.riotGameName ? (
                      <div className={styles.connectionConnected}>
                        <span className={styles.connectedBadge}>✅ Conectado</span>
                        {profile.riotRank && <span className={styles.riotRank}>{profile.riotRank}</span>}
                        {profile.riotWinRate ? <span className={styles.riotWr}>{profile.riotWinRate}% WR</span> : null}
                      </div>
                    ) : (
                      <button
                        className={styles.connectBtn}
                        onClick={async () => {
                          const gameName = prompt("Introduce tu Riot ID (ej: Player):");
                          const tagLine = prompt("Introduce tu tagline (ej: EUW):");
                          if (!gameName || !tagLine || !user) return;
                          try {
                            const token = await user.getIdToken();
                            const res = await fetch("/api/riot/link", {
                              method: "POST",
                              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ gameName, tagLine, region: "euw" }),
                            });
                            const data = await res.json();
                            if (res.ok) {
                              alert(`✅ Cuenta vinculada: ${data.data.gameName}#${data.data.tagLine} — ${data.data.rank}`);
                              window.location.reload();
                            } else {
                              alert(`❌ ${data.error}`);
                            }
                          } catch { alert("Error de conexión"); }
                        }}
                      >
                        Conectar
                      </button>
                    )}
                  </div>
                )}

                {/* Email for booking notifications — coach only */}
                {profile?.role === "coach" && (
                  <div className={`glass-card ${styles.connectionCard}`}>
                    <div className={styles.connectionHeader}>
                      <span className={styles.connectionIcon}>📧</span>
                      <div>
                        <strong>Email de notificaciones</strong>
                        <span className={styles.connectionDesc}>
                          {coachDoc?.notificationEmail
                            ? `Recibes reservas en ${coachDoc.notificationEmail}`
                            : "Configura dónde recibir tus reservas"}
                        </span>
                      </div>
                    </div>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!user) return;
                        const fd = new FormData(e.currentTarget);
                        const email = String(fd.get("notificationEmail") || "").trim();
                        try {
                          const token = await user.getIdToken();
                          const res = await fetch("/api/coach/notifications", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ notificationEmail: email }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setCoachDoc(coachDoc ? { ...coachDoc, notificationEmail: data.notificationEmail || undefined } : null);
                            alert("✅ Email guardado");
                          } else {
                            alert(`❌ ${data.error}`);
                          }
                        } catch { alert("Error de conexión"); }
                      }}
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginTop: "8px" }}
                    >
                      <input
                        name="notificationEmail"
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        defaultValue={coachDoc?.notificationEmail || ""}
                        style={{
                          flex: "1 1 200px",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid rgba(255,255,255,0.15)",
                          background: "rgba(0,0,0,0.25)",
                          color: "inherit",
                        }}
                      />
                      <button className={styles.connectBtn} type="submit">Guardar</button>
                      {coachDoc?.notificationEmail && (
                        <button
                          type="button"
                          className={styles.connectBtn}
                          style={{ background: "rgba(255,0,0,0.2)" }}
                          onClick={async () => {
                            if (!user) return;
                            if (!confirm("¿Quitar email de notificaciones?")) return;
                            try {
                              const token = await user.getIdToken();
                              const res = await fetch("/api/coach/notifications", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ target: "email" }),
                              });
                              if (res.ok) {
                                setCoachDoc(coachDoc ? { ...coachDoc, notificationEmail: undefined } : null);
                              }
                            } catch { /* ignore */ }
                          }}
                        >
                          Quitar
                        </button>
                      )}
                    </form>
                  </div>
                )}

                {/* Discord webhook for booking notifications — coach only */}
                {discordConfigured && profile?.role === "coach" && (() => {
                  const webhookRedirect = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_REDIRECT_URI || "";
                  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "";
                  const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(webhookRedirect)}&response_type=code&scope=webhook.incoming&state=${user?.uid || ""}`;
                  const isConnected = !!coachDoc?.notificationDiscordWebhookUrl;
                  return (
                    <div className={`glass-card ${styles.connectionCard}`}>
                      <div className={styles.connectionHeader}>
                        <span className={styles.connectionIcon} style={{ color: "#5865F2" }}>🔔</span>
                        <div>
                          <strong>Notificaciones Discord</strong>
                          <span className={styles.connectionDesc}>
                            {isConnected
                              ? `Webhook activo${coachDoc?.notificationDiscordWebhookName ? ` · ${coachDoc.notificationDiscordWebhookName}` : ""}`
                              : "Recibe tus reservas en un canal de Discord"}
                          </span>
                        </div>
                      </div>
                      {isConnected ? (
                        <div className={styles.connectionConnected}>
                          <span className={styles.connectedBadge}>✅ Conectado</span>
                          <a className={styles.connectBtn} href={oauthUrl}>Cambiar canal</a>
                        </div>
                      ) : (
                        <a className={styles.connectBtn} href={oauthUrl}>Conectar</a>
                      )}
                    </div>
                  );
                })()}

                {/* Discord */}
                {discordConfigured && (
                  <div className={`glass-card ${styles.connectionCard}`}>
                    <div className={styles.connectionHeader}>
                      <span className={styles.connectionIcon} style={{ color: "#5865F2" }}>🎮</span>
                      <div>
                        <strong>Discord</strong>
                        <span className={styles.connectionDesc}>
                          {profile?.discordUsername || "Conecta tu cuenta de Discord"}
                        </span>
                      </div>
                    </div>
                    {profile?.discordUsername ? (
                      <span className={styles.connectedBadge}>✅ {profile.discordUsername}</span>
                    ) : (
                      <a
                        className={styles.connectBtn}
                        href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || ""}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || "")}&response_type=code&scope=identify&state=${user?.uid || ""}`}
                      >
                        Conectar
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
