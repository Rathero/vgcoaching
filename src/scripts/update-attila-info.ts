/**
 * Update Attila's coach info.
 * Run: .\node_modules\.bin\tsx src\scripts\update-attila-info.ts
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("❌ ADMIN_SERVICE_ACCOUNT_KEY missing"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "update-attila");
const db = getFirestore(app);

const COACH_ID = "attila";

const newBio = "Jugador profesional de League of Legends con más de 10 años de experiencia en LEC y Worlds 2018.";

const newLongBio = `Me llamo Amadeu Carvalho aunque me conocen en el mundo de los deportes electrónicos por Attila. Soy un jugador profesional de League of Legends que ha jugado tanto el rol de tirador como el de soporte a nivel profesional durante más de diez años. He tenido bastantes buenos resultados lo cual me ha llevado a estar en la LEC e incluso en los mundiales del 2018. Todo el conocimiento adquirido durante este tiempo me ha llevado a saber guiar a las personas para que lleguen a sus objetivos, sean objetivos sencillos como incluso intentar ser jugadores profesionales. Llevo haciendo coaching hace un tiempo y, por ahora, he tenido muy buenos resultados por lo que espero mantener esa buena racha.`;

async function run() {
  console.log(`🔄 Updating ${COACH_ID} info...\n`);

  // 1. Update coach document
  await db.collection("coaches").doc(COACH_ID).update({
    bio: newBio,
    longBio: newLongBio,
    languages: ["Español", "Inglés", "Francés", "Portugués", "Catalán"],
  });
  console.log("  ✅ Coach doc updated (bio, longBio, languages)");

  // 2. Find and update coachGame document
  const cgSnap = await db.collection("coachGames")
    .where("coachId", "==", COACH_ID)
    .where("gameId", "==", "lol")
    .limit(1).get();

  if (cgSnap.empty) {
    console.error("  ❌ CoachGame not found!");
    return;
  }

  const cgRef = cgSnap.docs[0].ref;
  await cgRef.update({
    roles: [
      { id: "adc", name: "ADC", icon: "🏹" },
      { id: "support", name: "Support", icon: "🛡️" },
    ],
    secondaryRoles: [
      { id: "mid", name: "Mid", icon: "⚔️" },
      { id: "jungle", name: "Jungle", icon: "🌲" },
      { id: "top", name: "Top", icon: "🗡️" },
    ],
    isProPlayer: true,
    specialties: [
      "Macro",
      "Comunicación",
      "Fase de líneas",
      "Decisiones",
      "Competitivo",
      "Adaptación a todos los elos",
      "Enseñanza adaptada a la persona",
    ],
    champions: [],
  });
  console.log("  ✅ CoachGame updated (roles, secondaryRoles, isProPlayer, specialties, champions)");

  console.log(`\n🎉 Done! Attila info updated.`);
  console.log(`  URL: https://dargog.com/games/league-of-legends/coach/${COACH_ID}`);
}

run().catch(console.error);
