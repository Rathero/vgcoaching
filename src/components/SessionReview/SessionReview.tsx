"use client";

import { useState } from "react";
import styles from "./SessionReview.module.css";

interface SessionReviewProps {
  bookingId: string;
  coachName: string;
  onReviewSubmitted?: () => void;
}

export default function SessionReview({ bookingId, coachName, onReviewSubmitted }: SessionReviewProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Selecciona una puntuación");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Get Firebase auth token from the current user
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("Debes estar logueado");
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch("/api/session/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al enviar la valoración");
        return;
      }

      setSubmitted(true);
      onReviewSubmitted?.();
    } catch {
      setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.reviewCard}>
        <div className={styles.successState}>
          <div className={styles.successIcon}>🎉</div>
          <h3 className={styles.successTitle}>¡Gracias por tu valoración!</h3>
          <p className={styles.successMsg}>
            Tu opinión ayuda a otros jugadores a encontrar su coach ideal.
          </p>
          <div className={styles.submittedRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${star <= rating ? styles.starFilled : styles.starEmpty}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayRating = hoveredRating || rating;
  const ratingLabels = ["", "Mal", "Regular", "Bien", "Muy bien", "Excelente"];

  return (
    <div className={styles.reviewCard}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>⭐</span>
        <h3 className={styles.headerTitle}>Valora tu sesión</h3>
      </div>

      <p className={styles.prompt}>
        ¿Cómo fue tu experiencia con <strong>{coachName}</strong>?
      </p>

      {/* Star Rating */}
      <div className={styles.ratingSection}>
        <div className={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`${styles.starBtn} ${
                star <= displayRating ? styles.starBtnActive : ""
              }`}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              aria-label={`${star} estrellas`}
              type="button"
            >
              <span className={styles.starIcon}>★</span>
            </button>
          ))}
        </div>
        {displayRating > 0 && (
          <span className={styles.ratingLabel}>{ratingLabels[displayRating]}</span>
        )}
      </div>

      {/* Comment */}
      <div className={styles.commentSection}>
        <label htmlFor="review-comment" className={styles.commentLabel}>
          Comentario <span className={styles.optional}>(opcional)</span>
        </label>
        <textarea
          id="review-comment"
          className={styles.textarea}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuéntanos sobre tu experiencia..."
          maxLength={500}
          rows={3}
        />
        <span className={styles.charCount}>{comment.length}/500</span>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={submitting || rating === 0}
        type="button"
      >
        {submitting ? (
          <>
            <span className={styles.submitSpinner} />
            Enviando...
          </>
        ) : (
          "Enviar valoración"
        )}
      </button>
    </div>
  );
}
