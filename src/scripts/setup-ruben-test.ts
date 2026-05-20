import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "setup-ruben-test");
const db = getFirestore(app);
const auth = getAuth(app);

const COACH_ID = "ruben-test";
const NOTIFICATION_EMAIL = "rath1212@gmail.com";
const LOGIN_EMAIL = "rath1212@gmail.com";
const LOGIN_PASSWORD = "12345678";
const DISPLAY_NAME = "Rubén (Test)";

async function run() {
  console.log(`🧪 Setup test coach ${COACH_ID}...\n`);

  await db.collection("coaches").doc(COACH_ID).set({
    slug: "ruben-test",
    displayName: "Rubén (Test)",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=ruben",
    bio: "Coach de prueba para testear notificaciones de reserva.",
    longBio: "Cuenta de testing usada para validar el flujo end-to-end de reservas, emails y notificaciones de Discord.",
    country: "ES",
    countryFlag: "🇪🇸",
    languages: ["Español", "Inglés"],
    verified: true,
    listed: false,
    ratingAvg: 0,
    totalSessions: 0,
    totalStudents: 0,
    eloUpRate: 0,
    commissionRate: 0,
    notificationEmail: NOTIFICATION_EMAIL,
    createdAt: new Date().toISOString(),
  });
  console.log("  ✅ Coach doc");

  await db.collection("coachGames").add({
    coachId: COACH_ID,
    gameId: "lol",
    rank: "Challenger",
    rankTier: "challenger",
    roles: [{ id: "mid", name: "Mid", icon: "⚡" }],
    specialties: ["Testing", "QA", "Notificaciones"],
    champions: [],
  });
  console.log("  ✅ CoachGame");

  await db.collection("coachingOptions").add({
    coachId: COACH_ID,
    gameId: "lol",
    type: "live_coaching",
    name: "Sesión de prueba (gratis)",
    description: "Reserva gratuita para testear el flujo completo de notificaciones.",
    durationMinutes: 60,
    priceCents: 0,
    active: true,
  });
  await db.collection("coachingOptions").add({
    coachId: COACH_ID,
    gameId: "lol",
    type: "vod_review",
    name: "VOD review (gratis)",
    description: "Otra opción gratis para testear.",
    durationMinutes: 60,
    priceCents: 0,
    active: true,
  });
  console.log("  ✅ Coaching options (free)");

  const existingAvail = await db.collection("availability").where("coachId", "==", COACH_ID).get();
  const batch = db.batch();
  existingAvail.docs.forEach(d => batch.delete(d.ref));
  if (!existingAvail.empty) await batch.commit();

  const slots = [
    { dayOfWeek: 1, startTime: "09:00", endTime: "22:00" },
    { dayOfWeek: 2, startTime: "09:00", endTime: "22:00" },
    { dayOfWeek: 3, startTime: "09:00", endTime: "22:00" },
    { dayOfWeek: 4, startTime: "09:00", endTime: "22:00" },
    { dayOfWeek: 5, startTime: "09:00", endTime: "22:00" },
    { dayOfWeek: 6, startTime: "09:00", endTime: "22:00" },
    { dayOfWeek: 0, startTime: "09:00", endTime: "22:00" },
  ];
  for (const s of slots) {
    await db.collection("availability").add({ coachId: COACH_ID, ...s });
  }
  console.log("  ✅ Availability (todos los días 09:00-22:00)");

  let coachUid: string;
  try {
    const existing = await auth.getUserByEmail(LOGIN_EMAIL);
    coachUid = existing.uid;
    console.log("  ℹ️  Auth user exists:", coachUid);
    await auth.updateUser(coachUid, { password: LOGIN_PASSWORD, displayName: DISPLAY_NAME });
    console.log("  ✅ Password reset to:", LOGIN_PASSWORD);
  } catch {
    const u = await auth.createUser({ email: LOGIN_EMAIL, password: LOGIN_PASSWORD, displayName: DISPLAY_NAME });
    coachUid = u.uid;
    console.log("  ✅ Auth user created:", coachUid);
  }

  const now = new Date().toISOString();
  await db.collection("users").doc(coachUid).set({
    uid: coachUid,
    displayName: DISPLAY_NAME,
    email: LOGIN_EMAIL,
    photoURL: "https://api.dicebear.com/9.x/adventurer/svg?seed=ruben",
    role: "coach",
    coachId: COACH_ID,
    coachApplicationStatus: "approved",
    updatedAt: now,
  }, { merge: true });
  console.log("  ✅ User profile (role: coach, coachId:", COACH_ID, ")");

  console.log(`\n🎉 Done.`);
  console.log(`\n  Login:`);
  console.log(`    email:    ${LOGIN_EMAIL}`);
  console.log(`    password: ${LOGIN_PASSWORD}`);
  console.log(`  URL: /games/league-of-legends/coach/${COACH_ID}/book`);
  console.log(`  notificationEmail: ${NOTIFICATION_EMAIL}`);
  console.log(`  Precio: 0€ (skip Stripe)`);
  console.log(`\n  Para añadir webhook Discord:`);
  console.log(`    db.collection("coaches").doc("${COACH_ID}").update({ notificationDiscordWebhookUrl: "<url>" })`);
}

run().catch(console.error);
