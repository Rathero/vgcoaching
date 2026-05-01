import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getUserProfile, getUserBookings, getCoachSessionBookings, getCoachById } from "@/lib/firestore";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const profile = await getUserProfile(uid);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get student bookings
    const studentBookings = await getUserBookings(uid);

    // Get coach bookings if user is a coach
    let coachBookings: typeof studentBookings = [];
    if (profile.role === "coach" && profile.coachId) {
      coachBookings = await getCoachSessionBookings(profile.coachId);
    }

    // Enrich bookings with coach display names
    const enrichedStudentBookings = await Promise.all(
      studentBookings.map(async (b) => {
        const coach = await getCoachById(b.coachId);
        return { ...b, coachDisplayName: coach?.displayName || "Coach", coachAvatar: coach?.avatar || "" };
      })
    );

    return NextResponse.json({
      profile,
      studentBookings: enrichedStudentBookings,
      coachBookings,
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
