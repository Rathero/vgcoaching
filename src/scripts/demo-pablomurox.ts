/**
 * Demo setup for pablomurox:
 * - Create Firebase Auth user pablomurox@gmail.com (coach)
 * - Create two demo bookings from raht1212@gmail.com
 * - Add a review on the completed session
 * 
 * Run: npx tsx src/scripts/demo-pablomurox.ts
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("❌ ADMIN_SERVICE_ACCOUNT_KEY missing"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "demo-pablomurox");
const db = getFirestore(app);
const auth = getAuth(app);

const COACH_ID = "pablomurox";
const COACH_EMAIL = "pablomurox@gmail.com";
const COACH_PASSWORD = "12345678";
const STUDENT_EMAIL = "raht1212@gmail.com";

async function run() {
  console.log("🎮 Setting up demo for pablomurox...\n");

  // ─── 1. Create or get Firebase Auth user for coach ─────────
  let coachUid: string;
  try {
    const existing = await auth.getUserByEmail(COACH_EMAIL);
    coachUid = existing.uid;
    console.log(`  ℹ️  Coach auth user already exists: ${coachUid}`);
  } catch {
    const newUser = await auth.createUser({
      email: COACH_EMAIL,
      password: COACH_PASSWORD,
      displayName: "pablomurox",
    });
    coachUid = newUser.uid;
    console.log(`  ✅ Coach auth user created: ${coachUid}`);
  }

  // ─── 2. Create UserProfile for coach ───────────────────────
  const now = new Date().toISOString();
  await db.collection("userProfiles").doc(coachUid).set({
    uid: coachUid,
    displayName: "pablomurox",
    email: COACH_EMAIL,
    photoURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/8aef247e-7baf-4ffa-b291-f2a92ac90d95-profile_image-300x300.png",
    role: "coach",
    coachId: COACH_ID,
    coachApplicationStatus: "approved",
    createdAt: now,
    updatedAt: now,
  }, { merge: true });
  console.log("  ✅ Coach UserProfile created/updated (role: coach, coachId: pablomurox)");

  // ─── 3. Find student user ─────────────────────────────────
  let studentUid = "";
  let studentName = "raht1212";
  try {
    const student = await auth.getUserByEmail(STUDENT_EMAIL);
    studentUid = student.uid;
    studentName = student.displayName || studentName;
    console.log(`  ℹ️  Student found: ${studentUid} (${studentName})`);
  } catch {
    // Create the student if doesn't exist
    const newStudent = await auth.createUser({
      email: STUDENT_EMAIL,
      password: "12345678",
      displayName: "raht1212",
    });
    studentUid = newStudent.uid;
    console.log(`  ✅ Student auth user created: ${studentUid}`);
    
    await db.collection("userProfiles").doc(studentUid).set({
      uid: studentUid,
      displayName: "raht1212",
      email: STUDENT_EMAIL,
      photoURL: "",
      role: "client",
      createdAt: now,
      updatedAt: now,
    });
    console.log("  ✅ Student UserProfile created");
  }

  // ─── 4. Get a coaching option ID for pablomurox ────────────
  const optSnap = await db.collection("coachingOptions")
    .where("coachId", "==", COACH_ID)
    .where("type", "==", "live_coaching")
    .limit(1)
    .get();

  if (optSnap.empty) {
    console.error("❌ No coaching option found for pablomurox. Run seed-pablomurox.ts first.");
    process.exit(1);
  }
  const coachingOptionId = optSnap.docs[0].id;
  const coachingOption = optSnap.docs[0].data();
  console.log(`  ℹ️  Using coaching option: ${coachingOptionId} (${coachingOption.name})`);

  // ─── 5. Create completed booking (May 4, 2026) ────────────
  const completedBookingRef = await db.collection("bookings").add({
    coachId: COACH_ID,
    coachingOptionId,
    studentId: studentUid,
    studentName,
    studentEmail: STUDENT_EMAIL,
    scheduledDate: "2026-05-04",
    scheduledTime: "18:00",
    status: "completed",
    sessionStatus: "completed",
    notes: "",
    amountCents: coachingOption.priceCents || 5000,
    isGroupSession: false,
    sessionStartedAt: "2026-05-04T18:00:00.000Z",
    sessionEndedAt: "2026-05-04T19:00:00.000Z",
    createdAt: "2026-05-03T10:00:00.000Z",
    updatedAt: "2026-05-04T19:00:00.000Z",
  });
  console.log(`  ✅ Completed booking created: ${completedBookingRef.id} (May 4, 2026)`);

  // ─── 6. Create review for completed booking ────────────────
  await db.collection("reviews").add({
    bookingId: completedBookingRef.id,
    coachId: COACH_ID,
    studentId: studentUid,
    studentName,
    studentAvatar: "",
    rating: 5,
    comment: "Una sesion increible muchas gracias pablo!!",
    createdAt: "2026-05-04T19:30:00.000Z",
  });
  console.log("  ✅ Review created: ⭐⭐⭐⭐⭐ (5/5)");

  // Update coach rating
  await db.collection("coaches").doc(COACH_ID).update({
    ratingAvg: 5.0,
    totalSessions: 1,
    totalStudents: 1,
  });
  console.log("  ✅ Coach stats updated (ratingAvg: 5.0, totalSessions: 1)");

  // ─── 7. Create upcoming booking (May 8, 2026) ─────────────
  const upcomingBookingRef = await db.collection("bookings").add({
    coachId: COACH_ID,
    coachingOptionId,
    studentId: studentUid,
    studentName,
    studentEmail: STUDENT_EMAIL,
    scheduledDate: "2026-05-08",
    scheduledTime: "18:00",
    status: "confirmed",
    sessionStatus: "scheduled",
    notes: "",
    amountCents: coachingOption.priceCents || 5000,
    isGroupSession: false,
    createdAt: "2026-05-06T12:00:00.000Z",
    updatedAt: "2026-05-06T12:00:00.000Z",
  });
  console.log(`  ✅ Upcoming booking created: ${upcomingBookingRef.id} (May 8, 2026)`);

  // ─── Done ──────────────────────────────────────────────────
  console.log("\n🎉 Demo setup complete!");
  console.log(`\n📋 Login credentials:`);
  console.log(`   Email:    ${COACH_EMAIL}`);
  console.log(`   Password: ${COACH_PASSWORD}`);
  console.log(`\n📊 Demo bookings:`);
  console.log(`   ✅ Completed: May 4, 2026 @ 18:00 (with 5⭐ review)`);
  console.log(`   📅 Upcoming:  May 8, 2026 @ 18:00`);
}

run().catch(console.error);
