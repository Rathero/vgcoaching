"use client";
import { useState } from "react";
import styles from "./promo.module.css";

const painPoints = [
  {
    icon: "😤",
    title: "¿Pierdes partidas que deberías ganar?",
    text: "Errores de macro, mala gestión de oleadas y decisiones tardías te cuestan LP cada día sin que te des cuenta.",
  },
  {
    icon: "📉",
    title: "¿Estancado en el mismo rango meses?",
    text: "Jugar más no es la solución. Sin un plan de mejora real, repites los mismos errores una y otra vez.",
  },
  {
    icon: "🎲",
    title: "¿Dependes de tu equipo para ganar?",
    text: "Cuando no sabes llevar la partida, cada SoloQ se convierte en una lotería. Es hora de marcar la diferencia tú.",
  },
];

const steps = [
  { num: "1", icon: "🔍", title: "Elige tu coach", text: "Filtra por rango, rol y especialidad. Todos verificados." },
  { num: "2", icon: "📅", title: "Reserva sesión", text: "Elige horario y tipo de coaching. Sin compromisos." },
  { num: "3", icon: "🚀", title: "Sube de elo", text: "Recibe feedback personalizado y mejora desde la primera sesión." },
];

const testimonials = [
  {
    text: "De Oro IV a Platino I en 3 semanas. Mi coach me hizo ver errores que ni sabía que cometía.",
    name: "Carlos M.",
    meta: "Mid main",
    rankFrom: "Oro IV",
    rankTo: "Platino I",
  },
  {
    text: "Llevaba 2 años estancado en Plata. En 5 sesiones subí a Oro III. Ahora entiendo POR QUÉ hago lo que hago.",
    name: "Lucía R.",
    meta: "Jungle main",
    rankFrom: "Plata II",
    rankTo: "Oro III",
  },
  {
    text: "Mi coach me enseñó a leer el mapa y a tomar decisiones macro. El elo vino solo.",
    name: "Andrés P.",
    meta: "Top main",
    rankFrom: "Platino IV",
    rankTo: "Esmeralda II",
  },
];

export default function PromoLanding() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "promo_landing", name, email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className={styles.page}>
      {/* ─── Minimal Top Bar ─── */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <span className={styles.logo}>🎮 Dar<strong>gog</strong></span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO                                           */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            League of Legends
          </div>
          <h1 className={styles.heroTitle}>
            Deja de perder LP.
            <br />
            <span className={styles.heroHighlight}>Empieza a dominar.</span>
          </h1>
          <p className={styles.heroSub}>
            Entrena 1 a 1 con jugadores profesionales y ex-competidores.
            Coaching personalizado para subir de elo de verdad.
          </p>
          <a href="#cta" className={styles.heroCta}>
            Quiero mejorar ya →
          </a>
          <p className={styles.heroNote}>Sin suscripciones · Paga solo por sesión</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* PAIN POINTS                                    */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.painSection}>
        <div className={styles.container}>
          <h2 className={styles.painTitle}>
            ¿Te suena <span className={styles.highlight}>alguno</span>?
          </h2>
          <div className={styles.painGrid}>
            {painPoints.map((p, i) => (
              <div key={i} className={styles.painCard}>
                <span className={styles.painIcon}>{p.icon}</span>
                <h3 className={styles.painCardTitle}>{p.title}</h3>
                <p className={styles.painCardText}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SOLUTION                                       */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.solutionSection}>
        <div className={styles.container}>
          <div className={styles.solutionHeader}>
            <span className={styles.solutionLabel}>La solución</span>
            <h2 className={styles.solutionTitle}>
              Un coach profesional,{" "}
              <span className={styles.highlight}>a tu lado</span>
            </h2>
            <p className={styles.solutionSub}>
              No más guías genéricas de YouTube. Un profesional que analiza
              TUS partidas, TUS errores y TUS hábitos. Coaching personalizado
              que funciona.
            </p>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((s) => (
              <div key={s.num} className={styles.stepCard}>
                <div className={styles.stepNum}>{s.num}</div>
                <span className={styles.stepIcon}>{s.icon}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SOCIAL PROOF                                   */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.proofSection}>
        <div className={styles.container}>
          <h2 className={styles.proofTitle}>
            Resultados <span className={styles.highlight}>reales</span>
          </h2>
          <div className={styles.proofGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.proofCard}>
                <p className={styles.proofText}>&ldquo;{t.text}&rdquo;</p>
                <div className={styles.proofAuthor}>
                  <div>
                    <div className={styles.proofName}>{t.name}</div>
                    <div className={styles.proofMeta}>{t.meta}</div>
                  </div>
                  <div className={styles.proofRank}>
                    <span className={styles.proofRankFrom}>{t.rankFrom}</span>
                    <span className={styles.proofRankArrow}>→</span>
                    <span className={styles.proofRankTo}>{t.rankTo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FINAL CTA                                      */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.ctaSection} id="cta">
        <div className={styles.ctaGlow} />
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>
              Tu siguiente división
              <br />
              <span className={styles.highlight}>empieza aquí</span>
            </h2>

            {status === "success" ? (
              <div className={styles.ctaSuccess}>
                <span className={styles.ctaSuccessIcon}>🎉</span>
                <h3 className={styles.ctaSuccessTitle}>¡Estás dentro!</h3>
                <p className={styles.ctaSuccessText}>
                  Te hemos apuntado. Recibirás toda la información en tu email.
                </p>
                <a href="/games" className={styles.ctaButton}>
                  Ver coaches disponibles →
                </a>
              </div>
            ) : (
              <>
                <p className={styles.ctaSub}>
                  Déjanos tus datos y te contamos cómo empezar a mejorar hoy mismo.
                  O si lo prefieres, ve directamente a elegir tu coach.
                </p>
                <form className={styles.ctaForm} onSubmit={handleSubmit}>
                  <div className={styles.ctaInputRow}>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.ctaInput}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Tu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.ctaInput}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.ctaSubmit}
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Enviando..." : "Quiero mejorar mi elo"}
                  </button>
                  {status === "error" && (
                    <p className={styles.ctaError}>Error al enviar. Inténtalo de nuevo.</p>
                  )}
                </form>
                <div className={styles.ctaDivider}>
                  <span>o</span>
                </div>
                <a href="/games" className={styles.ctaSecondary}>
                  Ver coaches disponibles →
                </a>
                <p className={styles.ctaNote}>
                  Sin suscripciones · Sin compromiso · Cancela cuando quieras
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── Minimal Footer ─── */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Dargog</span>
      </footer>
    </div>
  );
}
