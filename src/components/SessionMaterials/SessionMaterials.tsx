"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type { SessionMaterial } from "@/lib/types";
import styles from "./SessionMaterials.module.css";

interface Props {
  bookingId: string;
  userId: string;
  userName: string;
  userToken: string;
  readOnly?: boolean;
}

type TabKey = "images" | "videos" | "notes";

export default function SessionMaterials({ bookingId, userId, userName, userToken, readOnly }: Props) {
  const [materials, setMaterials] = useState<SessionMaterial[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("images");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Real-time listener for materials
  useEffect(() => {
    const q = query(
      collection(db, "bookings", bookingId, "materials"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMaterials(snap.docs.map(d => ({ id: d.id, ...d.data() } as SessionMaterial)));
    });
    return () => unsub();
  }, [bookingId]);

  const images = materials.filter(m => m.type === "image");
  const videos = materials.filter(m => m.type === "video");
  const notes = materials.filter(m => m.type === "text");

  const tabs: { key: TabKey; label: string; icon: string; count: number }[] = [
    { key: "images", label: "Imágenes", icon: "🖼️", count: images.length },
    { key: "videos", label: "Vídeos", icon: "🎬", count: videos.length },
    { key: "notes", label: "Notas", icon: "📝", count: notes.length },
  ];

  const saveMaterialMeta = async (data: {
    type: "video" | "image" | "text";
    url?: string;
    content?: string;
    fileName?: string;
    fileSize?: number;
  }) => {
    await fetch("/api/session/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ bookingId, ...data }),
    });
  };

  const uploadFile = async (file: File, type: "image" | "video") => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const path = `sessions/${bookingId}/materials/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed",
        (snap) => {
          const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await saveMaterialMeta({
            type,
            url,
            fileName: file.name,
            fileSize: file.size,
          });
          setUploading(false);
          setUploadProgress(0);
          setActiveTab(type === "image" ? "images" : "videos");
        }
      );
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, type);
    e.target.value = "";
  };

  const submitText = async () => {
    if (!textContent.trim()) return;
    setUploading(true);
    await saveMaterialMeta({ type: "text", content: textContent.trim() });
    setTextContent("");
    setShowTextInput(false);
    setUploading(false);
    setActiveTab("notes");
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const openLightbox = useCallback((url: string) => {
    setLightboxUrl(url);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxUrl(null);
    document.body.style.overflow = "";
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (lightboxUrl && images.length > 1) {
        if (e.key === "ArrowRight") {
          const currentIdx = images.findIndex(img => img.url === lightboxUrl);
          const next = (currentIdx + 1) % images.length;
          setLightboxUrl(images[next].url || null);
        }
        if (e.key === "ArrowLeft") {
          const currentIdx = images.findIndex(img => img.url === lightboxUrl);
          const prev = (currentIdx - 1 + images.length) % images.length;
          setLightboxUrl(images[prev].url || null);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeLightbox, lightboxUrl, images]);

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>📎 Material de sesión</span>
        <span className={styles.headerCount}>{materials.length} archivo{materials.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count > 0 && <span className={styles.tabBadge}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {/* IMAGES TAB */}
        {activeTab === "images" && (
          <div className={styles.imagesTab}>
            {images.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>🖼️</span>
                <p>No hay imágenes subidas</p>
                {!readOnly && <p className={styles.emptyHint}>Sube capturas de pantalla, builds o estrategias</p>}
              </div>
            ) : (
              <>
                {/* Main carousel image */}
                <div className={styles.carouselMain}>
                  <img
                    src={images[carouselIndex]?.url}
                    alt={images[carouselIndex]?.fileName || "Imagen"}
                    className={styles.carouselImage}
                    onClick={() => openLightbox(images[carouselIndex]?.url || "")}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        className={`${styles.carouselNav} ${styles.carouselPrev}`}
                        onClick={() => setCarouselIndex((carouselIndex - 1 + images.length) % images.length)}
                      >‹</button>
                      <button
                        className={`${styles.carouselNav} ${styles.carouselNext}`}
                        onClick={() => setCarouselIndex((carouselIndex + 1) % images.length)}
                      >›</button>
                    </>
                  )}
                  <div className={styles.carouselCounter}>{carouselIndex + 1} / {images.length}</div>
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className={styles.thumbnails}>
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        className={`${styles.thumbnail} ${i === carouselIndex ? styles.thumbnailActive : ""}`}
                        onClick={() => setCarouselIndex(i)}
                      >
                        <img src={img.url} alt={img.fileName || ""} />
                      </button>
                    ))}
                  </div>
                )}

                {/* Image info */}
                <div className={styles.imageInfo}>
                  <span className={styles.imageName}>{images[carouselIndex]?.fileName}</span>
                  <span className={styles.imageSize}>{formatSize(images[carouselIndex]?.fileSize)}</span>
                  <span className={styles.imageDate}>{formatDate(images[carouselIndex]?.createdAt)}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          <div className={styles.videosTab}>
            {videos.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>🎬</span>
                <p>No hay vídeos subidos</p>
                {!readOnly && <p className={styles.emptyHint}>Sube replays o clips de partidas</p>}
              </div>
            ) : (
              <div className={styles.videoGrid}>
                {videos.map(v => (
                  <div key={v.id} className={styles.videoCard}>
                    <video controls className={styles.videoPlayer} preload="metadata">
                      <source src={v.url} />
                    </video>
                    <div className={styles.videoInfo}>
                      <span className={styles.videoName}>{v.fileName}</span>
                      <div className={styles.videoMeta}>
                        <span>{formatSize(v.fileSize)}</span>
                        <span>{formatDate(v.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === "notes" && (
          <div className={styles.notesTab}>
            {notes.length === 0 && !showTextInput ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>📝</span>
                <p>No hay notas</p>
                {!readOnly && <p className={styles.emptyHint}>Añade preguntas o contexto para tu coach</p>}
              </div>
            ) : (
              <div className={styles.notesList}>
                {notes.map(n => (
                  <div key={n.id} className={styles.noteCard}>
                    <div className={styles.noteMeta}>
                      <span className={styles.noteAuthor}>
                        {n.uploadedBy === userId ? "Tú" : n.uploaderName}
                      </span>
                      <span className={styles.noteDate}>{formatDate(n.createdAt)}</span>
                    </div>
                    <div className={styles.noteContent}>{n.content}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Inline note input */}
            {showTextInput && !readOnly && (
              <div className={styles.noteInputArea}>
                <textarea
                  className={styles.textInput}
                  placeholder="Escribe una nota o pregunta para la sesión..."
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  rows={4}
                  autoFocus
                />
                <div className={styles.noteInputActions}>
                  <button className={styles.btnCancel} onClick={() => { setShowTextInput(false); setTextContent(""); }}>
                    Cancelar
                  </button>
                  <button className={styles.btnSubmit} onClick={submitText} disabled={!textContent.trim() || uploading}>
                    Guardar nota
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload progress bar */}
      {uploading && (
        <div className={styles.uploadProgress}>
          <span>Subiendo...</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
          </div>
          <span>{Math.round(uploadProgress)}%</span>
        </div>
      )}

      {/* Upload actions */}
      {!readOnly && (
        <div className={styles.uploadArea}>
          <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            🖼️ Subir imagen
          </button>
          <button className={styles.uploadBtn} onClick={() => videoInputRef.current?.click()} disabled={uploading}>
            🎬 Subir vídeo
          </button>
          <button
            className={styles.uploadBtn}
            onClick={() => { setActiveTab("notes"); setShowTextInput(true); }}
            disabled={uploading}
          >
            📝 Añadir nota
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={e => handleFileSelect(e, "image")}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className={styles.hiddenInput}
            onChange={e => handleFileSelect(e, "video")}
          />
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>✕</button>
          <img
            src={lightboxUrl}
            alt="Ampliación"
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = images.findIndex(img => img.url === lightboxUrl);
                  const prev = (idx - 1 + images.length) % images.length;
                  setLightboxUrl(images[prev].url || null);
                }}
              >‹</button>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = images.findIndex(img => img.url === lightboxUrl);
                  const next = (idx + 1) % images.length;
                  setLightboxUrl(images[next].url || null);
                }}
              >›</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
