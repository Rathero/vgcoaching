import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "set-availability");
const db = getFirestore(app);

// All coaches
const ALL_COACHES = [
  "attila", "pablomurox", "sol1xd", "elojoninja",
  "maurogarih", "elmiillor", "pochipoom", "manutegaming",
  "xixauxas", "darkololpro", "adnielcoach", "flakked",
  "th3antonio", "miniduke", "supa", "snoodyboo", "koldo", "cor531",
];

// Availability: Tuesday(2), Thursday(4), Saturday(6) — 15:00 to 19:00
const SLOTS = [
  { dayOfWeek: 2, startTime: "15:00", endTime: "19:00" }, // Martes
  { dayOfWeek: 4, startTime: "15:00", endTime: "19:00" }, // Jueves
  { dayOfWeek: 6, startTime: "15:00", endTime: "19:00" }, // Sábado
];

async function run() {
  console.log("📅 Setting availability for all coaches...\n");

  for (const coachId of ALL_COACHES) {
    // Delete existing availability
    const existing = await db.collection("availability").where("coachId", "==", coachId).get();
    const batch = db.batch();
    existing.docs.forEach(d => batch.delete(d.ref));
    if (!existing.empty) await batch.commit();

    // Add new slots
    for (const slot of SLOTS) {
      await db.collection("availability").add({
        coachId,
        ...slot,
      });
    }
    console.log(`  ✅ ${coachId} — Mar/Jue/Sáb 15:00-19:00`);
  }

  console.log(`\n🎉 Done! ${ALL_COACHES.length} coaches updated.`);
}

run().catch(console.error);
