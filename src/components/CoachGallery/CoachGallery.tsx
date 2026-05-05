"use client";

import { useState, useCallback } from "react";
import styles from "./CoachGallery.module.css";

interface CoachGalleryProps {
  images: string[];
}

export default function CoachGallery({ images }: CoachGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + images.length) % images.length);
  }, [images.length]);

  const prev = useCallback(() => goTo(current - 1), [goTo, current]);
  const next = useCallback(() => goTo(current + 1), [goTo, current]);

  if (images.length === 0) return null;

  return (
    <>
      <div className={styles.carousel}>
        <div className={styles.viewport}>
          <div
            className={styles.track}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((src, i) => (
              <div key={i} className={styles.slide}>
                <img
                  src={src}
                  alt={`Galería ${i + 1}`}
                  className={styles.image}
                  onClick={() => setLightboxOpen(true)}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <button
                className={`${styles.navBtn} ${styles.navPrev}`}
                onClick={prev}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                className={`${styles.navBtn} ${styles.navNext}`}
                onClick={next}
                aria-label="Siguiente"
              >
                ›
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((src, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === current ? styles.thumbActive : ""}`}
                onClick={() => goTo(i)}
              >
                <img src={src} alt={`Miniatura ${i + 1}`} draggable={false} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.lightboxClose}
              onClick={() => setLightboxOpen(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>
            <img
              src={images[current]}
              alt={`Galería ${current + 1}`}
              className={styles.lightboxImage}
            />
            {images.length > 1 && (
              <>
                <button
                  className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                  onClick={prev}
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                  onClick={next}
                  aria-label="Siguiente"
                >
                  ›
                </button>
              </>
            )}
            <div className={styles.lightboxCounter}>
              {current + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
