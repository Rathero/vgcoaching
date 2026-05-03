import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getBookingById, createReview, getReviewByBookingId, getUserProfile } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { bookingId, rating, comment } = await req.json();

    if (!bookingId || rating === undefined || rating === null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 0 and 5" }, { status: 400 });
    }

    // Get the booking
    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify the user is the student
    if (booking.studentId !== uid) {
      return NextResponse.json({ error: "Only the student can review a session" }, { status: 403 });
    }

    // Verify the session is completed
    if (booking.sessionStatus !== "completed" && booking.status !== "completed") {
      return NextResponse.json({ error: "Session must be completed to leave a review" }, { status: 400 });
    }

    // Get user profile for display name and avatar
    const profile = await getUserProfile(uid);

    const reviewId = await createReview({
      bookingId,
      coachId: booking.coachId,
      studentId: uid,
      studentName: profile?.displayName || booking.studentName || "Anónimo",
      studentAvatar: profile?.photoURL || "🎮",
      rating: Math.round(rating), // Ensure integer
      comment: comment || "",
    });

    return NextResponse.json({ success: true, reviewId });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "ALREADY_REVIEWED") {
      return NextResponse.json({ error: "Ya has valorado esta sesión" }, { status: 409 });
    }
    console.error("Review submission error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    await adminAuth.verifyIdToken(token);

    const bookingId = req.nextUrl.searchParams.get("bookingId");
    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const review = await getReviewByBookingId(bookingId);
    return NextResponse.json({ review: review || null });
  } catch (error) {
    console.error("Review check error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
