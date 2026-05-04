import { adminDb } from "./firebase-admin";
import type { Game, Coach, CoachGame, CoachingOption, Review, Availability, Booking, UserProfile, SessionMaterial, CoachApplication, Masterclass, MasterclassRegistration } from "./types";
import { getMinPrice } from "./utils";

// ─── Games ───────────────────────────────────────────────
export async function getGames(): Promise<Game[]> {
  const snap = await adminDb.collection("games").orderBy("sortOrder").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Game));
}

export async function getGame(slug: string): Promise<Game | null> {
  const snap = await adminDb.collection("games").where("slug", "==", slug).limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Game;
}

// ─── Coaches ─────────────────────────────────────────────
export async function getCoach(slug: string): Promise<Coach | null> {
  const snap = await adminDb.collection("coaches").where("slug", "==", slug).limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Coach;
}

export async function getCoachById(id: string): Promise<Coach | null> {
  const doc = await adminDb.collection("coaches").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Coach;
}

// ─── Coach-Game relationships ────────────────────────────
export async function getCoachGame(coachId: string, gameId: string): Promise<CoachGame | null> {
  const snap = await adminDb.collection("coachGames")
    .where("coachId", "==", coachId)
    .where("gameId", "==", gameId)
    .limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as CoachGame & { id: string };
}

export async function getCoachesByGame(gameId: string): Promise<{ coach: Coach; gameData: CoachGame }[]> {
  const cgSnap = await adminDb.collection("coachGames").where("gameId", "==", gameId).get();
  const results: { coach: Coach; gameData: CoachGame }[] = [];

  for (const cgDoc of cgSnap.docs) {
    const gameData = cgDoc.data() as CoachGame;
    const coachDoc = await adminDb.collection("coaches").doc(gameData.coachId).get();
    if (coachDoc.exists) {
      const coach = { id: coachDoc.id, ...coachDoc.data() } as Coach;
      // Only show listed coaches in public listing (unlisted = go-to-market / preview profiles)
      if (coach.listed !== false) {
        results.push({ coach, gameData });
      }
    }
  }
  return results;
}

/** Get featured coaches: verified + listed, for the landing page. Returns coach + first gameData + minPrice. */
export async function getFeaturedCoaches(): Promise<{ coach: Coach; gameData: CoachGame | null; minPrice: number }[]> {
  const snap = await adminDb.collection("coaches")
    .where("verified", "==", true)
    .where("listed", "!=", false)
    .get();

  const results: { coach: Coach; gameData: CoachGame | null; minPrice: number }[] = [];
  for (const doc of snap.docs) {
    const coach = { id: doc.id, ...doc.data() } as Coach;
    // Get first game data
    const cgSnap = await adminDb.collection("coachGames").where("coachId", "==", coach.id).limit(1).get();
    const gameData = cgSnap.empty ? null : (cgSnap.docs[0].data() as CoachGame);
    // Get min price
    const options = await getCoachOptions(coach.id);
    const minPrice = getMinPrice(options);
    results.push({ coach, gameData, minPrice });
  }
  return results;
}

// ─── Coaching Options ────────────────────────────────────
export async function getCoachOptions(coachId: string): Promise<CoachingOption[]> {
  const snap = await adminDb.collection("coachingOptions")
    .where("coachId", "==", coachId)
    .where("active", "==", true)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CoachingOption));
}

export async function getCoachingOptionById(id: string): Promise<CoachingOption | null> {
  const doc = await adminDb.collection("coachingOptions").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as CoachingOption;
}

// ─── Availability ────────────────────────────────────────
export async function getCoachAvailability(coachId: string): Promise<Availability[]> {
  const snap = await adminDb.collection("availability")
    .where("coachId", "==", coachId)
    .get();
  return snap.docs.map(d => d.data() as Availability);
}

// ─── Bookings ────────────────────────────────────────────
export async function getBookedSlots(coachId: string, date: string): Promise<string[]> {
  const snap = await adminDb.collection("bookings")
    .where("coachId", "==", coachId)
    .where("scheduledDate", "==", date)
    .get();
  return snap.docs
    .filter(d => {
      const s = d.data().status;
      return s === "pending" || s === "confirmed";
    })
    .map(d => d.data().scheduledTime as string);
}

export async function getBookedSlotsRange(coachId: string, startDate: string, endDate: string): Promise<Record<string, string[]>> {
  // Simple query: only filter by coachId to avoid needing composite indexes
  const snap = await adminDb.collection("bookings")
    .where("coachId", "==", coachId)
    .get();

  const result: Record<string, string[]> = {};
  snap.docs.forEach(d => {
    const data = d.data();
    // Filter by date range and active status in JS
    if (data.scheduledDate >= startDate && data.scheduledDate <= endDate &&
        (data.status === "pending" || data.status === "confirmed")) {
      if (!result[data.scheduledDate]) result[data.scheduledDate] = [];
      result[data.scheduledDate].push(data.scheduledTime);
    }
  });
  return result;
}

export async function createBooking(data: {
  coachId: string;
  coachingOptionId: string;
  studentId: string;
  studentEmail: string;
  studentName: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
  amountCents: number;
  status: "pending" | "confirmed";
  stripeSessionId?: string;
}): Promise<string> {
  // Check if slot is already booked
  const existing = await adminDb.collection("bookings")
    .where("coachId", "==", data.coachId)
    .where("scheduledDate", "==", data.scheduledDate)
    .where("scheduledTime", "==", data.scheduledTime)
    .get();

  const hasActiveBooking = existing.docs.some(d => {
    const s = d.data().status;
    return s === "pending" || s === "confirmed";
  });

  if (hasActiveBooking) {
    throw new Error("SLOT_TAKEN");
  }

  const ref = await adminDb.collection("bookings").add({
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateBookingByStripeSession(stripeSessionId: string, updates: Partial<Booking>): Promise<void> {
  const snap = await adminDb.collection("bookings")
    .where("stripeSessionId", "==", stripeSessionId)
    .limit(1).get();

  if (!snap.empty) {
    await snap.docs[0].ref.update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function getUserBookings(studentId: string): Promise<Booking[]> {
  const snap = await adminDb.collection("bookings")
    .where("studentId", "==", studentId)
    .get();
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Booking))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

// ─── Reviews ─────────────────────────────────────────────
export async function getCoachReviews(coachId: string): Promise<Review[]> {
  const snap = await adminDb.collection("reviews")
    .where("coachId", "==", coachId)
    .get();
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Review))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function getReviewByBookingId(bookingId: string): Promise<Review | null> {
  const snap = await adminDb.collection("reviews")
    .where("bookingId", "==", bookingId)
    .limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Review;
}

export async function createReview(data: {
  bookingId: string;
  coachId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  comment: string;
}): Promise<string> {
  // Prevent duplicate reviews per booking
  const existing = await getReviewByBookingId(data.bookingId);
  if (existing) throw new Error("ALREADY_REVIEWED");

  const ref = await adminDb.collection("reviews").add({
    ...data,
    createdAt: new Date().toISOString(),
  });

  // Recalculate and update coach's average rating
  await recalculateCoachRating(data.coachId);

  return ref.id;
}

async function recalculateCoachRating(coachId: string): Promise<void> {
  const reviews = await getCoachReviews(coachId);
  if (reviews.length === 0) return;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await adminDb.collection("coaches").doc(coachId).update({
    ratingAvg: Math.round(avg * 10) / 10,
    totalSessions: reviews.length,
  });
}

// ─── User Profiles ───────────────────────────────────────
export async function createOrUpdateUserProfile(uid: string, data: {
  displayName: string;
  email: string;
  photoURL: string;
}): Promise<void> {
  const ref = adminDb.collection("users").doc(uid);
  const doc = await ref.get();

  if (doc.exists) {
    await ref.update({
      displayName: data.displayName,
      email: data.email,
      photoURL: data.photoURL,
      updatedAt: new Date().toISOString(),
    });
  } else {
    await ref.set({
      uid,
      displayName: data.displayName,
      email: data.email,
      photoURL: data.photoURL,
      role: "client",
      coachApplicationStatus: "none",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const doc = await adminDb.collection("users").doc(uid).get();
  if (!doc.exists) return null;
  return { uid: doc.id, ...doc.data() } as UserProfile;
}

// ─── Booking by ID ───────────────────────────────────────
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const doc = await adminDb.collection("bookings").doc(bookingId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Booking;
}

// ─── Coach Session Bookings ──────────────────────────────
export async function getCoachSessionBookings(coachId: string): Promise<Booking[]> {
  const snap = await adminDb.collection("bookings")
    .where("coachId", "==", coachId)
    .get();
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Booking))
    .sort((a, b) => {
      const dateA = `${a.scheduledDate}T${a.scheduledTime}`;
      const dateB = `${b.scheduledDate}T${b.scheduledTime}`;
      return dateA.localeCompare(dateB);
    });
}

// ─── Session Status ──────────────────────────────────────
export async function updateBookingSession(bookingId: string, data: Partial<Booking>): Promise<void> {
  await adminDb.collection("bookings").doc(bookingId).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─── Session Messages ────────────────────────────────────
export async function addSessionMessage(bookingId: string, message: {
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
}): Promise<string> {
  const ref = await adminDb.collection("bookings").doc(bookingId)
    .collection("messages").add({
      bookingId,
      ...message,
      createdAt: new Date().toISOString(),
    });
  return ref.id;
}

// ─── Session Materials ───────────────────────────────────
export async function addSessionMaterial(bookingId: string, material: {
  uploadedBy: string;
  uploaderName: string;
  type: "video" | "image" | "text";
  url?: string;
  content?: string;
  fileName?: string;
  fileSize?: number;
}): Promise<string> {
  // Filter out undefined values — Firestore rejects them
  const data: Record<string, unknown> = { bookingId, createdAt: new Date().toISOString() };
  for (const [key, value] of Object.entries(material)) {
    if (value !== undefined) data[key] = value;
  }
  const ref = await adminDb.collection("bookings").doc(bookingId)
    .collection("materials").add(data);
  return ref.id;
}

export async function getSessionMaterials(bookingId: string): Promise<SessionMaterial[]> {
  const snap = await adminDb.collection("bookings").doc(bookingId)
    .collection("materials").orderBy("createdAt", "asc").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SessionMaterial));
}

// ─── Commission ──────────────────────────────────────────
export function getCommissionRate(coach?: Coach | null): number {
  // Per-coach override takes priority
  if (coach?.commissionRate !== undefined && coach.commissionRate !== null) {
    return coach.commissionRate;
  }
  // Fall back to platform default from env
  const envRate = process.env.PLATFORM_COMMISSION_RATE;
  return envRate ? parseFloat(envRate) : 0.05;
}

export function calculateCommission(priceCents: number, commissionRate: number): { totalCents: number; commissionCents: number } {
  const commissionCents = Math.round(priceCents * commissionRate);
  return { totalCents: priceCents + commissionCents, commissionCents };
}

// ─── Coach Applications ──────────────────────────────────
export async function createCoachApplication(data: Omit<CoachApplication, 'id' | 'status' | 'createdAt'>): Promise<string> {
  const ref = await adminDb.collection("coachApplications").add({
    ...data,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getCoachApplicationByUserId(userId: string): Promise<CoachApplication | null> {
  const snap = await adminDb.collection("coachApplications")
    .where("userId", "==", userId)
    .limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as CoachApplication;
}

// ─── Masterclasses ───────────────────────────────────────
export async function getMasterclasses(status?: string): Promise<Masterclass[]> {
  let q = adminDb.collection("masterclasses") as FirebaseFirestore.Query;
  if (status) {
    q = q.where("status", "==", status);
  }
  const snap = await q.get();
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Masterclass))
    .sort((a, b) => `${a.scheduledDate}T${a.scheduledTime}`.localeCompare(`${b.scheduledDate}T${b.scheduledTime}`));
}

export async function getMasterclassById(id: string): Promise<Masterclass | null> {
  const doc = await adminDb.collection("masterclasses").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Masterclass;
}

// ─── Helpers (re-export from utils for server convenience) ───
export { getMinPrice, formatPrice, rankColors } from "./utils";
