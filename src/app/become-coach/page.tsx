"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";

const GAMES = [
  { id: "lol", name: "League of Legends", icon: "⚔️" },
];

const RANKS = [
  { value: "Challenger", tier: "challenger" },
  { value: "Grandmaster", tier: "grandmaster" },
  { value: "Master", tier: "master" },
  { value: "Diamond I", tier: "diamond" },
  { value: "Diamond II", tier: "diamond" },
  { value: "Diamond III", tier: "diamond" },
  { value: "Diamond IV", tier: "diamond" },
];

const ROLES = [
  { id: "top", name: "Top", icon: "🗡️" },
  { id: "jungle", name: "Jungle", icon: "🌲" },
  { id: "mid", name: "Mid", icon: "⚔️" },
  { id: "adc", name: "ADC", icon: "🏹" },
  { id: "support", name: "Support", icon: "🛡️" },
];

const COACHING_TYPES = [
  { id: "live_coaching", name: "Coaching en Vivo", desc: "Sesión en vivo guiando al alumno", icon: "🎬" },
  { id: "vod_review", name: "VOD Review", desc: "Análisis de replays del alumno", icon: "📹" },
  { id: "duo_coaching", name: "Duo Coaching", desc: "Jugar juntos en ranked/normal", icon: "🤝" },
  { id: "champion_specific", name: "Champion Masterclass", desc: "Sesión enfocada en un campeón", icon: "⚔️" },
  { id: "group_coaching", name: "Coaching de Equipo", desc: "Coaching grupal para equipos de 5", icon: "👥" },
];

const COUNTRIES = [
  { code: "ES", flag: "🇪🇸", name: "España" },
  { code: "MX", flag: "🇲🇽", name: "México" },
  { code: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "CO", flag: "🇨🇴", name: "Colombia" },
  { code: "CL", flag: "🇨🇱", name: "Chile" },
  { code: "PE", flag: "🇵🇪", name: "Perú" },
  { code: "US", flag: "🇺🇸", name: "Estados Unidos" },
  { code: "BR", flag: "🇧🇷", name: "Brasil" },
];

const LANGUAGES = ["Español", "Inglés", "Portugués", "Francés", "Alemán"];

export default function BecomeCoachPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [existingApp, setExistingApp] = useState<string | null>(null);
  const [checkingApp, setCheckingApp] = useState(true);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [gameId, setGameId] = useState("lol");
  const [inGameName, setInGameName] = useState("");
  const [rank, setRank] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState("");
  const [champions, setChampions] = useState("");
  const [bio, setBio] = useState("");
  const [longBio, setLongBio] = useState("");
  const [country, setCountry] = useState("ES");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["Español"]);
  const [selectedCoachingTypes, setSelectedCoachingTypes] = useState<string[]>(["live_coaching"]);

  // Pricing
  const [liveCoachingPrice, setLiveCoachingPrice] = useState("25");
  const [vodReviewPrice, setVodReviewPrice] = useState("20");
  const [duoCoachingPrice, setDuoCoachingPrice] = useState("40");
  const [championSpecificPrice, setChampionSpecificPrice] = useState("30");
  const [groupCoachingPrice, setGroupCoachingPrice] = useState("100");

  // Check existing application
  const checkExistingApp = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/coach/register", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.application) {
          setExistingApp(data.application.status);
        }
      }
    } catch { /* ignore */ }
    setCheckingApp(false);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      setDisplayName(user.displayName || "");
      checkExistingApp();
    }
  }, [user, loading, router, checkExistingApp]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const toggleRole = (id: string) => {
    setSelectedRoles(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleCoachingType = (id: string) => {
    setSelectedCoachingTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const validateStep = (s: number): boolean => {
    setError("");
    switch (s) {
      case 1:
        if (!displayName.trim()) { setError("Introduce tu nombre de coach"); return false; }
        if (!avatarFile && !avatarPreview) { setError("Sube una foto de perfil"); return false; }
        if (!country) { setError("Selecciona tu país"); return false; }
        if (selectedLanguages.length === 0) { setError("Selecciona al menos un idioma"); return false; }
        return true;
      case 2:
        if (!inGameName.trim()) { setError("Introduce tu nombre en el juego"); return false; }
        if (!rank) { setError("Selecciona tu rango"); return false; }
        if (selectedRoles.length === 0) { setError("Selecciona al menos un rol"); return false; }
        return true;
      case 3:
        if (!bio.trim() || bio.length < 20) { setError("La bio debe tener al menos 20 caracteres"); return false; }
        return true;
      case 4:
        if (selectedCoachingTypes.length === 0) { setError("Activa al menos un tipo de coaching"); return false; }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4) || !user) return;
    setSubmitting(true);
    setError("");

    try {
      let avatarUrl = avatarPreview;

      // Upload avatar to Firebase Storage
      if (avatarFile) {
        const storageRef = ref(storage, `coach-avatars/${user.uid}_${Date.now()}`);
        await uploadBytes(storageRef, avatarFile);
        avatarUrl = await getDownloadURL(storageRef);
      }

      const selectedRank = RANKS.find(r => r.value === rank);
      const token = await user.getIdToken();

      const res = await fetch("/api/coach/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName,
          avatarUrl,
          gameId,
          inGameName,
          rank,
          rankTier: selectedRank?.tier || "diamond",
          roles: selectedRoles,
          specialties: specialties.split(",").map(s => s.trim()).filter(Boolean),
          champions: champions.split(",").map(s => s.trim()).filter(Boolean),
          bio,
          longBio: longBio || bio,
          country,
          languages: selectedLanguages,
          coachingTypes: selectedCoachingTypes,
          liveCoachingPrice: selectedCoachingTypes.includes("live_coaching") ? parseInt(liveCoachingPrice) * 100 : undefined,
          vodReviewPrice: selectedCoachingTypes.includes("vod_review") ? parseInt(vodReviewPrice) * 100 : undefined,
          duoCoachingPrice: selectedCoachingTypes.includes("duo_coaching") ? parseInt(duoCoachingPrice) * 100 : undefined,
          championSpecificPrice: selectedCoachingTypes.includes("champion_specific") ? parseInt(championSpecificPrice) * 100 : undefined,
          groupCoachingPrice: selectedCoachingTypes.includes("group_coaching") ? parseInt(groupCoachingPrice) * 100 : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al enviar la solicitud");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || checkingApp) {
    return (
      <>
        <Navbar />
        <div className={styles.page}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            Cargando...
          </div>
        </div>
      </>
    );
  }

  if (profile?.role === "coach") {
    return (
      <>
        <Navbar />
        <div className={styles.page}>
          <div className={`glass-card ${styles.statusCard}`}>
            <span className={styles.statusIcon}>✅</span>
            <h1>¡Ya eres coach!</h1>
            <p>Tu perfil ya está activo en la plataforma. Gestiona tus sesiones desde tu panel.</p>
            <button className="btn btn-primary" onClick={() => router.push("/dashboard")}>Ir al panel</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (existingApp) {
    return (
      <>
        <Navbar />
        <div className={styles.page}>
          <div className={`glass-card ${styles.statusCard}`}>
            <span className={styles.statusIcon}>
              {existingApp === "pending" ? "⏳" : existingApp === "approved" ? "✅" : "❌"}
            </span>
            <h1>
              {existingApp === "pending" ? "Solicitud en revisión" : existingApp === "approved" ? "¡Aprobado!" : "Solicitud rechazada"}
            </h1>
            <p>
              {existingApp === "pending"
                ? "Tu solicitud para ser coach está siendo revisada por nuestro equipo. Te notificaremos por email cuando esté lista."
                : existingApp === "approved"
                ? "¡Enhorabuena! Tu solicitud ha sido aprobada. Ya puedes empezar a recibir alumnos."
                : "Lo sentimos, tu solicitud ha sido rechazada. Puedes contactarnos para más información."}
            </p>
            <button className="btn btn-primary" onClick={() => router.push("/dashboard")}>Ir al panel</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className={styles.page}>
          <div className={`glass-card ${styles.statusCard}`}>
            <span className={styles.statusIcon}>🎉</span>
            <h1>¡Solicitud enviada!</h1>
            <p>Nuestro equipo revisará tu perfil y te notificaremos por email cuando esté aprobado. Normalmente tardamos 24-48h.</p>
            <button className="btn btn-primary" onClick={() => router.push("/dashboard")}>Ir al panel</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Conviértete en Coach</h1>
            <p className={styles.subtitle}>
              Comparte tu experiencia y ayuda a otros jugadores a mejorar. Gana dinero haciendo lo que te apasiona.
            </p>
          </div>

          {/* Progress bar */}
          <div className={styles.progressBar}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`${styles.progressStep} ${s <= step ? styles.progressStepActive : ""} ${s < step ? styles.progressStepDone : ""}`}>
                <div className={styles.progressDot}>{s < step ? "✓" : s}</div>
                <span className={styles.progressLabel}>
                  {s === 1 ? "Perfil" : s === 2 ? "Juego" : s === 3 ? "Bio" : "Coaching"}
                </span>
              </div>
            ))}
          </div>

          <div className={`glass-card ${styles.formCard}`}>
            {error && <div className={styles.error}>{error}</div>}

            {/* Step 1: Personal info */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>👤 Información personal</h2>

                <div className={styles.avatarUpload}>
                  <label htmlFor="avatar-upload" className={styles.avatarLabel}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className={styles.avatarImg} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <span>📷</span>
                        <span>Subir foto</span>
                      </div>
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                  <span className={styles.avatarHint}>Max 5MB · JPG, PNG o WebP</span>
                </div>

                <div className={styles.field}>
                  <label>Nombre de coach *</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Tu nombre artístico o gamertag"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label>País *</label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className={styles.select}
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Idiomas *</label>
                  <div className={styles.chipGroup}>
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        className={`${styles.chip} ${selectedLanguages.includes(lang) ? styles.chipActive : ""}`}
                        onClick={() => toggleLanguage(lang)}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Game info */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>🎮 Información del juego</h2>

                <div className={styles.field}>
                  <label>Juego *</label>
                  <div className={styles.chipGroup}>
                    {GAMES.map(g => (
                      <button
                        key={g.id}
                        type="button"
                        className={`${styles.chip} ${styles.chipLg} ${gameId === g.id ? styles.chipActive : ""}`}
                        onClick={() => setGameId(g.id)}
                      >
                        {g.icon} {g.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Nombre en el juego (Riot ID) *</label>
                  <input
                    type="text"
                    value={inGameName}
                    onChange={e => setInGameName(e.target.value)}
                    placeholder="Player#EUW"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label>Rango actual *</label>
                  <select
                    value={rank}
                    onChange={e => setRank(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Selecciona tu rango</option>
                    {RANKS.map(r => (
                      <option key={r.value} value={r.value}>{r.value}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Roles principales *</label>
                  <div className={styles.chipGroup}>
                    {ROLES.map(r => (
                      <button
                        key={r.id}
                        type="button"
                        className={`${styles.chip} ${selectedRoles.includes(r.id) ? styles.chipActive : ""}`}
                        onClick={() => toggleRole(r.id)}
                      >
                        {r.icon} {r.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Especialidades <span className={styles.hint}>(separadas por coma)</span></label>
                  <input
                    type="text"
                    value={specialties}
                    onChange={e => setSpecialties(e.target.value)}
                    placeholder="Macro, Wave Management, Roaming..."
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label>Campeones principales <span className={styles.hint}>(separados por coma)</span></label>
                  <input
                    type="text"
                    value={champions}
                    onChange={e => setChampions(e.target.value)}
                    placeholder="Azir, Orianna, Viktor..."
                    className={styles.input}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Bio */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>📝 Sobre ti</h2>

                <div className={styles.field}>
                  <label>Bio corta * <span className={styles.hint}>(se muestra en la tarjeta)</span></label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Resume tu experiencia en 1-2 frases..."
                    className={styles.textarea}
                    rows={3}
                    maxLength={200}
                  />
                  <span className={styles.charCount}>{bio.length}/200</span>
                </div>

                <div className={styles.field}>
                  <label>Descripción completa <span className={styles.hint}>(se muestra en tu perfil)</span></label>
                  <textarea
                    value={longBio}
                    onChange={e => setLongBio(e.target.value)}
                    placeholder="Cuéntales a tus futuros alumnos tu historia, tu experiencia competitiva, tu filosofía de coaching..."
                    className={styles.textarea}
                    rows={8}
                    maxLength={2000}
                  />
                  <span className={styles.charCount}>{longBio.length}/2000</span>
                </div>
              </div>
            )}

            {/* Step 4: Coaching types & pricing */}
            {step === 4 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>💰 Tipos de coaching y precios</h2>
                <p className={styles.stepDesc}>
                  Activa los tipos de coaching que quieras ofrecer y establece tus precios. La plataforma añadirá una comisión del {((parseFloat(process.env.NEXT_PUBLIC_COMMISSION_RATE || "0.05")) * 100).toFixed(0) || "5"}% al precio que marques.
                </p>

                <div className={styles.coachingTypesList}>
                  {COACHING_TYPES.map(ct => {
                    const isActive = selectedCoachingTypes.includes(ct.id);
                    const priceMap: Record<string, [string, (v: string) => void]> = {
                      live_coaching: [liveCoachingPrice, setLiveCoachingPrice],
                      vod_review: [vodReviewPrice, setVodReviewPrice],
                      duo_coaching: [duoCoachingPrice, setDuoCoachingPrice],
                      champion_specific: [championSpecificPrice, setChampionSpecificPrice],
                      group_coaching: [groupCoachingPrice, setGroupCoachingPrice],
                    };
                    const [price, setPrice] = priceMap[ct.id];

                    return (
                      <div key={ct.id} className={`${styles.coachingTypeCard} ${isActive ? styles.coachingTypeActive : ""}`}>
                        <div className={styles.coachingTypeHeader}>
                          <button
                            type="button"
                            className={`${styles.coachingTypeToggle} ${isActive ? styles.coachingTypeToggleOn : ""}`}
                            onClick={() => toggleCoachingType(ct.id)}
                          >
                            <span className={styles.toggleKnob} />
                          </button>
                          <div>
                            <span className={styles.coachingTypeName}>{ct.icon} {ct.name}</span>
                            <span className={styles.coachingTypeDesc}>{ct.desc}</span>
                          </div>
                        </div>
                        {isActive && (
                          <div className={styles.priceInput}>
                            <span className={styles.priceLabel}>Tu precio:</span>
                            <div className={styles.priceField}>
                              <input
                                type="number"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                min="5"
                                max="500"
                                className={styles.priceNumber}
                              />
                              <span className={styles.priceCurrency}>€</span>
                            </div>
                            {ct.id === "group_coaching" && (
                              <span className={styles.priceHint}>Precio por equipo completo (5 jugadores)</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className={styles.actions}>
              {step > 1 && (
                <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
                  ← Anterior
                </button>
              )}
              <div style={{ flex: 1 }} />
              {step < 4 ? (
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Siguiente →
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Enviando..." : "🚀 Enviar solicitud"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
