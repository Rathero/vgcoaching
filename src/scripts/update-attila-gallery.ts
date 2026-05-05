/**
 * Update Attila's coach profile with gallery images and Twitch username.
 * Run: npx tsx src/scripts/update-attila-gallery.ts
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("❌ ADMIN_SERVICE_ACCOUNT_KEY missing"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "update-attila");
const db = getFirestore(app);

async function main() {
  const coachRef = db.collection("coaches").doc("attila");
  const doc = await coachRef.get();

  if (!doc.exists) {
    console.error("❌ Coach 'attila' not found in Firestore.");
    process.exit(1);
  }

  await coachRef.update({
    galleryImages: [
      "https://www.esportmaniacos.com/wp-content/uploads/2022/05/attilas-1024x541.jpg",
      "https://static1-es.millenium.gg/articles/7/43/84/7/@/228559-imagen-2021-12-17-171315-article_m-3.png",
      "https://live.staticflickr.com/1901/30308828347_f9d7f46c26_b.jpg",
    ],
    twitchUsername: "attila",
  });

  console.log("✅ Attila updated with galleryImages and twitchUsername.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
