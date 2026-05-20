import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "configure-attila-pricing");
const db = getFirestore(app);

const COACH_ID = "attila";

const VOD_DESCRIPTION =
  "La forma más eficaz de mejorar: analizo una partida tuya en detalle, identifico errores y patrones, " +
  "y te doy soluciones claras y accionables. Para sacarle el máximo provecho necesito que me cuentes " +
  "tu punto de vista — qué pensabas en cada jugada, qué intentabas hacer y dónde sentiste que algo no encajó. " +
  "Con ese contexto el análisis es mucho más útil.";

async function run() {
  console.log(`💰 Configurando precios y bonos de ${COACH_ID}...\n`);

  // 1. Update live_coaching → 40€ (already 40, leave description as-is)
  const liveSnap = await db.collection("coachingOptions")
    .where("coachId", "==", COACH_ID)
    .where("type", "==", "live_coaching")
    .get();
  for (const doc of liveSnap.docs) {
    await doc.ref.update({ priceCents: 4000, active: true });
    console.log(`  ✅ live_coaching (${doc.id}) → 40€`);
  }

  // 2. Update vod_review → 50€ + nueva descripción
  const vodSnap = await db.collection("coachingOptions")
    .where("coachId", "==", COACH_ID)
    .where("type", "==", "vod_review")
    .get();
  if (vodSnap.empty) {
    console.error("  ❌ No vod_review option found for attila — abort");
    process.exit(1);
  }
  let vodOptionId = "";
  for (const doc of vodSnap.docs) {
    await doc.ref.update({
      priceCents: 5000,
      description: VOD_DESCRIPTION,
      active: true,
    });
    vodOptionId = doc.id;
    console.log(`  ✅ vod_review (${doc.id}) → 50€ + nueva descripción`);
  }

  // 3. Clear existing bundles for that option, then create the new ones
  const existing = await db.collection("coachBundles")
    .where("coachId", "==", COACH_ID)
    .where("coachingOptionId", "==", vodOptionId)
    .get();
  const batch = db.batch();
  existing.docs.forEach(d => batch.delete(d.ref));
  if (!existing.empty) {
    await batch.commit();
    console.log(`  🧹 ${existing.size} bono(s) previo(s) eliminados`);
  }

  const now = new Date().toISOString();
  const newBundles = [
    { sessions: 2, priceCents: 9000 },
    { sessions: 3, priceCents: 13000 },
  ];
  for (const b of newBundles) {
    const ref = await db.collection("coachBundles").add({
      coachId: COACH_ID,
      coachingOptionId: vodOptionId,
      sessions: b.sessions,
      priceCents: b.priceCents,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  ✅ Bono ${b.sessions}× VOD = ${(b.priceCents / 100).toFixed(0)}€ (${ref.id})`);
  }

  console.log(`\n🎉 Done.`);
  console.log(`\n  Resumen ${COACH_ID}:`);
  console.log(`    Coaching en Vivo:  1 sesión = 40€`);
  console.log(`    VOD Review:        1 sesión = 50€`);
  console.log(`                       2 sesiones = 90€ (45€/sesión)`);
  console.log(`                       3 sesiones = 130€ (~43€/sesión)`);
}

run().catch(err => { console.error(err); process.exit(1); });
