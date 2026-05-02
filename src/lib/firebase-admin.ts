/* eslint-disable @typescript-eslint/no-require-imports */
// Dynamic require to bypass Turbopack's static analysis which incorrectly
// hashes the firebase-admin package name for external modules, breaking
// module resolution in Firebase Cloud Run.
import type { App } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";

const _pkg = "firebase-admin";
const { initializeApp, getApps, cert } = require(`${_pkg}/app`) as typeof import("firebase-admin/app");
const { getFirestore } = require(`${_pkg}/firestore`) as { getFirestore: (app: App) => Firestore };
const { getAuth } = require(`${_pkg}/auth`) as { getAuth: (app: App) => Auth };

let app: ReturnType<typeof initializeApp>;

if (getApps().length === 0) {
  const serviceAccount = process.env.ADMIN_SERVICE_ACCOUNT_KEY;

  if (serviceAccount) {
    try {
      const parsed = JSON.parse(serviceAccount);
      // Hosting platforms may store env vars with escaped newlines in private_key.
      // cert() requires real newline characters, so we convert them here.
      if (parsed.private_key) {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      app = initializeApp({ credential: cert(parsed) });
    } catch (err) {
      console.error("[firebase-admin] Failed to initialize with service account:", err);
      // Fall back to Application Default Credentials (works in Firebase Cloud Run)
      app = initializeApp();
    }
  } else {
    // No explicit service account — use Application Default Credentials.
    // This works automatically in Firebase App Hosting / Cloud Run environments.
    app = initializeApp();
  }
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
export default app;

