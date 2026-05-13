import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "setup-flakked");
const db = getFirestore(app);
const auth = getAuth(app);

const COACH_ID = "flakked";
const COACH_EMAIL = "flakked@gmail.com";
const STUDENT_UID = "8it2OQh63GemTtuZntDGqCHm8Ui2";
const STUDENT_NAME = "Rubén Ausín";
const STUDENT_EMAIL = "rath1212@gmail.com";

async function run() {
  console.log(`🎮 Full setup for ${COACH_ID}...\n`);

  await db.collection("coaches").doc(COACH_ID).set({
    slug: "flakked",
    displayName: "Flakked",
    avatar: "https://pbs.twimg.com/profile_images/2002303096597180417/etRD499__400x400.jpg",
    bio: 'ADC español, campeón de la LEC 2022 con G2 Esports en su rookie season. Tras varias temporadas en LEC (G2, Team Heretics), regresa a la Superliga en 2026 con GIANTX iTero como bot laner y co-streamer para GIANTX.',
    longBio: 'ADC español, campeón de la LEC 2022 con G2 Esports en su rookie season. Tras varias temporadas en LEC (G2, Team Heretics), regresa a la Superliga en 2026 con GIANTX iTero como bot laner y co-streamer para GIANTX. Conocido por la comunidad española como "El tetón" y dueño de una pata mascota llamada "Tetoncito".',
    country: "ES",
    countryFlag: "🇪🇸",
    languages: ["Español", "Inglés"],
    verified: true,
    listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0,
    twitterUsername: "Flakked_LoL",
    galleryImages: [
      "https://phantom.estaticos-marca.com/36e2a2375c974f28008f9fddb9d33cec/crop/0x315/2042x1457/resize/828/f/jpg/assets/multimedia/imagenes/2022/04/11/16496723700663.jpg",
      "https://liquipedia.net/commons/images/7/77/TH_Flakked_LEC2023.jpg",
      "https://static1-es.millenium.gg/articles/5/42/54/5/@/221284-flakked-lol-article_m-2.png",
    ],
    createdAt: new Date().toISOString(),
  });
  console.log("  ✅ Coach doc");

  await db.collection("coachGames").add({
    coachId: COACH_ID, gameId: "lol",
    rank: "Challenger", rankTier: "challenger",
    roles: [
      { id: "adc", name: "ADC", icon: "🏹" },
    ],
    specialties: ["ADCs hyper-carry", "Trading 2v2", "Tier-S meta picks"],
    champions: ["Zeri", "Lucian", "Aphelios", "Jinx"],
  });
  console.log("  ✅ CoachGame");

  const opt1 = await db.collection("coachingOptions").add({
    coachId: COACH_ID, gameId: "lol", type: "live_coaching",
    name: "Coaching en Vivo",
    description: "Sesión 1 a 1 en tiempo real. Te observo jugar y te doy feedback instantáneo.",
    durationMinutes: 60, priceCents: 5000, active: true,
  });
  await db.collection("coachingOptions").add({
    coachId: COACH_ID, gameId: "lol", type: "vod_review",
    name: "VOD Review",
    description: "Analizo una replay tuya en detalle con soluciones claras y accionables.",
    durationMinutes: 60, priceCents: 5000, active: true,
  });
  console.log("  ✅ Coaching options");

  let coachUid: string;
  try {
    const existing = await auth.getUserByEmail(COACH_EMAIL);
    coachUid = existing.uid;
    console.log("  ℹ️  Auth user exists:", coachUid);
  } catch {
    const u = await auth.createUser({ email: COACH_EMAIL, password: "12345678", displayName: "Flakked" });
    coachUid = u.uid;
    console.log("  ✅ Auth user created:", coachUid);
  }

  const now = new Date().toISOString();
  await db.collection("users").doc(coachUid).set({
    uid: coachUid, displayName: "Flakked", email: COACH_EMAIL,
    photoURL: "https://pbs.twimg.com/profile_images/2002303096597180417/etRD499__400x400.jpg",
    role: "coach", coachId: COACH_ID, coachApplicationStatus: "approved",
    createdAt: now, updatedAt: now,
  }, { merge: true });
  console.log("  ✅ User profile (role: coach)");

  const b1 = await db.collection("bookings").add({
    coachId: COACH_ID, coachingOptionId: opt1.id,
    studentId: STUDENT_UID, studentName: STUDENT_NAME, studentEmail: STUDENT_EMAIL,
    scheduledDate: "2026-05-04", scheduledTime: "18:00",
    status: "completed", sessionStatus: "completed",
    notes: "", amountCents: 5000, isGroupSession: false,
    sessionStartedAt: "2026-05-04T18:00:00.000Z", sessionEndedAt: "2026-05-04T19:00:00.000Z",
    createdAt: "2026-05-03T10:00:00.000Z", updatedAt: "2026-05-04T19:00:00.000Z",
  });
  console.log("  ✅ Completed booking:", b1.id);

  await db.collection("reviews").add({
    bookingId: b1.id, coachId: COACH_ID,
    studentId: STUDENT_UID, studentName: STUDENT_NAME, studentAvatar: "",
    rating: 5, comment: "Una sesion increible muchas gracias!!",
    createdAt: "2026-05-04T19:30:00.000Z",
  });
  await db.collection("coaches").doc(COACH_ID).update({ ratingAvg: 5.0, totalSessions: 1, totalStudents: 1 });
  console.log("  ✅ Review ⭐⭐⭐⭐⭐");

  await db.collection("bookings").add({
    coachId: COACH_ID, coachingOptionId: opt1.id,
    studentId: STUDENT_UID, studentName: STUDENT_NAME, studentEmail: STUDENT_EMAIL,
    scheduledDate: "2026-05-15", scheduledTime: "18:00",
    status: "confirmed", sessionStatus: "scheduled",
    notes: "", amountCents: 5000, isGroupSession: false,
    createdAt: "2026-05-12T12:00:00.000Z", updatedAt: "2026-05-12T12:00:00.000Z",
  });
  console.log("  ✅ Upcoming booking");

  console.log(`\n🎉 Done! Login: ${COACH_EMAIL} / 12345678`);
  console.log(`  URL: /games/league-of-legends/coach/${COACH_ID}`);
}

run().catch(console.error);
