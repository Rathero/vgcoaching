import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getUserProfile, getUserBookings, getCoachSessionBookings, getCoachById, getCoachOptions } from "@/lib/firestore";
import { listCoachBundles, listUserBundles } from "@/lib/bundles";

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

    // Get coach bookings + coach doc + coach bundles + coaching options if user is a coach
    let coachBookings: typeof studentBookings = [];
    let coach = null;
    let coachBundles: Awaited<ReturnType<typeof listCoachBundles>> = [];
    let coachingOptions: Awaited<ReturnType<typeof getCoachOptions>> = [];
    if (profile.role === "coach" && profile.coachId) {
      coachBookings = await getCoachSessionBookings(profile.coachId);
      coach = await getCoachById(profile.coachId);
      coachBundles = await listCoachBundles(profile.coachId);
      coachingOptions = await getCoachOptions(profile.coachId);
    }

    const rawUserBundles = await listUserBundles(uid);
    const userBundles = await Promise.all(rawUserBundles.map(async b => {
      const c = await getCoachById(b.coachId);
      const o = await import("@/lib/firestore").then(m => m.getCoachingOptionById(b.coachingOptionId));
      return {
        ...b,
        coachName: c?.displayName,
        coachSlug: c?.slug,
        optionName: o?.name,
        gameSlug: "league-of-legends",
      };
    }));

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
      coach,
      coachBundles,
      coachingOptions,
      userBundles,
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
