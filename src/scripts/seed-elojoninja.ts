/**
 * Seed coach: elojoninja (LoL Challenger Jungler)
 * Run: npx tsx src/scripts/seed-elojoninja.ts
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("❌ ADMIN_SERVICE_ACCOUNT_KEY missing"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "seed-elojoninja");
const db = getFirestore(app);

const COACH_ID = "elojoninja";

const coach = {
  slug: "elojoninja",
  displayName: "ElOjoNinja",
  avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/f71771c0-e21b-41fd-bc8e-4b280cbd9fc3-profile_image-70x70.png",
  bio: "Soy Dani (o ElOjoNinja) y en stream trato de explicar de la forma más didáctica posible mis partidas en mi rol, la Jungla. Me puedes encontrar en mis otras redes en los links de la derecha. Por cierto, hoy no es mi cumpleaños.",
  longBio: "Soy Dani (o ElOjoNinja) y en stream trato de explicar de la forma más didáctica posible mis partidas en mi rol, la Jungla. Me puedes encontrar en mis otras redes en los links de la derecha. Por cierto, hoy no es mi cumpleaños.",
  country: "ES",
  countryFlag: "🇪🇸",
  languages: ["Español", "Inglés"],
  verified: true,
  listed: false,
  ratingAvg: 0,
  totalSessions: 0,
  totalStudents: 0,
  eloUpRate: 0,
  instagramUsername: "elojoninja",
  twitterUsername: "ElOjoNinja",
  youtubeChannel: "UCtU5YaiBnanZC47u1MVOD6Q",
  galleryImages: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRRh-ZivG9dfunuF-k-D5X235BLt34ufh6VQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZhYoNC92hx2OlMO6M12WPUK1SOVHAgwG5Fg&s",
    "https://api.setupsgamers.com/images/streamers/elojoninja.jpg",
    "https://i.ytimg.com/vi/0PlrSx5LFsI/maxresdefault.jpg",
  ],
  createdAt: new Date().toISOString(),
};

const coachGame = {
  coachId: COACH_ID,
  gameId: "lol",
  rank: "Challenger",
  rankTier: "challenger",
  roles: [
    { id: "jungle", name: "Jungle", icon: "🌲" },
  ],
  specialties: ["Invade", "Power Farming", "Carry"],
  champions: ["Gragas", "Lee Sin"],
};

const coachingOptions = [
  {
    coachId: COACH_ID,
    gameId: "lol",
    type: "live_coaching",
    name: "Coaching en Vivo",
    description: "Sesión 1 a 1 en tiempo real. Te observo jugar y te doy feedback instantáneo.",
    durationMinutes: 60,
    priceCents: 5000,
    active: true,
  },
  {
    coachId: COACH_ID,
    gameId: "lol",
    type: "vod_review",
    name: "VOD Review",
    description: "Analizo una replay tuya en detalle con soluciones claras y accionables.",
    durationMinutes: 60,
    priceCents: 5000,
    active: true,
  },
];

async function run() {
  console.log("🌱 Seeding elojoninja...\n");

  await db.collection("coaches").doc(COACH_ID).set(coach);
  console.log(`  ✅ Coach: ${coach.displayName}`);

  await db.collection("coachGames").add(coachGame);
  console.log("  ✅ CoachGame (LoL - Jungle)");

  for (const opt of coachingOptions) {
    await db.collection("coachingOptions").add(opt);
    console.log(`  ✅ CoachingOption: ${opt.name} (${opt.durationMinutes}min - ${opt.priceCents / 100}€)`);
  }

  console.log("\n✅ Done! ElOjoNinja added to the database.");
  console.log("  listed: false");
  console.log("  URL: /games/league-of-legends/coach/elojoninja");
}

run().catch(console.error);
