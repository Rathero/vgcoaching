"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { useAuth } from "@/lib/auth-context";
import SessionTimer from "@/components/SessionTimer/SessionTimer";
import SessionChat from "@/components/SessionChat/SessionChat";
import SessionMaterials from "@/components/SessionMaterials/SessionMaterials";
import styles from "./page.module.css";

interface SessionData {
  token: string;
  room: string;
  serverUrl: string;
  isCoach: boolean;
  booking: {
    id: string;
    coachId: string;
    studentName: string;
    scheduledDate: string;
    scheduledTime: string;
    sessionStatus: string;
  };
}

export default function SessionPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waitMinutes, setWaitMinutes] = useState<number | null>(null);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "materials">("chat");
  const [sessionEnded, setSessionEnded] = useState(false);
  const [idToken, setIdToken] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<string>("none");

  const fetchToken = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      setIdToken(token);

      const res = await fetch("/api/session/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "TOO_EARLY") {
          setWaitMinutes(data.minutesUntil);
          setLoading(false);
          return;
        }
        if (data.error === "SESSION_ENDED") {
          setSessionEnded(true);
          setLoading(false);
          return;
        }
        setError(data.error || "Error al acceder a la sesión");
        setLoading(false);
        return;
      }

      setSessionData(data);

      // Mark session as live if not already
      if (data.booking.sessionStatus !== "live") {
        const manageRes = await fetch("/api/session/manage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId, action: "start" }),
        });

        const manageData = await manageRes.json();
        if (manageData.recording) {
          setIsRecording(true);
        }
      } else {
        // Session already live — check if recording is active
        setIsRecording(true);
      }

      setLoading(false);
    } catch (err) {
      console.error("Session fetch error:", err);
      setError("Error de conexión");
      setLoading(false);
    }
  }, [user, bookingId]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) fetchToken();
  }, [user, authLoading, router, fetchToken]);

  // Waiting room countdown refresh
  useEffect(() => {
    if (waitMinutes === null) return;
    const interval = setInterval(() => {
      fetchToken();
    }, 30000);
    return () => clearInterval(interval);
  }, [waitMinutes, fetchToken]);

  // Poll recording status after session ends
  useEffect(() => {
    if (!sessionEnded || !user || recordingUrl) return;

    const checkRecording = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/session/recording?bookingId=${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRecordingStatus(data.status);
          if (data.recordingUrl) {
            setRecordingUrl(data.recordingUrl);
          }
        }
      } catch {
        // Silently ignore — will retry
      }
    };

    checkRecording();
    const interval = setInterval(checkRecording, 5000); // Check every 5s
    return () => clearInterval(interval);
  }, [sessionEnded, user, bookingId, recordingUrl]);

  const handleSessionEnd = useCallback(async () => {
    if (!user || sessionEnded) return;
    setSessionEnded(true);
    setIsRecording(false);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/session/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, action: "end" }),
      });
      const data = await res.json();
      if (data.recordingUrl) {
        setRecordingUrl(data.recordingUrl);
        setRecordingStatus("ready");
      } else {
        setRecordingStatus("processing");
      }
    } catch (err) {
      console.error("End session error:", err);
    }
  }, [user, bookingId, sessionEnded]);

  // Loading state
  if (authLoading || loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingSpinner} />
        <span className={styles.loadingText}>Conectando a la sesión...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.errorPage}>
        <span className={styles.errorIcon}>❌</span>
        <h1 className={styles.errorTitle}>No se puede acceder</h1>
        <p className={styles.errorMsg}>{error}</p>
        <Link href="/dashboard" className="btn btn-primary">Volver al panel</Link>
      </div>
    );
  }

  // Waiting room
  if (waitMinutes !== null) {
    const hours = Math.floor(waitMinutes / 60);
    const mins = waitMinutes % 60;
    const display = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

    return (
      <div className={styles.waitingRoom}>
        <div className={styles.waitingIcon}>⏳</div>
        <h1 className={styles.waitingTitle}>Sala de espera</h1>
        <div className={styles.waitingCountdown}>{display}</div>
        <p className={styles.waitingSub}>
          Podrás acceder a la sesión 10 minutos antes de la hora programada.
          Esta página se actualizará automáticamente.
        </p>
        <Link href={`/session/${bookingId}/prep`} className="btn btn-secondary">
          📎 Subir material mientras esperas
        </Link>
        <Link href="/dashboard" className="btn btn-ghost">← Volver al panel</Link>
      </div>
    );
  }

  // Session ended overlay
  if (sessionEnded) {
    return (
      <div className={styles.endedOverlay}>
        <span className={styles.endedIcon}>✅</span>
        <h1 className={styles.endedTitle}>Sesión finalizada</h1>
        <p className={styles.endedMsg}>
          La sesión de coaching ha terminado. Puedes revisar el chat y el material subido desde tu panel.
        </p>

        {/* Recording status */}
        <div className={styles.recordingStatus}>
          {recordingStatus === "ready" && recordingUrl ? (
            <div className={styles.recordingReady}>
              <span>🎥</span>
              <span>Grabación disponible</span>
              <a href={recordingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                ▶ Reproducir
              </a>
            </div>
          ) : recordingStatus === "processing" || recordingStatus === "ending" || recordingStatus === "recording" ? (
            <div className={styles.recordingProcessing}>
              <div className={styles.recordingSpinner} />
              <span>Procesando grabación...</span>
            </div>
          ) : recordingStatus === "failed" || recordingStatus === "aborted" ? (
            <div className={styles.recordingFailed}>
              <span>⚠️ La grabación no se pudo completar</span>
            </div>
          ) : null}
        </div>

        <div className={styles.endedActions}>
          <Link href="/dashboard" className="btn btn-primary">Ir al panel</Link>
          <Link href={`/session/${bookingId}/prep`} className="btn btn-secondary">Ver material</Link>
        </div>
      </div>
    );
  }

  if (!sessionData) return null;

  const sessionTitle = sessionData.isCoach
    ? `Sesión con ${sessionData.booking.studentName}`
    : "Tu sesión de coaching";

  return (
    <div className={styles.sessionPage}>
      <SessionTimer
        scheduledDate={sessionData.booking.scheduledDate}
        scheduledTime={sessionData.booking.scheduledTime}
        sessionTitle={sessionTitle}
        isCoach={sessionData.isCoach}
        isRecording={isRecording}
        onSessionEnd={handleSessionEnd}
      />

      <div className={styles.sessionMain}>
        {/* Video Area */}
        <div className={styles.videoArea}>
          <div className={styles.videoContainer}>
            <LiveKitRoom
              serverUrl={sessionData.serverUrl}
              token={sessionData.token}
              connect={true}
              audio={true}
              video={true}
              style={{ height: "100%" }}
            >
              <VideoConference chatEnabled={false} />
              <RoomAudioRenderer />
            </LiveKitRoom>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarTabs}>
            <button
              className={`${styles.sidebarTab} ${sidebarTab === "chat" ? styles.sidebarTabActive : ""}`}
              onClick={() => setSidebarTab("chat")}
            >
              💬 Chat
            </button>
            <button
              className={`${styles.sidebarTab} ${sidebarTab === "materials" ? styles.sidebarTabActive : ""}`}
              onClick={() => setSidebarTab("materials")}
            >
              📎 Material
            </button>
          </div>

          <div className={styles.sidebarContent}>
            {sidebarTab === "chat" ? (
              <SessionChat
                bookingId={bookingId}
                userId={user!.uid}
                userName={user!.displayName || ""}
                userAvatar={user!.photoURL || ""}
                disabled={sessionEnded}
              />
            ) : (
              <SessionMaterials
                bookingId={bookingId}
                userId={user!.uid}
                userName={user!.displayName || ""}
                userToken={idToken}
                readOnly={sessionEnded}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
