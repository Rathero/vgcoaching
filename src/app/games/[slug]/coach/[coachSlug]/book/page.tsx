import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import BookingClient from "@/components/BookingClient/BookingClient";
import { getGame, getCoach, getCoachGame, getCoachOptions, getCoachAvailability } from "@/lib/firestore";
import { listCoachBundles } from "@/lib/bundles";

export default async function BookPage(props: PageProps<"/games/[slug]/coach/[coachSlug]/book">) {
  const { slug, coachSlug } = await props.params;
  const game = await getGame(slug);
  if (!game) notFound();
  const coach = await getCoach(coachSlug);
  if (!coach) notFound();
  const gameData = await getCoachGame(coach.id, game.id);
  if (!gameData) notFound();

  const options = await getCoachOptions(coach.id);
  const availability = await getCoachAvailability(coach.id);
  const bundles = await listCoachBundles(coach.id, true);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "calc(var(--navbar-height) + var(--space-xl))", minHeight: "100vh" }}>
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 var(--space-lg)", paddingBottom: "var(--space-3xl)" }}>
          <Link href={`/games/${slug}/coach/${coachSlug}`} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "var(--space-xl)", textDecoration: "none" }}>
            ← Volver al perfil
          </Link>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "4px" }}>Reservar sesión con {coach.displayName}</h1>
          <p style={{ fontSize: "1rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-2xl)" }}>
            Selecciona el tipo de sesión, fecha y hora que mejor te vengan.
          </p>
          <Suspense fallback={<div>Cargando...</div>}>
            <BookingClient coach={coach} gameData={gameData} options={options} availability={availability} gameSlug={slug} bundles={bundles} />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
}
