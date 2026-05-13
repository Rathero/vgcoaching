import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "setup-xixauxas");
const db = getFirestore(app);
const auth = getAuth(app);

const COACH_ID = "xixauxas";
const COACH_EMAIL = "xixauxas@gmail.com";
const STUDENT_UID = "8it2OQh63GemTtuZntDGqCHm8Ui2";
const STUDENT_NAME = "Rubén Ausín";
const STUDENT_EMAIL = "rath1212@gmail.com";

async function run() {
  console.log(`🎮 Full setup for ${COACH_ID}...\n`);

  await db.collection("coaches").doc(COACH_ID).set({
    slug: "xixauxas",
    displayName: "Xixauxas",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/73e2cc13-cadf-47e5-8c1d-1db736b5da4e-profile_image-300x300.png",
    bio: "Coach y jugador profesional de League of Legends nacido en Barcelona. Support Challenger desde la season 5, ha competido en la SLO durante tres splits y trabaja como coach para UB Alma Mater. Compagina la competición con el stream en Twitch, donde retransmite partidas en alto elo, coaching en directo y contenido educativo en español.",
    longBio: "Coach y jugador profesional de League of Legends nacido en Barcelona. Support Challenger desde la season 5, ha competido en la SLO durante tres splits y trabaja como coach para UB Alma Mater. Compagina la competición con el stream en Twitch, donde retransmite partidas en alto elo, coaching en directo y contenido educativo en español.",
    country: "ES",
    countryFlag: "🇪🇸",
    languages: ["Español", "Inglés"],
    verified: true,
    listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0,
    twitchUsername: "xixauxas",
    instagramUsername: "xixauxas",
    twitterUsername: "Xixauxas",
    galleryImages: [
      "https://lvp-network.s3.eu-west-1.amazonaws.com/wp-content/uploads/sites/3/2020/02/05142221/SLO20-RRSS-Entrevista-XIXAUXAS.jpg",
      "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/6e/S2V_Xixauxas_2019_Split_1.png/revision/latest/scale-to-width-down/250?cb=20190211192722",
      "https://image-proxy.bo3.gg/uploads/news/489683/title_image/webp-a9369b6ad51cded994a167157712a43e.webp.webp?w=520&h=520",
    ],
    createdAt: new Date().toISOString(),
  });
  console.log("  ✅ Coach doc");

  await db.collection("coachGames").add({
    coachId: COACH_ID, gameId: "lol",
    rank: "Challenger", rankTier: "challenger",
    roles: [
      { id: "support", name: "Support", icon: "🛡️" },
    ],
    specialties: ["Coaching de support", "Posicionamiento", "Macro Game", "Lectura de mapa"],
    champions: ["Pyke", "Thresh", "Bard"],
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
    const u = await auth.createUser({ email: COACH_EMAIL, password: "12345678", displayName: "Xixauxas" });
    coachUid = u.uid;
    console.log("  ✅ Auth user created:", coachUid);
  }

  const now = new Date().toISOString();
  await db.collection("users").doc(coachUid).set({
    uid: coachUid, displayName: "Xixauxas", email: COACH_EMAIL,
    photoURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/73e2cc13-cadf-47e5-8c1d-1db736b5da4e-profile_image-300x300.png",
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
    createdAt: "2026-05-11T12:00:00.000Z", updatedAt: "2026-05-11T12:00:00.000Z",
  });
  console.log("  ✅ Upcoming booking");

  console.log(`\n🎉 Done! Login: ${COACH_EMAIL} / 12345678`);
  console.log(`  URL: /games/league-of-legends/coach/${COACH_ID}`);
}

run().catch(console.error);
