import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "setup-galandarx");
const db = getFirestore(app);
const auth = getAuth(app);

const COACH_ID = "galandarx";
const COACH_EMAIL = "galandarx@gmail.com";
const STUDENT_UID = "8it2OQh63GemTtuZntDGqCHm8Ui2";
const STUDENT_NAME = "Rubén Ausín";
const STUDENT_EMAIL = "rath1212@gmail.com";

async function run() {
  console.log(`🎮 Full setup for ${COACH_ID}...\n`);

  await db.collection("coaches").doc(COACH_ID).set({
    slug: "galandarx",
    displayName: "Galandarx",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/46a48207-34f0-4815-b176-3f21df315b56-profile_image-70x70.png",
    bio: "Master OTP BRIAR",
    longBio: "Master OTP BRIAR",
    country: "ES",
    countryFlag: "🇪🇸",
    languages: ["Español", "Inglés"],
    verified: true,
    listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0,
    twitchUsername: "galandarx",
    instagramUsername: "galandarxlol",
    twitterUsername: "galandarx",
    galleryImages: [
      "https://pbs.twimg.com/profile_images/1740853492967714816/9rUTHews_400x400.jpg",
      "https://i.ytimg.com/vi/z43Q_pU9t64/maxresdefault.jpg",
    ],
    createdAt: new Date().toISOString(),
  });
  console.log("  ✅ Coach doc");

  await db.collection("coachGames").add({
    coachId: COACH_ID, gameId: "lol",
    rank: "Master", rankTier: "master",
    roles: [{ id: "jungle", name: "Jungle", icon: "🌲" }],
    specialties: ["Junglas proactivos", "Control de objetivos", "Ganking temprano"],
    champions: ["Briar"],
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
    const u = await auth.createUser({ email: COACH_EMAIL, password: "12345678", displayName: "Galandarx" });
    coachUid = u.uid;
    console.log("  ✅ Auth user created:", coachUid);
  }

  const now = new Date().toISOString();
  await db.collection("users").doc(coachUid).set({
    uid: coachUid, displayName: "Galandarx", email: COACH_EMAIL,
    photoURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/46a48207-34f0-4815-b176-3f21df315b56-profile_image-70x70.png",
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
    scheduledDate: "2026-05-17", scheduledTime: "18:00",
    status: "confirmed", sessionStatus: "scheduled",
    notes: "", amountCents: 5000, isGroupSession: false,
    createdAt: "2026-05-14T12:00:00.000Z", updatedAt: "2026-05-14T12:00:00.000Z",
  });
  console.log("  ✅ Upcoming booking");

  // Set availability: Tue(2), Thu(4), Sat(6) 15:00-19:00
  for (const dayOfWeek of [2, 4, 6]) {
    await db.collection("availability").add({
      coachId: COACH_ID, dayOfWeek, startTime: "15:00", endTime: "19:00",
    });
  }
  console.log("  ✅ Availability (Mar/Jue/Sáb 15-19)");

  console.log(`\n🎉 Done! Login: ${COACH_EMAIL} / 12345678`);
  console.log(`  URL: https://dargog.com/games/league-of-legends/coach/${COACH_ID}`);
}

run().catch(console.error);
