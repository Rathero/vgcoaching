import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { adminAuth } from "@/lib/firebase-admin";
import { getBookingById, getUserProfile } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  try {
    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId required" }, { status: 400 });
    }

    // Get booking and verify user is participant
    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const profile = await getUserProfile(uid);
    const isStudent = booking.studentId === uid;
    const isCoach = profile?.role === "coach" && profile?.coachId === booking.coachId;
    // Check if user is an invited group player
    const isInvitedPlayer = booking.isGroupSession && booking.invitedPlayers?.some(
      p => p.uid === uid && p.status === "accepted"
    );
    // Check if this is a shadow booking pointing to a parent
    const isShadowParticipant = !!booking.parentBookingId && booking.studentId === uid;

    if (!isStudent && !isCoach && !isInvitedPlayer && !isShadowParticipant) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    // For shadow bookings, use the parent booking's room name
    const effectiveBookingId = booking.parentBookingId || bookingId;

    // Check time window — allow 10 min before scheduled time (skip in dev, for demo user and coaches)
    const isDemoOrCoach = decoded.email === "rath1212@gmail.com" || isCoach;
    if (process.env.NODE_ENV !== "development" && !isDemoOrCoach) {
      const scheduledDateTime = new Date(`${booking.scheduledDate}T${booking.scheduledTime}:00`);
      const now = new Date();
      const tenMinBefore = new Date(scheduledDateTime.getTime() - 10 * 60 * 1000);
      const sessionEnd = new Date(scheduledDateTime.getTime() + 60 * 60 * 1000); // 1h after start

      if (now < tenMinBefore) {
        const minutesUntil = Math.ceil((tenMinBefore.getTime() - now.getTime()) / 60000);
        return NextResponse.json({ error: "TOO_EARLY", minutesUntil }, { status: 403 });
      }

      if (now > sessionEnd && booking.sessionStatus === "completed") {
        return NextResponse.json({ error: "SESSION_ENDED" }, { status: 403 });
      }
    }

    // Generate LiveKit token
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: "LiveKit not configured" }, { status: 500 });
    }

    const roomName = `session-${effectiveBookingId}`;
    const participantName = profile?.displayName || decoded.name || "Participant";

    const at = new AccessToken(apiKey, apiSecret, {
      identity: uid,
      name: participantName,
    });
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = await at.toJwt();

    return NextResponse.json({
      token: jwt,
      room: roomName,
      serverUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL,
      isCoach,
      booking: {
        id: booking.id,
        coachId: booking.coachId,
        studentName: booking.studentName,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        sessionStatus: booking.sessionStatus || "scheduled",
      },
    });
  } catch (error) {
    console.error("Session token error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
