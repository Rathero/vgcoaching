import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "setup-th3antonio");
const db = getFirestore(app);
const auth = getAuth(app);

const COACH_ID = "th3antonio";
const COACH_EMAIL = "th3antonio@gmail.com";
const STUDENT_UID = "8it2OQh63GemTtuZntDGqCHm8Ui2";
const STUDENT_NAME = "Rubén Ausín";
const STUDENT_EMAIL = "rath1212@gmail.com";

async function run() {
  console.log(`🎮 Full setup for ${COACH_ID}...\n`);

  await db.collection("coaches").doc(COACH_ID).set({
    slug: "th3antonio",
    displayName: "Th3Antonio",
    avatar: "https://yt3.googleusercontent.com/QyDblf2qS0nsKOKddVwNZIp1-yAuEM1Xjb-z52dufJSPL-LFozg-cyaU_BkoNrt01qWBItK4uQ=s900-c-k-c0x00ffffff-no-rj",
    bio: 'Streamer, esports player y creador de contenido nacido en Málaga. Su carrera competitiva en League of Legends arrancó hacia 2015 en el circuito europeo. Actualmente jungla de GIANTX Pride y figura habitual de la escena española, apodado "El pelucas".',
    longBio: 'Streamer, esports player y creador de contenido nacido en Málaga el 12 de abril de 1999. Su carrera competitiva en League of Legends arrancó hacia 2015 en el circuito europeo. Actualmente jungla de GIANTX Pride y figura habitual de la escena española, apodado "El pelucas". Combina la competición con streams en Twitch y vídeo corto en TikTok, y ha colaborado con figuras como Ibai Llanos o El Xokas.',
    country: "ES",
    countryFlag: "🇪🇸",
    languages: ["Español", "Inglés"],
    verified: true,
    listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0,
    twitchUsername: "th3antonio",
    instagramUsername: "th3antoniogg",
    twitterUsername: "Th3AntonioGG",
    galleryImages: [
      "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/53/GXP_Th3Antonio_2024_Split_1.png/revision/latest/scale-to-width-down/250?cb=20240202164953",
      "https://s2.elespanol.com/2022/02/18/deportes/otros-deportes/651195281_221993186_1706x1280.jpg",
      "https://static.grupojoly.com/clip/628d57ec-2f0d-4bd5-b1bf-7ef63b6920c7_source-aspect-ratio_1600w_0.jpg",
    ],
    createdAt: new Date().toISOString(),
  });
  console.log("  ✅ Coach doc");

  await db.collection("coachGames").add({
    coachId: COACH_ID, gameId: "lol",
    rank: "Challenger", rankTier: "challenger",
    roles: [{ id: "jungle", name: "Jungle", icon: "🌲" }],
    specialties: ["Versatilidad multi-rol", "Comentario táctico en directo"],
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
    const u = await auth.createUser({ email: COACH_EMAIL, password: "12345678", displayName: "Th3Antonio" });
    coachUid = u.uid;
    console.log("  ✅ Auth user created:", coachUid);
  }

  const now = new Date().toISOString();
  await db.collection("users").doc(coachUid).set({
    uid: coachUid, displayName: "Th3Antonio", email: COACH_EMAIL,
    photoURL: "https://yt3.googleusercontent.com/QyDblf2qS0nsKOKddVwNZIp1-yAuEM1Xjb-z52dufJSPL-LFozg-cyaU_BkoNrt01qWBItK4uQ=s900-c-k-c0x00ffffff-no-rj",
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
