/**
 * Seed coach: pablomurox (TFT Challenger)
 * Run: npx tsx src/scripts/seed-pablomurox.ts
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("❌ ADMIN_SERVICE_ACCOUNT_KEY missing"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "seed-pablomurox");
const db = getFirestore(app);

const COACH_ID = "pablomurox";

const coach = {
  slug: "pablomurox",
  displayName: "pablomurox",
  avatar: "https://instagram.fbcn9-1.fna.fbcdn.net/v/t51.2885-19/470894505_552502027619968_482409055657170649_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby44MDAuYzIifQ&_nc_ht=instagram.fbcn9-1.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2gFeuBcJw5idAyuBxKcAPBhP2dvA3mzNBYCHMyIjOqaTc752pU83mAGmv35RnrnpqM4&_nc_ohc=oEit96M5Es4Q7kNvwF6E98s&_nc_gid=eKElkWbK-QHRFqbl-j-bQw&edm=AEYEu-QBAAAA&ccb=7-5&oh=00_Af6Zz0UCEnJbT51YJxKkxl6rGakHl12DxteGvSDlZiDkHA&oe=6A010B08&_nc_sid=ead929",
  bio: "Challenger TFT fundador de TFTClubs",
  longBio: `𝗨𝗡 𝗖𝗛𝗜𝗖𝗢 𝗘𝗫𝗧𝗥𝗢𝗩𝗘𝗥𝗧𝗜𝗗𝗢 𝗤𝗨𝗘 𝗛𝗔 𝗩𝗘𝗡𝗜𝗗𝗢 𝗔𝗤𝗨Í 𝗔 𝗣𝗔𝗦𝗔𝗥𝗟𝗢 𝗕𝗜𝗘𝗡 .𝗠𝗘 𝗥Í𝗢 𝗠𝗨𝗖𝗛𝗢 𝗬 𝗛𝗔𝗚𝗢 𝗠𝗨𝗖𝗛𝗢 𝗘𝗟 𝗧𝗢𝗡𝗧𝗢 (𝗟𝗔 𝗚𝗘𝗡𝗧𝗘 𝗧𝗔𝗠𝗕𝗜É𝗡 𝗦𝗘 𝗥Í𝗘 𝗔 𝗩𝗘𝗖𝗘𝗦)

⚡ 𝗗𝗘 𝗡𝗔𝗧𝗨𝗥𝗔𝗟𝗘𝗭𝗔 𝗣𝗔𝗬𝗔𝗦𝗔 𝗬 𝗔𝗟𝗘𝗚𝗥𝗘, 𝗔 𝗩𝗘𝗖𝗘𝗦 𝗚𝗥𝗜𝗧𝗢 𝗘𝗡 𝗟𝗢𝗦 𝗗𝗜𝗥𝗘𝗖𝗧𝗢𝗦, 𝗦𝗢𝗬 𝗠𝗨𝗬 𝗔𝗨𝗦𝗧𝗔𝗗𝗜𝗭𝗢 𝗣𝗘𝗥𝗢 𝗡𝗢 𝗟𝗘 𝗧𝗘𝗡𝗚𝗢 𝗠𝗜𝗘𝗗𝗢 𝗔 𝗡𝗔𝗗𝗔

⚡𝗦𝗢𝗬 𝗔𝗖𝗧𝗢𝗥 𝗬 𝗠𝗜𝗘𝗡𝗧𝗥𝗔𝗦 𝗡𝗢 𝗧𝗘𝗡𝗚𝗢 𝗘𝗡𝗦𝗔𝗬𝗢𝗦 𝗡𝗜 𝗥𝗢𝗗𝗔𝗝𝗘𝗦 𝗠𝗘 𝗚𝗨𝗦𝗧𝗔 𝗝𝗨𝗚𝗔𝗥 𝗔𝗟 𝗧𝗙𝗧 𝗬 𝗠𝗨𝗖𝗛𝗢𝗦 𝗝𝗨𝗘𝗚𝗢𝗦 𝗠Á𝗦

⚡𝗔𝗤𝗨Í 𝗣𝗨𝗘𝗗𝗘𝗦 𝗘𝗡𝗖𝗢𝗡𝗧𝗥𝗔𝗥 𝗠Á𝗦 𝗖𝗢𝗦𝗔𝗦 𝗗𝗘 𝗧𝗢𝗗𝗢𝗦 𝗠𝗢𝗗𝗢𝗦.

⚡𝗡𝗢𝗦 𝗟𝗟𝗘𝗩𝗔𝗠𝗢𝗦 𝗕𝗜𝗘𝗡 𝗖𝗢𝗡 𝗧𝗢𝗗@𝗦, 𝗗𝗔 𝗜𝗚𝗨𝗔𝗟 𝗗𝗘 𝗗𝗢𝗡𝗗𝗘 𝗦𝗘𝗔𝗦

⭐ 𝔹𝕀𝔼ℕ𝕍𝔼ℕ𝕀𝔻@ ⭐`,
  country: "ES",
  countryFlag: "🇪🇸",
  languages: ["Español", "Inglés"],
  verified: true,
  listed: false,
  ratingAvg: 0,
  totalSessions: 0,
  totalStudents: 0,
  eloUpRate: 0,
  twitchUsername: "pablomurox",
  instagramUsername: "pablomurotv",
  twitterUsername: "PABLOMUR0",
  galleryImages: [
    "https://instagram.fbcn9-1.fna.fbcdn.net/v/t51.82787-15/669604964_17922116991291912_335889381888146112_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=Mzg3MjI2NDQzNTU0NTg5NDQ4OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=QboYQO1JKFQQ7kNvwHbVPNr&_nc_oc=AdoWLPhuPmUxctduorwns3NkOJfryd6ZYDipVsCqVFUl0RvhfgRda48VsJ-eJgZGADk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fbcn9-1.fna&_nc_gid=Vf_7ueeGdjQH0ZYZONJNvw&_nc_ss=7a22e&oh=00_Af43Y3Hd909oiHclqW6L6Zi_u_JuAGgtJKtyS0_QPwPqbg&oe=6A0118F9",
  ],
  createdAt: new Date().toISOString(),
};

const coachGame = {
  coachId: COACH_ID,
  gameId: "tft",
  rank: "Challenger",
  rankTier: "challenger",
  roles: [
    { id: "tft", name: "TFT", icon: "♟️" },
  ],
  specialties: ["Economy", "Reroll"],
  champions: [],
};

const coachingOptions = [
  {
    coachId: COACH_ID,
    gameId: "tft",
    type: "live_coaching",
    name: "Coaching en Vivo",
    description: "Sesión 1 a 1 en tiempo real. Te observo jugar y te doy feedback instantáneo.",
    durationMinutes: 60,
    priceCents: 5000, // 50€
    active: true,
  },
  {
    coachId: COACH_ID,
    gameId: "tft",
    type: "vod_review",
    name: "VOD Review",
    description: "Analizo una replay tuya en detalle con soluciones claras y accionables.",
    durationMinutes: 60,
    priceCents: 5000, // 50€
    active: true,
  },
];

async function run() {
  console.log("🌱 Seeding pablomurox...\n");

  // Coach document
  await db.collection("coaches").doc(COACH_ID).set(coach);
  console.log(`  ✅ Coach: ${coach.displayName}`);

  // CoachGame
  await db.collection("coachGames").add(coachGame);
  console.log("  ✅ CoachGame (TFT)");

  // Coaching options
  for (const opt of coachingOptions) {
    await db.collection("coachingOptions").add(opt);
    console.log(`  ✅ CoachingOption: ${opt.name} (${opt.durationMinutes}min - ${opt.priceCents / 100}€)`);
  }

  console.log("\n✅ Done! pablomurox added to the database.");
  console.log("  listed: false (no aparece en listados públicos)");
  console.log("  game: TFT (Teamfight Tactics)");
  console.log("  URL: /games/teamfight-tactics/coach/pablomurox");
}

run().catch(console.error);
