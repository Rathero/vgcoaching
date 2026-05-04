"use client";
import Link from "next/link";
import styles from "./coach-landing.module.css";

const benefits = [
  {
    icon: "💰",
    title: "Tú pones el precio",
    description:
      "Define tus tarifas libremente. Sin topes, sin restricciones. Cada sesión se paga directamente a tu cuenta vía Stripe. Cobras lo que vales.",
  },
  {
    icon: "📅",
    title: "Tú decides tu horario",
    description:
      "Sin horarios fijos ni compromisos mínimos. Abre los huecos que quieras, cuando quieras. Compatible con tu trabajo, tus estudios o tu stream.",
  },
  {
    icon: "🚀",
    title: "Cero gestión, todo resuelto",
    description:
      "Olvidate de cobrar, facturar, buscar alumnos o gestionar calendarios. Nosotros nos encargamos de toda la operativa para que tú solo tengas que enseñar.",
  },
  {
    icon: "📹",
    title: "Videollamada integrada",
    description:
      "Sala de coaching privada con vídeo, audio y compartir pantalla incluido. Sin instalar nada, sin links de Zoom. Todo dentro de Dargog.",
  },
  {
    icon: "📊",
    title: "Tu perfil profesional",
    description:
      "Perfil verificado con tu rango, especialidades, valoraciones de alumnos y estadísticas. Construye tu reputación como coach de referencia.",
  },
  {
    icon: "👥",
    title: "Coaching individual y grupal",
    description:
      "Ofrece sesiones 1 a 1, dúos o coaching de equipo completo. Más formatos = más ingresos. Tú eliges lo que encaje contigo.",
  },
];

const painPoints = [
  {
    icon: "😩",
    title: "Buscas alumnos por Discord y no llegan",
    text: "Publicar en servidores y redes sin resultado es agotador. En Dargog los alumnos te encuentran a ti.",
  },
  {
    icon: "🤯",
    title: "Cobrar es un caos",
    text: "PayPal, Bizum, transferencias… y cuando no pagan, pierdes el tiempo. Con Dargog el pago está garantizado antes de la sesión.",
  },
  {
    icon: "⏰",
    title: "Organizarte te quita más tiempo que enseñar",
    text: "Cuadrar horarios por DM, cancelaciones de última hora, no-shows. Nuestro sistema de reservas lo automatiza todo.",
  },
  {
    icon: "🔒",
    title: "No tienes una plataforma profesional",
    text: "Sin perfil, sin valoraciones, sin credibilidad online. En Dargog tienes un perfil verificado que genera confianza al instante.",
  },
];

const howItWorks = [
  {
    num: "01",
    title: "Crea tu perfil",
    text: "Rellena tu solicitud con tu rango, roles, especialidades y precios. Nuestro equipo lo verifica en 24-48h.",
  },
  {
    num: "02",
    title: "Recibe reservas",
    text: "Los alumnos te encuentran en el marketplace, ven tus valoraciones y reservan directamente. Sin intermediarios.",
  },
  {
    num: "03",
    title: "Da tu sesión",
    text: "Entra a la sala de coaching integrada a la hora acordada. Comparte pantalla, analiza replays y enseña como un pro.",
  },
  {
    num: "04",
    title: "Cobra automáticamente",
    text: "El pago se procesa al reservar. El dinero llega a tu cuenta de Stripe. Sin perseguir a nadie.",
  },
];

const stats = [
  { value: "0%", label: "Inversión inicial" },
  { value: "5%", label: "Comisión por sesión" },
  { value: "24h", label: "Verificación de perfil" },
  { value: "100%", label: "Control de tus precios" },
];

const faqs = [
  {
    q: "¿Qué rango necesito para ser coach?",
    a: "Actualmente aceptamos coaches de Diamante IV o superior. Si tienes experiencia competitiva demostrable, también podemos valorarlo.",
  },
  {
    q: "¿Cuánto cobra Dargog de comisión?",
    a: "Solo un 5% por sesión completada. No hay cuotas mensuales, ni costes fijos, ni costes ocultos. Si no das sesiones, no pagas nada.",
  },
  {
    q: "¿Puedo ser coach si ya trabajo o estudio?",
    a: "¡Por supuesto! Tú decides cuándo abrir huecos. Puedes ofrecer 2 horas a la semana o 40. Sin compromisos mínimos.",
  },
  {
    q: "¿Cómo cobro mis sesiones?",
    a: "A través de Stripe. Conectas tu cuenta y el dinero de cada sesión se transfiere automáticamente. Sin facturas, sin perseguir a alumnos.",
  },
  {
    q: "¿Necesito experiencia previa como coach?",
    a: "No es obligatorio, pero sí valoramos la capacidad de comunicar y enseñar. Si tienes buen rango y ganas de ayudar, te queremos en Dargog.",
  },
  {
    q: "¿Qué herramientas tengo disponibles?",
    a: "Videollamada integrada con compartir pantalla, sistema de materiales para subir guías y notas, y un panel completo con historial de sesiones y valoraciones.",
  },
];

export default function CoachLanding() {
  return (
    <div className={styles.page}>
      {/* ─── Top Bar ─── */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <Link href="/" className={styles.logo}>
            Dar<strong>gog</strong>
          </Link>
          <Link href="/become-coach" className={styles.topCta}>
            Solicitar acceso
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO                                           */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGlow2} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Programa para coaches
          </div>
          <h1 className={styles.heroTitle}>
            Monetiza tu talento.
            <br />
            <span className={styles.heroHighlight}>Enséñales a ganar.</span>
          </h1>
          <p className={styles.heroSub}>
            Convierte tus horas de juego en ingresos reales. Dargog te da los
            alumnos, las herramientas y la plataforma. Tú solo tienes que
            enseñar lo que ya sabes.
          </p>
          <div className={styles.heroActions}>
            <Link href="/become-coach" className={styles.heroCta}>
              Quiero ser coach →
            </Link>
            <a href="#como-funciona" className={styles.heroCtaSecondary}>
              Cómo funciona
            </a>
          </div>
          <p className={styles.heroNote}>
            Sin inversión · Sin cuotas · Comisión solo del 5%
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* PAIN POINTS                                    */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.painSection}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>El problema</span>
          <h2 className={styles.sectionTitle}>
            Ser coach hoy{" "}
            <span className={styles.highlight}>es un dolor de cabeza</span>
          </h2>
          <p className={styles.sectionSub}>
            Si ya has intentado dar coaching sabrás que lo difícil no es
            enseñar, sino todo lo demás.
          </p>
          <div className={styles.painGrid}>
            {painPoints.map((p, i) => (
              <div
                key={i}
                className={styles.painCard}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className={styles.painIcon}>{p.icon}</span>
                <h3 className={styles.painCardTitle}>{p.title}</h3>
                <p className={styles.painCardText}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* BENEFITS                                       */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>La solución</span>
          <h2 className={styles.sectionTitle}>
            Todo lo que necesitas,{" "}
            <span className={styles.highlightSecondary}>en un solo lugar</span>
          </h2>
          <p className={styles.sectionSub}>
            Dargog se encarga de todo lo que no es enseñar para que tú te
            centres en lo que mejor sabes hacer.
          </p>
          <div className={styles.benefitsGrid}>
            {benefits.map((b, i) => (
              <div
                key={i}
                className={styles.benefitCard}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={styles.benefitIcon}>{b.icon}</div>
                <h3 className={styles.benefitTitle}>{b.title}</h3>
                <p className={styles.benefitDesc}>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* STATS BAR                                      */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {stats.map((s, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* HOW IT WORKS                                   */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.howSection} id="como-funciona">
        <div className={styles.container}>
          <span className={styles.sectionLabel}>Cómo funciona</span>
          <h2 className={styles.sectionTitle}>
            De 0 a coach{" "}
            <span className={styles.highlight}>en 4 pasos</span>
          </h2>
          <div className={styles.stepsGrid}>
            {howItWorks.map((s, i) => (
              <div
                key={i}
                className={styles.stepCard}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={styles.stepNum}>{s.num}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepText}>{s.text}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className={styles.stepConnector} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* WHAT COACHES SAY (Social proof)                */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.socialSection}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>Lo que valoran nuestros coaches</span>
          <h2 className={styles.sectionTitle}>
            Diseñado{" "}
            <span className={styles.highlightSecondary}>para ti</span>
          </h2>
          <div className={styles.socialGrid}>
            <div className={styles.socialCard}>
              <p className={styles.socialQuote}>
                &ldquo;Antes perdía horas buscando alumnos en Discord. Ahora
                las reservas me llegan solas y cobro al instante.&rdquo;
              </p>
              <div className={styles.socialAuthor}>
                <span className={styles.socialName}>Coach verificado</span>
                <span className={styles.socialMeta}>Diamond I · Mid</span>
              </div>
            </div>
            <div className={styles.socialCard}>
              <p className={styles.socialQuote}>
                &ldquo;La sala de coaching es brutal. Compartir pantalla, revisar
                replays… todo integrado sin abrir otras apps.&rdquo;
              </p>
              <div className={styles.socialAuthor}>
                <span className={styles.socialName}>Coach verificado</span>
                <span className={styles.socialMeta}>Master · Jungle</span>
              </div>
            </div>
            <div className={styles.socialCard}>
              <p className={styles.socialQuote}>
                &ldquo;Lo mejor es que puedo compaginar el coaching con mi
                trabajo sin problemas. Abro huecos cuando me viene bien.&rdquo;
              </p>
              <div className={styles.socialAuthor}>
                <span className={styles.socialName}>Coach verificado</span>
                <span className={styles.socialMeta}>Grandmaster · ADC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FAQ                                            */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>Preguntas frecuentes</span>
          <h2 className={styles.sectionTitle}>
            Resolvemos{" "}
            <span className={styles.highlight}>tus dudas</span>
          </h2>
          <div className={styles.faqGrid}>
            {faqs.map((f, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{f.q}</summary>
                <p className={styles.faqAnswer}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FINAL CTA                                      */}
      {/* ═══════════════════════════════════════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>
              Tu conocimiento tiene valor.
              <br />
              <span className={styles.heroHighlight}>Empieza a cobrarlo.</span>
            </h2>
            <p className={styles.ctaSub}>
              Únete a Dargog, crea tu perfil de coach y empieza a recibir
              alumnos esta misma semana. Sin inversión, sin riesgo, sin
              excusas.
            </p>
            <Link href="/become-coach" className={styles.ctaButton}>
              🚀 Solicitar acceso como coach
            </Link>
            <p className={styles.ctaNote}>
              Sin cuotas mensuales · Solo 5% por sesión · Cancela cuando quieras
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Dargog · Todos los derechos reservados</span>
      </footer>
    </div>
  );
}
