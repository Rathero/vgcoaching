"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./SessionTimer.module.css";

interface Props {
  scheduledDate: string;
  scheduledTime: string;
  sessionTitle: string;
  isCoach: boolean;
  isRecording?: boolean;
  onSessionEnd: () => void;
}

export default function SessionTimer({ scheduledDate, scheduledTime, sessionTitle, isCoach, isRecording, onSessionEnd }: Props) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [started, setStarted] = useState(false);

  const calcTimeLeft = useCallback(() => {
    const scheduledStart = new Date(`${scheduledDate}T${scheduledTime}:00`);
    const end = new Date(scheduledStart.getTime() + 60 * 60 * 1000); // 1h session
    const now = new Date();
    return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  }, [scheduledDate, scheduledTime]);

  useEffect(() => {
    setTimeLeft(calcTimeLeft());
    setStarted(true);
    const interval = setInterval(() => {
      const remaining = calcTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onSessionEnd();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [calcTimeLeft, onSessionEnd]);

  if (!started) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const timerClass = minutes < 5
    ? styles.timerCritical
    : minutes < 15
      ? styles.timerWarning
      : "";

  return (
    <div className={styles.timerBar}>
      <div className={styles.timerLeft}>
        {isRecording && (
          <span className={styles.recordingBadge}>
            <span className={styles.recordingDot} />
            REC
          </span>
        )}
        <span className={styles.sessionTitle}>{sessionTitle}</span>
        <span className={styles.sessionRole}>{isCoach ? "👨‍🏫 Coach" : "🎓 Alumno"}</span>
      </div>
      <div className={`${styles.timerDisplay} ${timerClass}`}>
        <span className={styles.timerIcon}>⏱</span>
        {formatted}
      </div>
      <button className={styles.endBtn} onClick={onSessionEnd}>
        Finalizar sesión
      </button>
    </div>
  );
}
