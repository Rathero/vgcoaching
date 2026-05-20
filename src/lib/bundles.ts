import { adminDb } from "./firebase-admin";
import type { CoachBundle, UserBundle } from "./types";

const BUNDLES = "coachBundles";
const USER_BUNDLES = "userBundles";

// ─── Coach-side: bundle configuration ───────────────────

export async function listCoachBundles(coachId: string, activeOnly = false): Promise<CoachBundle[]> {
  const snap = await adminDb.collection(BUNDLES).where("coachId", "==", coachId).get();
  let items = snap.docs.map(d => ({ id: d.id, ...d.data() } as CoachBundle));
  if (activeOnly) items = items.filter(b => b.active);
  return items.sort((a, b) => a.sessions - b.sessions);
}

export async function getCoachBundle(id: string): Promise<CoachBundle | null> {
  const doc = await adminDb.collection(BUNDLES).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as CoachBundle;
}

export async function createCoachBundle(data: {
  coachId: string;
  coachingOptionId: string;
  sessions: number;
  priceCents: number;
  active?: boolean;
}): Promise<string> {
  const now = new Date().toISOString();
  const ref = await adminDb.collection(BUNDLES).add({
    coachId: data.coachId,
    coachingOptionId: data.coachingOptionId,
    sessions: data.sessions,
    priceCents: data.priceCents,
    active: data.active ?? true,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateCoachBundle(id: string, patch: Partial<Pick<CoachBundle, "sessions" | "priceCents" | "active">>): Promise<void> {
  await adminDb.collection(BUNDLES).doc(id).update({
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteCoachBundle(id: string): Promise<void> {
  await adminDb.collection(BUNDLES).doc(id).delete();
}

// ─── User-side: purchased bundles + redemption ──────────

export async function listUserBundles(userId: string): Promise<UserBundle[]> {
  const snap = await adminDb.collection(USER_BUNDLES).where("userId", "==", userId).get();
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as UserBundle))
    .sort((a, b) => (b.purchasedAt || "").localeCompare(a.purchasedAt || ""));
}

export async function getUserBundleById(id: string): Promise<UserBundle | null> {
  const doc = await adminDb.collection(USER_BUNDLES).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as UserBundle;
}

/**
 * Find an active bundle owned by `userId` that can redeem a session
 * for the given coach + coachingOption.
 */
export async function findRedeemableBundle(
  userId: string,
  coachId: string,
  coachingOptionId: string
): Promise<UserBundle | null> {
  const snap = await adminDb.collection(USER_BUNDLES)
    .where("userId", "==", userId)
    .where("coachId", "==", coachId)
    .where("coachingOptionId", "==", coachingOptionId)
    .where("status", "==", "active")
    .get();
  const bundles = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserBundle));
  // Pick oldest first to use them up in purchase order
  return bundles
    .filter(b => b.remainingSessions > 0)
    .sort((a, b) => (a.purchasedAt || "").localeCompare(b.purchasedAt || ""))[0] || null;
}

/**
 * Atomically decrement a user bundle by 1 session. Throws if no credit left
 * or bundle doesn't match. Marks bundle as "depleted" when it hits 0.
 */
export async function redeemBundleSession(params: {
  bundleId: string;
  userId: string;
  coachId: string;
  coachingOptionId: string;
}): Promise<void> {
  const ref = adminDb.collection(USER_BUNDLES).doc(params.bundleId);
  await adminDb.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error("BUNDLE_NOT_FOUND");
    const b = snap.data() as UserBundle;

    if (b.userId !== params.userId) throw new Error("BUNDLE_NOT_OWNED");
    if (b.coachId !== params.coachId) throw new Error("BUNDLE_COACH_MISMATCH");
    if (b.coachingOptionId !== params.coachingOptionId) throw new Error("BUNDLE_OPTION_MISMATCH");
    if (b.status !== "active") throw new Error("BUNDLE_NOT_ACTIVE");
    if (b.remainingSessions <= 0) throw new Error("BUNDLE_DEPLETED");

    const remaining = b.remainingSessions - 1;
    tx.update(ref, {
      remainingSessions: remaining,
      status: remaining === 0 ? "depleted" : "active",
      updatedAt: new Date().toISOString(),
    });
  });
}

/**
 * Create a UserBundle record after a successful Stripe purchase.
 * Idempotent on stripeSessionId — if a bundle already exists for the session, returns it.
 */
export async function createUserBundleFromPurchase(params: {
  userId: string;
  coachId: string;
  coachingOptionId: string;
  bundleId: string;
  totalSessions: number;
  pricePaidCents: number;
  stripeSessionId: string;
  stripePaymentId?: string;
}): Promise<string> {
  const existing = await adminDb.collection(USER_BUNDLES)
    .where("stripeSessionId", "==", params.stripeSessionId)
    .limit(1).get();
  if (!existing.empty) return existing.docs[0].id;

  const now = new Date().toISOString();
  const ref = await adminDb.collection(USER_BUNDLES).add({
    userId: params.userId,
    coachId: params.coachId,
    coachingOptionId: params.coachingOptionId,
    bundleId: params.bundleId,
    totalSessions: params.totalSessions,
    remainingSessions: params.totalSessions,
    status: "active",
    pricePaidCents: params.pricePaidCents,
    stripeSessionId: params.stripeSessionId,
    stripePaymentId: params.stripePaymentId || null,
    purchasedAt: now,
    updatedAt: now,
  });
  return ref.id;
}
