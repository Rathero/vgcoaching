/**
 * Seed coach: sol1xd (LoL Challenger)
 * Run: npx tsx src/scripts/seed-sol1xd.ts
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("❌ ADMIN_SERVICE_ACCOUNT_KEY missing"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "seed-sol1xd");
const db = getFirestore(app);

const COACH_ID = "sol1xd";

const coach = {
  slug: "sol1xd",
  displayName: "Sol1XD",
  avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/bc8f05ce-3c84-4df3-89b9-d1c4ee5b55e7-profile_image-70x70.png",
  bio: "challenger best gwen world (｡•̀ᴗ-)✂✧",
  longBio: "challenger best gwen world (｡•̀ᴗ-)✂✧",
  country: "ES",
  countryFlag: "🇪🇸",
  languages: ["Español", "Inglés"],
  verified: true,
  listed: false,
  ratingAvg: 0,
  totalSessions: 0,
  totalStudents: 0,
  eloUpRate: 0,
  twitchUsername: "sol1xd",
  instagramUsername: "sol1xd",
  twitterUsername: "S1XD6XX",
  galleryImages: [
    "https://i.ytimg.com/vi/xn3lJMiyS-c/hqdefault.jpg",
    "https://i.ytimg.com/vi/qsGzYagxFWU/maxresdefault.jpg",
  ],
  createdAt: new Date().toISOString(),
};

const coachGame = {
  coachId: COACH_ID,
  gameId: "lol",
  rank: "Challenger",
  rankTier: "challenger",
  roles: [
    { id: "mid", name: "Mid", icon: "⚔️" },
    { id: "top", name: "Top", icon: "🗡️" },
  ],
  specialties: ["Asesinos", "SplitPush", "SoloQueue"],
  champions: ["Gwen", "Katarina"],
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
  console.log("🌱 Seeding sol1xd...\n");

  await db.collection("coaches").doc(COACH_ID).set(coach);
  console.log(`  ✅ Coach: ${coach.displayName}`);

  await db.collection("coachGames").add(coachGame);
  console.log("  ✅ CoachGame (LoL)");

  for (const opt of coachingOptions) {
    await db.collection("coachingOptions").add(opt);
    console.log(`  ✅ CoachingOption: ${opt.name} (${opt.durationMinutes}min - ${opt.priceCents / 100}€)`);
  }

  console.log("\n✅ Done! sol1xd added to the database.");
  console.log("  listed: false (no aparece en listados públicos)");
  console.log("  URL: /games/league-of-legends/coach/sol1xd");
}

run().catch(console.error);
