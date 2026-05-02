"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";
import { Coach, CoachGame, CoachingOption, Availability } from "@/lib/types";
import styles from "./BookingClient.module.css";

interface Props {
  coach: Coach;
  gameData: CoachGame;
  options: CoachingOption[];
  availability: Availability[];
  gameSlug: string;
}

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(0)}€`;
}

export default function BookingClient({ coach, gameData, options, availability, gameSlug }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const preselectedOption = searchParams.get("option") || "";

  const [selectedOptionId, setSelectedOptionId] = useState<string>(preselectedOption || options[0]?.id || "");
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [studentName, setStudentName] = useState(user?.displayName || "");
  const [studentEmail, setStudentEmail] = useState(user?.email || "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});

  // Pre-fill from auth
  useEffect(() => {
    if (user) {
      if (user.displayName && !studentName) setStudentName(user.displayName);
      if (user.email && !studentEmail) setStudentEmail(user.email);
    }
  }, [user, studentName, studentEmail]);

  const selectedOption = options.find(o => o.id === selectedOptionId);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const availableDays = useMemo(() => new Set(availability.map(a => a.dayOfWeek)), [availability]);

  // Fetch booked slots when month changes
  const fetchBookedSlots = useCallback(async () => {
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${daysInMonth}`;
    try {
      const res = await fetch(`/api/booked-slots?coachId=${coach.id}&startDate=${startDate}&endDate=${endDate}`);
      const data = await res.json();
      setBookedSlots(data.bookedSlots || {});
    } catch {
      // silently fail
    }
  }, [coach.id, year, month, daysInMonth]);

  useEffect(() => { fetchBookedSlots(); }, [fetchBookedSlots]);

  // Parse date string safely to avoid timezone offset issues
  // new Date('YYYY-MM-DD') is UTC midnight, which can shift the day in local time
  function parseLocalDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  // Time slots for selected date, excluding booked ones
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const date = parseLocalDate(selectedDate);
    const dayOfWeek = date.getDay();
    const dayAvail = availability.filter(a => a.dayOfWeek === dayOfWeek);
    const booked = bookedSlots[selectedDate] || [];
    const slots: { time: string; available: boolean }[] = [];
    dayAvail.forEach(a => {
      const [startH] = a.startTime.split(":").map(Number);
      const [endH] = a.endTime.split(":").map(Number);
      for (let h = startH; h < endH; h++) {
        const t = `${String(h).padStart(2, "0")}:00`;
        slots.push({ time: t, available: !booked.includes(t) });
      }
    });
    return slots;
  }, [selectedDate, availability, bookedSlots]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const canProceed = selectedOptionId && selectedDate && selectedTime && studentName.trim() && studentEmail.trim();

  const handlePay = async () => {
    if (!canProceed || !selectedOption) return;
    setLoading(true);
    setError("");

    try {
      // Get auth token if logged in
      let idToken: string | undefined;
      if (auth.currentUser) {
        idToken = await auth.currentUser.getIdToken();
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachId: coach.id,
          coachingOptionId: selectedOptionId,
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          studentName,
          studentEmail,
          notes,
          idToken,
          gameSlug,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al procesar la reserva");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  const hasDateTime = !!(selectedDate && selectedTime);

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        {/* Step 1: Date & Time — hidden once both are selected */}
        {!hasDateTime && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Elige fecha y hora</h2>
            <div className={styles.calendarHeader}>
              <button className={styles.calNavBtn} onClick={() => setCurrentMonth(new Date(year, month - 1))}>←</button>
              <span className={styles.calMonth}>{MONTH_NAMES[month]} {year}</span>
              <button className={styles.calNavBtn} onClick={() => setCurrentMonth(new Date(year, month + 1))}>→</button>
            </div>
            <div className={styles.calGrid}>
              {DAY_LABELS.map(d => <div key={d} className={styles.calDayLabel}>{d}</div>)}
              {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} className={styles.calDayEmpty} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isPast = date < today;
                const isAvailable = availableDays.has(date.getDay());
                const disabled = isPast || !isAvailable;
                const selected = selectedDate === dateStr;
                return (
                  <button key={day} className={`${styles.calDay} ${selected ? styles.calDaySelected : ""} ${disabled ? styles.calDayDisabled : ""}`}
                    onClick={() => { if (!disabled) { setSelectedDate(dateStr); setSelectedTime(null); } }} disabled={disabled}>
                    {day}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <>
                <h3 className={styles.sectionTitle} style={{ fontSize: "1rem" }}>Horarios disponibles</h3>
                <div className={styles.timeGrid}>
                  {timeSlots.map(({ time, available }) => (
                    <button key={time}
                      className={`${styles.timeSlot} ${selectedTime === time ? styles.timeSlotSelected : ""} ${!available ? styles.timeSlotBooked : ""}`}
                      onClick={() => available && setSelectedTime(time)}
                      disabled={!available}>
                      {time}
                      {!available && <span className={styles.bookedLabel}>Ocupado</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: User details — shown after date+time are confirmed */}
        {hasDateTime && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Tus datos</h2>
            {!user && (
              <div className={styles.loginHint}>
                <a href="/login" className={styles.loginLink}>Inicia sesión</a> para rellenar tus datos automáticamente.
              </div>
            )}
            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Nombre *</label>
                <input className={styles.input} placeholder="Tu nombre o nickname" value={studentName} onChange={e => setStudentName(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email *</label>
                <input className={styles.input} type="email" placeholder="tu@email.com" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Notas para el coach (opcional)</label>
                <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Tu rango actual, qué quieres mejorar, campeones que juegas..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
      </div>

      {/* Summary Sidebar */}
      <div>
        <div className={`glass-card ${styles.summaryCard}`}>
          <h3 className={styles.summaryTitle}>Resumen</h3>
          <div className={styles.summaryCoach}>
            <div className={styles.summaryAvatar}>{coach.avatar}</div>
            <div>
              <div className={styles.summaryCoachName}>{coach.displayName}</div>
              <div className={styles.summaryCoachMeta}>👑 {gameData.rank} · ⭐ {coach.ratingAvg}</div>
            </div>
          </div>
          {selectedOption && (
            <>
              <div className={styles.summaryOptionCard}>
                <div className={styles.summaryOptionName}>{selectedOption.name}</div>
                <div className={styles.summaryOptionDesc}>{selectedOption.description}</div>
                <div className={styles.summaryOptionMeta}>⏱ {selectedOption.durationMinutes} min</div>
              </div>
            </>
          )}
          {selectedDate && (
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Fecha</span>
              <span className={styles.summaryValue}>
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
              </span>
            </div>
          )}
          {selectedTime && (
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Hora</span>
              <span className={styles.summaryValue}>{selectedTime}</span>
            </div>
          )}
          {hasDateTime && (
            <button className={styles.changeBtn} onClick={() => { setSelectedTime(null); }}>
              Cambiar fecha/hora
            </button>
          )}
          <div className={styles.summaryDivider} />
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span className={styles.summaryTotalValue}>{selectedOption ? formatPrice(selectedOption.priceCents) : "—"}</span>
          </div>
          <button className={styles.payBtn} disabled={!canProceed || loading} onClick={handlePay}>
            {loading ? "Procesando..." : "Pagar y reservar →"}
          </button>
          <p className={styles.payNote}>🔒 Pago seguro con Stripe</p>
        </div>
      </div>
    </div>
  );
}
