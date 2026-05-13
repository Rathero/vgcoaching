import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "setup-miniduke");
const db = getFirestore(app);
const auth = getAuth(app);

const COACH_ID = "miniduke";
const COACH_EMAIL = "miniduke@gmail.com";
const STUDENT_UID = "8it2OQh63GemTtuZntDGqCHm8Ui2";
const STUDENT_NAME = "Rubén Ausín";
const STUDENT_EMAIL = "rath1212@gmail.com";

async function run() {
  console.log(`🎮 Full setup for ${COACH_ID}...\n`);

  await db.collection("coaches").doc(COACH_ID).set({
    slug: "miniduke",
    displayName: "Miniduke",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/2d1747f2-76ad-41dd-ae17-9743b17c9645-profile_image-70x70.png",
    bio: "Mid laner español natural de Sant Adrià de Besòs, Barcelona. Profesional desde 2019, ha jugado en hasta nueve equipos del circuito patrio. Campeón de la LVP SL 2021 Summer con Vodafone Giants. Actualmente mid laner para GIANTX iTero.",
    longBio: "Mid laner español natural de Sant Adrià de Besòs, Barcelona. Profesional desde 2019, ha jugado en hasta nueve equipos del circuito patrio (Movistar KOI, Giants Spain, Team Queso, Case Esports, ZETA, entre otros). Campeón de la LVP SL 2021 Summer con Vodafone Giants y tercer puesto en la SuperLiga Domino's 2025 Winter. Actualmente mid laner para GIANTX iTero.",
    country: "ES",
    countryFlag: "🇪🇸",
    languages: ["Español", "Inglés"],
    verified: true,
    listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0,
    twitchUsername: "miniduke",
    instagramUsername: "minidukelol",
    twitterUsername: "MinidukeLoL",
    galleryImages: [
      "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d9/CASE_Miniduke_2022_Split_1.png/revision/latest/scale-to-width-down/250?cb=20220125234819",
      "https://estaticos-cdn.prensaiberica.es/clip/4fcbf3ad-7149-4d0c-8cc9-77afc0207ed8_media-libre-aspect-ratio_default_0.jpg",
      "https://rft.gg/player/626644-miniduke/opengraph-image-1y37xg?47c8a3de61e896ad",
    ],
    createdAt: new Date().toISOString(),
  });
  console.log("  ✅ Coach doc");

  await db.collection("coachGames").add({
    coachId: COACH_ID, gameId: "lol",
    rank: "Challenger", rankTier: "challenger",
    roles: [{ id: "mid", name: "Mid", icon: "⚔️" }],
    specialties: ["Carry mid lane", "Asesinos y magos de impacto", "Roaming"],
    champions: [],
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
    const u = await auth.createUser({ email: COACH_EMAIL, password: "12345678", displayName: "Miniduke" });
    coachUid = u.uid;
    console.log("  ✅ Auth user created:", coachUid);
  }

  const now = new Date().toISOString();
  await db.collection("users").doc(coachUid).set({
    uid: coachUid, displayName: "Miniduke", email: COACH_EMAIL,
    photoURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/2d1747f2-76ad-41dd-ae17-9743b17c9645-profile_image-70x70.png",
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
  console.log(`  URL: https://dargog.com/games/league-of-legends/coach/${COACH_ID}`);
}

run().catch(console.error);
