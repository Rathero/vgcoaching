import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "remove-attila-commission");
const db = getFirestore(app);

async function run() {
  await db.collection("coaches").doc("attila").update({ commissionRate: 0 });
  console.log("✅ attila.commissionRate = 0 (sin comisión)");
}

run().catch(err => { console.error(err); process.exit(1); });
