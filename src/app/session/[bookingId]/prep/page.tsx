"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/Navbar/Navbar";
import SessionMaterials from "@/components/SessionMaterials/SessionMaterials";
import styles from "./page.module.css";

interface BookingInfo {
  id: string;
  coachDisplayName?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  sessionStatus?: string;
}

export default function PrepPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idToken, setIdToken] = useState("");

  const fetchBooking = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      setIdToken(token);

      // Use dashboard API to get booking info
      const res = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setError("No se pudo cargar la información");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const allBookings = [...(data.studentBookings || []), ...(data.coachBookings || [])];
      const booking = allBookings.find((b: BookingInfo) => b.id === bookingId);

      if (!booking) {
        setError("Reserva no encontrada o no tienes acceso");
        setLoading(false);
        return;
      }

      setBookingInfo(booking);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error de conexión");
      setLoading(false);
    }
  }, [user, bookingId]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) fetchBooking();
  }, [user, authLoading, router, fetchBooking]);

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className={styles.loading}>
          <div className={styles.spinner} />
          Cargando...
        </div>
      </>
    );
  }

  if (error || !bookingInfo) {
    return (
      <>
        <Navbar />
        <div className={styles.page}>
          <div className={styles.container}>
            <div className={styles.errorPage}>
              <h2>❌ {error || "Error"}</h2>
              <p>No pudimos cargar la información de esta sesión.</p>
              <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: "var(--space-lg)" }}>
                Volver al panel
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  };

  const isCompleted = bookingInfo.status === "completed" || bookingInfo.sessionStatus === "completed";

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <Link href="/dashboard" className={styles.backLink}>
            ← Volver al panel
          </Link>

          <div className={styles.header}>
            <h1>{isCompleted ? "📋 Historial de sesión" : "📎 Preparar sesión"}</h1>
            <p>
              {isCompleted
                ? "Revisa el material y el chat de esta sesión."
                : "Sube vídeos, imágenes o notas para que tu coach las revise antes de la sesión."}
            </p>
            <div className={styles.sessionInfo}>
              {bookingInfo.coachDisplayName && (
                <div className={styles.infoItem}>
                  <span>👨‍🏫</span> {bookingInfo.coachDisplayName}
                </div>
              )}
              <div className={styles.infoItem}>
                <span>📅</span> {formatDate(bookingInfo.scheduledDate)}
              </div>
              <div className={styles.infoItem}>
                <span>🕐</span> {bookingInfo.scheduledTime}h
              </div>
            </div>
          </div>

          <div className={styles.materialsWrapper}>
            <SessionMaterials
              bookingId={bookingId}
              userId={user!.uid}
              userName={user!.displayName || ""}
              userToken={idToken}
              readOnly={isCompleted}
            />
          </div>
        </div>
      </div>
    </>
  );
}
