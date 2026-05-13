import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "setup-darkololpro");
const db = getFirestore(app);
const auth = getAuth(app);

const COACH_ID = "darkololpro";
const COACH_EMAIL = "darkololpro@gmail.com";
const STUDENT_UID = "8it2OQh63GemTtuZntDGqCHm8Ui2";
const STUDENT_NAME = "Rubén Ausín";
const STUDENT_EMAIL = "rath1212@gmail.com";

async function run() {
  console.log(`🎮 Full setup for ${COACH_ID}...\n`);

  await db.collection("coaches").doc(COACH_ID).set({
    slug: "darkololpro",
    displayName: "Darkolol",
    avatar: "https://instagram.fbcn9-1.fna.fbcdn.net/v/t51.2885-19/335996825_3330538453837658_1118627612891714126_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4zMzAuYzIifQ&_nc_ht=instagram.fbcn9-1.fna.fbcdn.net&_nc_cat=102&_nc_oc=Q6cZ2gFHRRpA3-YAvVNpIDIPig4J-kwaqjqxrOdaxUZUcwqQO_VfncMm3aPPZ3qPqDGm9hY&_nc_ohc=O3thFMgi3OQQ7kNvwEiujXU&_nc_gid=Y7sz2uuUY4_NJUolLJE-BA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_Af7jZScX1uTBvz7XkLSTcw1iQn2QkpoRDmrfDX0D9S-eDg&oe=6A0812AD&_nc_sid=8b3546",
    bio: 'Coach profesional de League of Legends conocido como "Darkolol". Alcanzó Challenger en la Season 10 con un rango top 0,006% de 137 millones de jugadores. Actualmente coach posicional en CUT Esports, está especializado en el desarrollo de jugadores y en la mentalidad de competición ("Champions Mindset") tanto a nivel amateur como profesional.',
    longBio: 'Coach profesional de League of Legends conocido como "Darkolol". Alcanzó Challenger en la Season 10 con un rango top 0,006% de 137 millones de jugadores. Actualmente coach posicional en CUT Esports, está especializado en el desarrollo de jugadores y en la mentalidad de competición ("Champions Mindset") tanto a nivel amateur como profesional.',
    country: "ES",
    countryFlag: "🇪🇸",
    languages: ["Español", "Inglés"],
    verified: true,
    listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0,
    instagramUsername: "darkololpro",
    galleryImages: [
      "https://pbs.twimg.com/media/EU8BxPhWkAE6NJw.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvrE4q7fyPLfxvD7FOwY2iEo4UYIwfFmUFfA&s",
    ],
    createdAt: new Date().toISOString(),
  });
  console.log("  ✅ Coach doc");

  await db.collection("coachGames").add({
    coachId: COACH_ID, gameId: "lol",
    rank: "Challenger", rankTier: "challenger",
    roles: [
      { id: "coach", name: "Coach Élite", icon: "🧠" },
    ],
    specialties: ["Mentalidad de competición", "Desarrollo de jugadores", "Coaching individualizado", "Análisis posicional"],
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
    const u = await auth.createUser({ email: COACH_EMAIL, password: "12345678", displayName: "Darkolol" });
    coachUid = u.uid;
    console.log("  ✅ Auth user created:", coachUid);
  }

  const now = new Date().toISOString();
  await db.collection("users").doc(coachUid).set({
    uid: coachUid, displayName: "Darkolol", email: COACH_EMAIL,
    photoURL: "",
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
