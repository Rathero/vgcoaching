/**
 * Reset ALL coaches and seed Attila as the first real coach.
 * Run: npx tsx src/scripts/reset-and-seed-attila.ts
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("❌ ADMIN_SERVICE_ACCOUNT_KEY missing"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "reset-seed");
const db = getFirestore(app);

// ─── Step 1: Delete ALL docs from coach-related collections ─────────
async function deleteAll(collection: string) {
  const snap = await db.collection(collection).get();
  if (snap.empty) {
    console.log(`  ⏭️  ${collection}: already empty`);
    return;
  }
  const batch = db.batch();
  snap.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log(`  🗑️  ${collection}: deleted ${snap.size} docs`);
}

// ─── Step 2: Seed Attila ────────────────────────────────────────────
const coach = {
  slug: "attila",
  displayName: "Attila",
  avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFY_3qXWGJTZij9qfyab6gaFJmNLKe4x06oQ&s",
  bio: "Jugador profesional de League of Legends de Giants. Peak elo top 10 EUW.",
  longBio: `¿De dónde eres?\nHe nacido en Portugal aunque me he criado en Barcelona durante 12 años.\n\n¿Cuántos años tienes?\nActualmente tengo 29 años.\n\n¿Peak elo?\nHe conseguido estar en el top 10 en varias ocasiones, aunque nunca he llegado a ser top 1.\n\n¿Jugabas a algún videojuego antes de jugar League of Legends?\nLeague of Legends fue el primer videojuego que jugué en el ordenador. Antes solía jugar a los clásicos juegos de consola.\n\n¿En qué trabajas?\nActualmente soy jugador profesional de League of Legends.\n\n¿Quién contesta tus preguntas en el chat?\nYo mismo las contestaré siempre y cuando no esté ocupado con alguna labor. Las preguntas más básicas y repetidas suelen tener un comando o los moderadores son capaces de responderlas sin ningún tipo de problema.`,
  country: "ES",
  countryFlag: "🇪🇸",
  languages: ["Español", "Inglés"],
  verified: true,
  listed: false,
  ratingAvg: 0,
  totalSessions: 0,
  totalStudents: 0,
  eloUpRate: 0,
  createdAt: new Date().toISOString(),
};

const coachGame = {
  coachId: "attila",
  gameId: "lol",
  rank: "Challenger",
  rankTier: "challenger",
  roles: [
    { id: "support", name: "Support", icon: "🛡️" },
    { id: "adc", name: "ADC", icon: "🏹" },
  ],
  specialties: ["Macro", "Communication", "Support", "Decision Making"],
  champions: ["Nami", "Seraphine", "Bardo"],
};

const coachingOptions = [
  {
    coachId: "attila",
    gameId: "lol",
    type: "live_coaching",
    name: "Coaching en Vivo",
    description: "Sesión 1 a 1 en tiempo real. Te observo jugar y te doy feedback instantáneo.",
    durationMinutes: 75,
    priceCents: 4000, // 40€
    active: true,
  },
  {
    coachId: "attila",
    gameId: "lol",
    type: "vod_review",
    name: "VOD Review",
    description: "Analizo una replay tuya en detalle con soluciones claras y accionables.",
    durationMinutes: 75,
    priceCents: 4000, // 40€
    active: true,
  },
];

// All days (0=Sun through 6=Sat), 16:00–00:00, Europe/Madrid
const availability = [0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => ({
  coachId: "attila",
  dayOfWeek,
  startTime: "16:00",
  endTime: "00:00",
  timezone: "Europe/Madrid",
}));

async function run() {
  console.log("🧹 Step 1: Deleting ALL existing coach data...\n");

  await deleteAll("coaches");
  await deleteAll("coachGames");
  await deleteAll("coachingOptions");
  await deleteAll("availability");
  await deleteAll("reviews");

  console.log("\n🌱 Step 2: Seeding Attila...\n");

  // Coach document
  await db.collection("coaches").doc("attila").set(coach);
  console.log(`  ✅ Coach: ${coach.displayName}`);

  // CoachGame
  await db.collection("coachGames").add(coachGame);
  console.log("  ✅ CoachGame (LoL)");

  // Coaching options
  for (const opt of coachingOptions) {
    await db.collection("coachingOptions").add(opt);
    console.log(`  ✅ CoachingOption: ${opt.name} (${opt.durationMinutes}min - ${opt.priceCents / 100}€)`);
  }

  // Availability
  for (const slot of availability) {
    await db.collection("availability").add(slot);
  }
  console.log(`  ✅ ${availability.length} availability slots (todos los días 16:00-00:00)`);

  console.log("\n✅ Done! Attila is the only coach in the database.");
  console.log("  listed: false (no aparece en listados públicos)");
  console.log("  URL: https://videogamecoaching-a4794.web.app/games/league-of-legends/coach/attila");
}

run().catch(console.error);
