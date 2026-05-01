import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let app: App;

if (getApps().length === 0) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccount) {
    try {
      const parsed = JSON.parse(serviceAccount);
      app = initializeApp({ credential: cert(parsed) });
    } catch {
      app = initializeApp({
        projectId: "videogamecoaching-a4794",
      });
    }
  } else {
    app = initializeApp({
      projectId: "videogamecoaching-a4794",
    });
  }
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
export default app;
