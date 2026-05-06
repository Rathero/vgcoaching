import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "setup-maurogarih");
const db = getFirestore(app);
const auth = getAuth(app);

const COACH_ID = "maurogarih";
const COACH_EMAIL = "maurogarih@gmail.com";
const STUDENT_UID = "8it2OQh63GemTtuZntDGqCHm8Ui2";
const STUDENT_NAME = "Rubén Ausín";
const STUDENT_EMAIL = "rath1212@gmail.com";

async function run() {
  console.log(`🎮 Full setup for ${COACH_ID}...\n`);

  // ─── 1. Coach profile ──────────────────────────────────────
  await db.collection("coaches").doc(COACH_ID).set({
    slug: "maurogarih",
    displayName: "maurogarih",
    avatar: "https://pbs.twimg.com/profile_images/2008894633883963392/w8AcRa14_400x400.jpg",
    bio: "Coach profesional de League of Legends con mas de 8 anos de experiencia en el ecosistema competitivo europeo. He trabajado con multiples equipos de la LEC, ERL y academias, ayudando a jugadores profesionales a alcanzar su maximo potencial. Ahora tambien ofrezco coaching personalizado para jugadores que quieren mejorar y subir de elo.",
    longBio: "Coach profesional de League of Legends con mas de 8 anos de experiencia en el ecosistema competitivo europeo. He trabajado con multiples equipos de la LEC, ERL y academias, ayudando a jugadores profesionales a alcanzar su maximo potencial. Ahora tambien ofrezco coaching personalizado para jugadores que quieren mejorar y subir de elo.",
    country: "ES",
    countryFlag: "🇪🇸",
    languages: ["Español", "Inglés"],
    verified: true,
    listed: false,
    ratingAvg: 0,
    totalSessions: 0,
    totalStudents: 0,
    eloUpRate: 0,
    twitchUsername: "maurogarih",
    instagramUsername: "maurogarih",
    twitterUsername: "maurogarih",
    galleryImages: [
      "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2c/BDSA_Garih_2024.jpg/revision/latest/scale-to-width-down/250?cb=20241106224153",
      "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/def50b2a-5136-496e-829a-8ec519642612/landscape/thumb/thumb-0000000000-1920x1080.jpg",
      "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/f2f975fd-03f6-44da-b88e-c12ce6d6d3ff/landscape/thumb/thumb-0000000000-1920x1080.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmXvMaL9WZ6pl4-N4qMLUZHbZR0VOm1GlUAg&s",
    ],
    createdAt: new Date().toISOString(),
  });
  console.log("  ✅ Coach doc");

  // ─── 2. CoachGame ──────────────────────────────────────────
  await db.collection("coachGames").add({
    coachId: COACH_ID,
    gameId: "lol",
    rank: "Challenger",
    rankTier: "challenger",
    roles: [
      { id: "mid", name: "Mid", icon: "⚔️" },
      { id: "top", name: "Top", icon: "🗡️" },
      { id: "jungle", name: "Jungle", icon: "🌲" },
      { id: "support", name: "Support", icon: "🛡️" },
      { id: "adc", name: "ADC", icon: "🏹" },
    ],
    specialties: ["Macro Game", "Fase línea", "Teamfighting", "Mentalidad"],
    champions: [],
  });
  console.log("  ✅ CoachGame");

  // ─── 3. Coaching options ───────────────────────────────────
  const opt1 = await db.collection("coachingOptions").add({
    coachId: COACH_ID, gameId: "lol", type: "live_coaching",
    name: "Coaching en Vivo",
    description: "Sesión 1 a 1 en tiempo real. Te observo jugar y te doy feedback instantáneo.",
    durationMinutes: 60, priceCents: 5000, active: true,
  });
  console.log("  ✅ Live coaching option");

  await db.collection("coachingOptions").add({
    coachId: COACH_ID, gameId: "lol", type: "vod_review",
    name: "VOD Review",
    description: "Analizo una replay tuya en detalle con soluciones claras y accionables.",
    durationMinutes: 60, priceCents: 5000, active: true,
  });
  console.log("  ✅ VOD review option");

  // ─── 4. Auth user + profile ────────────────────────────────
  let coachUid: string;
  try {
    const existing = await auth.getUserByEmail(COACH_EMAIL);
    coachUid = existing.uid;
    console.log("  ℹ️  Auth user exists:", coachUid);
  } catch {
    const u = await auth.createUser({ email: COACH_EMAIL, password: "12345678", displayName: "maurogarih" });
    coachUid = u.uid;
    console.log("  ✅ Auth user created:", coachUid);
  }

  const now = new Date().toISOString();
  await db.collection("users").doc(coachUid).set({
    uid: coachUid, displayName: "maurogarih", email: COACH_EMAIL,
    photoURL: "https://pbs.twimg.com/profile_images/2008894633883963392/w8AcRa14_400x400.jpg",
    role: "coach", coachId: COACH_ID, coachApplicationStatus: "approved",
    createdAt: now, updatedAt: now,
  }, { merge: true });
  console.log("  ✅ User profile (role: coach)");

  // ─── 5. Demo bookings ─────────────────────────────────────
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
  console.log("  ✅ Review ⭐⭐⭐⭐⭐");

  await db.collection("coaches").doc(COACH_ID).update({ ratingAvg: 5.0, totalSessions: 1, totalStudents: 1 });

  const b2 = await db.collection("bookings").add({
    coachId: COACH_ID, coachingOptionId: opt1.id,
    studentId: STUDENT_UID, studentName: STUDENT_NAME, studentEmail: STUDENT_EMAIL,
    scheduledDate: "2026-05-08", scheduledTime: "18:00",
    status: "confirmed", sessionStatus: "scheduled",
    notes: "", amountCents: 5000, isGroupSession: false,
    createdAt: "2026-05-06T12:00:00.000Z", updatedAt: "2026-05-06T12:00:00.000Z",
  });
  console.log("  ✅ Upcoming booking:", b2.id);

  console.log(`\n🎉 Done! Login: ${COACH_EMAIL} / 12345678`);
  console.log(`  URL: /games/league-of-legends/coach/${COACH_ID}`);
}

run().catch(console.error);
