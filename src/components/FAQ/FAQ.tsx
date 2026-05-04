"use client";
import { useState } from "react";
import styles from "./FAQ.module.css";

const faqs = [
  {
    question: "¿Es legal contratar un coach de videojuegos?",
    answer:
      "Sí, al 100%. El coaching de videojuegos es completamente legal y está reconocido por la industria. No modificamos archivos del juego, no usamos hacks ni scripts. Nuestros coaches te enseñan a mejorar tus habilidades y tu comprensión del juego, exactamente igual que un entrenador de cualquier otro deporte. Empresas como Riot Games fomentan activamente el coaching como parte del ecosistema competitivo.",
  },
  {
    question: "¿Qué pasa si el coach no me convence?",
    answer:
      "Cada coach tiene un perfil público con valoraciones reales de otros alumnos, así que puedes tomar una decisión informada antes de reservar. Si tras tu sesión sientes que la experiencia no fue la esperada, puedes dejar tu valoración honesta para ayudar a otros jugadores. Nuestro sistema de reputación incentiva a los coaches a dar siempre lo mejor de sí mismos, y aquellos con valoraciones bajas dejan de ser recomendados.",
  },
  {
    question: "¿Cómo sé qué coach es el adecuado para mi nivel?",
    answer:
      "Cada coach tiene un perfil detallado con su rango, roles que domina, especialidades y campeones favoritos. Puedes filtrar por rol, rango y especialidad para encontrar al coach perfecto para ti. Tenemos coaches especializados en todos los niveles: desde iniciación para jugadores que quieren salir de Iron/Bronce, hasta nivel semiprofesional para jugadores Diamond+ que buscan llegar a Challenger. Lee las reviews de otros alumnos con niveles similares al tuyo para elegir mejor.",
  },
  {
    question: "¿Cómo funciona el precio? ¿Hay comisiones ocultas?",
    answer:
      "Total transparencia. El precio que ves en el perfil del coach es lo que él cobra por la sesión. Al reservar, se añade una pequeña comisión de plataforma (5%) que cubre los costes de infraestructura, pasarela de pago y soporte. Verás el desglose completo antes de pagar: precio del coach + comisión = total. Sin sorpresas, sin letra pequeña.",
  },
  {
    question: "¿Qué incluye una sesión de coaching?",
    answer:
      "Depende del tipo de sesión que reserves. En una sesión de Coaching en Vivo, el coach te observa jugar en tiempo real y te da feedback instantáneo. En un VOD Review, el coach analiza una partida grabada tuya y te explica errores y mejoras con calma. Todas las sesiones se realizan a través de nuestra plataforma con videollamada integrada, y muchos coaches comparten materiales adicionales tras la sesión.",
  },
  {
    question: "¿Puedo cancelar o reprogramar una sesión?",
    answer:
      "Sí. Puedes cancelar o reprogramar tu sesión desde tu panel de control antes de que comience. Entendemos que los imprevistos existen, y queremos que tu experiencia sea lo más flexible posible.",
  },
  {
    question: "¿Los coaches son verificados?",
    answer:
      "Sí. Todos nuestros coaches pasan por un proceso de verificación donde comprobamos su rango, experiencia y credenciales. Los coaches con el badge de verificado (✓) han demostrado su identidad y rango de forma verificable. Además, nuestro sistema de valoraciones por alumnos reales garantiza que solo los mejores coaches se mantienen activos en la plataforma.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className={styles.section} id="faq">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Preguntas frecuentes</span>
          <h2 className={styles.sectionTitle}>
            Resolvemos tus <span className="gradient-text">dudas</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Todo lo que necesitas saber antes de empezar a mejorar tu juego con
            un coach profesional.
          </p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`${styles.faqItem} ${openIndex === i ? styles.faqItemOpen : ""}`}
            >
              <button className={styles.faqQuestion} onClick={() => toggle(i)}>
                <span>{faq.question}</span>
                <span className={styles.faqIcon}>
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              <div
                className={styles.faqAnswerWrap}
                style={{
                  maxHeight: openIndex === i ? "500px" : "0",
                }}
              >
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
