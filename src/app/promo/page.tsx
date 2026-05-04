import type { Metadata } from "next";
import PromoLanding from "./PromoLanding";

export const metadata: Metadata = {
  title: "Mejora tu elo con un coach profesional — Dargog",
  description:
    "Entrena 1 a 1 con jugadores profesionales y ex-competidores de League of Legends. Coaching personalizado para subir de elo de verdad.",
};

export default function PromoPage() {
  return <PromoLanding />;
}
