import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import CoachFilters from "@/components/CoachFilters/CoachFilters";
import CoachRequestCTA from "@/components/CoachRequestCTA/CoachRequestCTA";
import { getGame, getCoachesByGame, getCoachOptions, getMinPrice } from "@/lib/firestore";

export default async function GamePage(props: PageProps<"/games/[slug]">) {
  const { slug } = await props.params;
  const game = await getGame(slug);
  if (!game) notFound();

  // If the game is inactive, show a "coming soon" page
  if (!game.active) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: "calc(var(--navbar-height) + var(--space-3xl))", minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
          <div className="glass-card" style={{ maxWidth: "500px", width: "100%", padding: "var(--space-2xl)", textAlign: "center", margin: "0 var(--space-lg)" }}>
            <span style={{ fontSize: "4rem", display: "block", marginBottom: "var(--space-lg)" }}>{game.icon}</span>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "var(--space-sm)" }}>{game.name}</h1>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)", lineHeight: 1.6 }}>
              Estamos trabajando para traerte los mejores coaches de {game.name}. ¡Pronto estará disponible!
            </p>
            <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: "var(--radius-full)", background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "var(--space-xl)" }}>
              🚧 Próximamente
            </div>
            <div style={{ marginTop: "var(--space-lg)" }}>
              <Link href="/games" className="btn btn-primary">Ver juegos disponibles</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const coachesRaw = await getCoachesByGame(game.id);

  const coaches = await Promise.all(
    coachesRaw.map(async ({ coach, gameData }) => {
      const options = await getCoachOptions(coach.id);
      return { coach, gameData, minPrice: getMinPrice(options) };
    })
  );

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "calc(var(--navbar-height) + var(--space-xl))", minHeight: "100vh" }}>
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 var(--space-lg)" }}>
          <div style={{ marginBottom: "var(--space-2xl)" }}>
            <Link href="/games" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "var(--space-lg)", textDecoration: "none" }}>
              ← Todos los juegos
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-sm)" }}>
              <span style={{ fontSize: "2rem" }}>{game.icon}</span>
              <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700 }}>Coaches de {game.name}</h1>
            </div>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Encuentra al coach perfecto para tu estilo de juego. Filtra por línea, rango y especialidad.
            </p>
          </div>
          <CoachFilters coaches={coaches} gameSlug={slug} />
          <CoachRequestCTA gameSlug={slug} />
        </div>
      </div>
      <Footer />
    </>
  );
}
