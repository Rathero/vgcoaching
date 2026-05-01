/**
 * Delete fake/seed coaches (c1-c6) and all related data.
 * Run: npx tsx src/scripts/delete-fake-coaches.ts
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sa = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("❌ FIREBASE_SERVICE_ACCOUNT_KEY missing"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "delete-fake");
const db = getFirestore(app);

const FAKE_IDS = ["c1", "c2", "c3", "c4", "c5", "c6"];

async function deleteCollection(collection: string, field: string) {
  for (const id of FAKE_IDS) {
    const snap = await db.collection(collection).where(field, "==", id).get();
    for (const doc of snap.docs) {
      await doc.ref.delete();
    }
    if (snap.size > 0) console.log(`  🗑️  ${snap.size} docs from ${collection} (${id})`);
  }
}

async function run() {
  console.log("🧹 Deleting fake coaches c1-c6...\n");

  // Delete coach documents
  for (const id of FAKE_IDS) {
    const ref = db.collection("coaches").doc(id);
    const doc = await ref.get();
    if (doc.exists) {
      await ref.delete();
      console.log(`  🗑️  Coach: ${doc.data()?.displayName || id}`);
    }
  }

  // Delete related collections
  await deleteCollection("coachGames", "coachId");
  await deleteCollection("coachingOptions", "coachId");
  await deleteCollection("availability", "coachId");
  await deleteCollection("reviews", "coachId");
  await deleteCollection("bookings", "coachId");

  console.log("\n✅ All fake data deleted.");
}

run().catch(console.error);
