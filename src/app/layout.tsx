import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "GamesCoaching — Entrena con los mejores pros y sube de elo",
  description:
    "Coaching personalizado 1 a 1 con jugadores profesionales de League of Legends y más. Sube de elo de verdad con sesiones de coaching en vivo, VOD review y más.",
  keywords: [
    "coaching gaming",
    "coaching League of Legends",
    "subir de elo",
    "coach profesional LoL",
    "mejorar en LoL",
    "coaching esports",
  ],
  openGraph: {
    title: "GamesCoaching — Entrena con los mejores pros y sube de elo",
    description:
      "Coaching personalizado 1 a 1 con jugadores profesionales. Sube de elo de verdad.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
