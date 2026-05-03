import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getBookingById, getUserProfile, addSessionMaterial } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { bookingId, type, url, content, fileName, fileSize } = await req.json();

    if (!bookingId || !type) {
      return NextResponse.json({ error: "bookingId and type required" }, { status: 400 });
    }

    // Verify participant
    const booking = await getBookingById(bookingId);
    console.log("[materials] bookingId:", bookingId, "found:", !!booking);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const profile = await getUserProfile(uid);
    const isStudent = booking.studentId === uid;
    const isCoach = profile?.role === "coach" && profile?.coachId === booking.coachId;
    const isInvitedPlayer = booking.isGroupSession && booking.invitedPlayers?.some(
      (p: { uid?: string; status: string }) => p.uid === uid && p.status === "accepted"
    );
    const isShadowParticipant = !!booking.parentBookingId && booking.studentId === uid;

    console.log("[materials] uid:", uid, "booking.studentId:", booking.studentId, "isStudent:", isStudent, "isCoach:", isCoach);

    if (!isStudent && !isCoach && !isInvitedPlayer && !isShadowParticipant) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    const materialId = await addSessionMaterial(bookingId, {
      uploadedBy: uid,
      uploaderName: profile?.displayName || decoded.name || "User",
      type,
      url: url || undefined,
      content: content || undefined,
      fileName: fileName || undefined,
      fileSize: fileSize || undefined,
    });

    return NextResponse.json({ success: true, materialId });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Material save error:", err.message, err.stack);
    return NextResponse.json({ error: "Internal error", details: err.message }, { status: 500 });
  }
}
