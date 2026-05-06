import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "demo-attila");
const db = getFirestore(app);
const auth = getAuth(app);

const STUDENT_UID = "8it2OQh63GemTtuZntDGqCHm8Ui2";
const STUDENT_NAME = "Rubén Ausín";
const STUDENT_EMAIL = "rath1212@gmail.com";

async function run() {
  console.log("🎮 Setting up demo for Attila...\n");

  let coachUid: string;
  try {
    const existing = await auth.getUserByEmail("attila@gmail.com");
    coachUid = existing.uid;
    console.log("  ℹ️  Auth user exists:", coachUid);
  } catch {
    const u = await auth.createUser({ email: "attila@gmail.com", password: "12345678", displayName: "Attila" });
    coachUid = u.uid;
    console.log("  ✅ Auth user created:", coachUid);
  }

  const now = new Date().toISOString();
  await db.collection("users").doc(coachUid).set({
    uid: coachUid,
    displayName: "Attila",
    email: "attila@gmail.com",
    photoURL: "",
    role: "coach",
    coachId: "attila",
    coachApplicationStatus: "approved",
    createdAt: now,
    updatedAt: now,
  }, { merge: true });
  console.log("  ✅ Profile in users collection (role: coach)");

  const optSnap = await db.collection("coachingOptions")
    .where("coachId", "==", "attila")
    .where("type", "==", "live_coaching")
    .limit(1).get();
  if (optSnap.empty) { console.error("❌ No coaching option"); process.exit(1); }
  const optId = optSnap.docs[0].id;
  const opt = optSnap.docs[0].data();
  console.log("  ℹ️  Option:", optId, opt.name);

  const b1 = await db.collection("bookings").add({
    coachId: "attila", coachingOptionId: optId,
    studentId: STUDENT_UID, studentName: STUDENT_NAME, studentEmail: STUDENT_EMAIL,
    scheduledDate: "2026-05-04", scheduledTime: "18:00",
    status: "completed", sessionStatus: "completed",
    notes: "", amountCents: opt.priceCents || 4000, isGroupSession: false,
    sessionStartedAt: "2026-05-04T18:00:00.000Z", sessionEndedAt: "2026-05-04T19:15:00.000Z",
    createdAt: "2026-05-03T10:00:00.000Z", updatedAt: "2026-05-04T19:15:00.000Z",
  });
  console.log("  ✅ Completed booking:", b1.id);

  await db.collection("reviews").add({
    bookingId: b1.id, coachId: "attila",
    studentId: STUDENT_UID, studentName: STUDENT_NAME, studentAvatar: "",
    rating: 5, comment: "Una sesion increible muchas gracias!!",
    createdAt: "2026-05-04T19:30:00.000Z",
  });
  console.log("  ✅ Review: ⭐⭐⭐⭐⭐");

  const b2 = await db.collection("bookings").add({
    coachId: "attila", coachingOptionId: optId,
    studentId: STUDENT_UID, studentName: STUDENT_NAME, studentEmail: STUDENT_EMAIL,
    scheduledDate: "2026-05-08", scheduledTime: "18:00",
    status: "confirmed", sessionStatus: "scheduled",
    notes: "", amountCents: opt.priceCents || 4000, isGroupSession: false,
    createdAt: "2026-05-06T12:00:00.000Z", updatedAt: "2026-05-06T12:00:00.000Z",
  });
  console.log("  ✅ Upcoming booking:", b2.id);

  console.log("\n🎉 Done!");
  console.log("  Login: attila@gmail.com / 12345678");
}

run().catch(console.error);
