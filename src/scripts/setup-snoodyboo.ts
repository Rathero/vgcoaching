import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "setup-snoodyboo");
const db = getFirestore(app);
const auth = getAuth(app);

const COACH_ID = "snoodyboo";
const COACH_EMAIL = "snoodyboo@gmail.com";
const STUDENT_UID = "8it2OQh63GemTtuZntDGqCHm8Ui2";
const STUDENT_NAME = "Rubén Ausín";
const STUDENT_EMAIL = "rath1212@gmail.com";

async function run() {
  console.log(`🎮 Full setup for ${COACH_ID} (TFT)...\n`);

  await db.collection("coaches").doc(COACH_ID).set({
    slug: "snoodyboo",
    displayName: "Snoodyboo",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/ce8e2cc5-a345-4101-8960-e5eb73fc9a24-profile_image-300x300.png",
    bio: "Jugador y creador de contenido español de Teamfight Tactics, ex Team Liquid. Competidor a nivel europeo desde el lanzamiento del juego, comparte guías y formación en plataformas como Tacter. Uno de los referentes del TFT en español, basado en Granada.",
    longBio: 'Jugador y creador de contenido español de Teamfight Tactics, ex Team Liquid. Competidor a nivel europeo desde el lanzamiento del juego, comparte guías y formación en plataformas como Tacter ("Los Apuntes De Snoody"). Uno de los referentes del TFT en español, basado en Granada.',
    country: "ES",
    countryFlag: "🇪🇸",
    languages: ["Español", "Inglés"],
    verified: true,
    listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0,
    twitchUsername: "snoodyboo",
    twitterUsername: "Snoodyboo",
    galleryImages: [
      "https://liquipedia.net/commons/images/3/3f/Snoodyboo_Vegas_Open_2023.jpg",
      "https://static-cdn.jtvnw.net/jtv_user_pictures/ce8e2cc5-a345-4101-8960-e5eb73fc9a24-profile_image-300x300.png",
      "https://live.staticflickr.com/65535/53384113417_fce3b5097a_b.jpg",
    ],
    createdAt: new Date().toISOString(),
  });
  console.log("  ✅ Coach doc");

  await db.collection("coachGames").add({
    coachId: COACH_ID, gameId: "tft",
    rank: "Challenger", rankTier: "challenger",
    roles: [{ id: "tft", name: "TFT", icon: "♟️" }],
    specialties: ["Análisis de meta", "Guías de composiciones", "Pedagogía TFT"],
    champions: [],
  });
  console.log("  ✅ CoachGame (TFT)");

  const opt1 = await db.collection("coachingOptions").add({
    coachId: COACH_ID, gameId: "tft", type: "live_coaching",
    name: "Coaching en Vivo",
    description: "Sesión 1 a 1 en tiempo real. Te observo jugar y te doy feedback instantáneo.",
    durationMinutes: 60, priceCents: 5000, active: true,
  });
  await db.collection("coachingOptions").add({
    coachId: COACH_ID, gameId: "tft", type: "vod_review",
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
    const u = await auth.createUser({ email: COACH_EMAIL, password: "12345678", displayName: "Snoodyboo" });
    coachUid = u.uid;
    console.log("  ✅ Auth user created:", coachUid);
  }

  const now = new Date().toISOString();
  await db.collection("users").doc(coachUid).set({
    uid: coachUid, displayName: "Snoodyboo", email: COACH_EMAIL,
    photoURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/ce8e2cc5-a345-4101-8960-e5eb73fc9a24-profile_image-300x300.png",
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
  console.log(`  URL: https://dargog.com/games/teamfight-tactics/coach/${COACH_ID}`);
}

run().catch(console.error);
