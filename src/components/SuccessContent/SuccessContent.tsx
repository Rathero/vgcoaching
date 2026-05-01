"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./SuccessContent.module.css";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking") || "";
  const isDemo = searchParams.get("demo") === "true";

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={`glass-card ${styles.card}`}>
          <div className={styles.iconWrap}>
            <span className={styles.icon}>✅</span>
          </div>
          <h1 className={styles.title}>¡Reserva confirmada!</h1>
          <p className={styles.subtitle}>
            Tu sesión de coaching ha sido reservada con éxito.
            {isDemo ? " (Modo demo)" : " Recibirás un email con los detalles."}
          </p>

          {bookingId && (
            <div className={styles.details}>
              <div className={styles.row}>
                <span className={styles.label}>ID de reserva</span>
                <span className={styles.value} style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{bookingId}</span>
              </div>
            </div>
          )}

          <div className={styles.nextSteps}>
            <h3 className={styles.nextTitle}>📋 Próximos pasos</h3>
            <ol className={styles.stepList}>
              <li>Tu sesión aparecerá en <strong>Mi Panel</strong> con la fecha y hora confirmada.</li>
              <li>Puedes subir material (vídeos, imágenes, notas) para preparar la sesión.</li>
              <li>10 minutos antes de la hora, podrás entrar a la sala de coaching.</li>
              <li>¡Conecta puntual y disfruta la sesión!</li>
            </ol>
          </div>

          <div className={styles.actions}>
            <Link href="/dashboard" className="btn btn-primary">Ir a Mi Panel</Link>
            {bookingId && (
              <Link href={`/session/${bookingId}/prep`} className="btn btn-secondary">📎 Subir material</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
