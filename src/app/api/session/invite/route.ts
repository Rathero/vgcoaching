import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import type { GroupPlayer, Booking } from "@/lib/types";

// POST: Send invite to a player
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { bookingId, email, displayName } = await req.json();

    if (!bookingId || !email) {
      return NextResponse.json({ error: "bookingId y email son obligatorios" }, { status: 400 });
    }

    // Get booking and verify ownership
    const bookingDoc = await adminDb.collection("bookings").doc(bookingId).get();
    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking no encontrado" }, { status: 404 });
    }

    const booking = { id: bookingDoc.id, ...bookingDoc.data() } as Booking;

    if (booking.studentId !== uid) {
      return NextResponse.json({ error: "Solo el comprador puede invitar jugadores" }, { status: 403 });
    }

    if (!booking.isGroupSession) {
      return NextResponse.json({ error: "Esta sesión no es de grupo" }, { status: 400 });
    }

    const currentPlayers = booking.invitedPlayers || [];
    const maxInvites = (booking.maxPlayers || 5) - 1; // -1 because buyer is already a player

    if (currentPlayers.length >= maxInvites) {
      return NextResponse.json({ error: `Ya has invitado al máximo de jugadores (${maxInvites})` }, { status: 400 });
    }

    // Check for duplicate email
    if (currentPlayers.some(p => p.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: "Este email ya ha sido invitado" }, { status: 409 });
    }

    // Check if invited user exists in the platform
    let invitedUid: string | undefined;
    try {
      const userRecord = await adminAuth.getUserByEmail(email);
      invitedUid = userRecord.uid;
    } catch {
      // User doesn't exist yet — that's OK, they'll see it when they register
    }

    const newPlayer: GroupPlayer = {
      uid: invitedUid,
      email: email.toLowerCase(),
      displayName: displayName || email.split("@")[0],
      status: invitedUid ? "accepted" : "pending",
      invitedAt: new Date().toISOString(),
    };

    // Add to the invited players array
    await adminDb.collection("bookings").doc(bookingId).update({
      invitedPlayers: [...currentPlayers, newPlayer],
      updatedAt: new Date().toISOString(),
    });

    // If user exists, create a "shadow" booking so it appears on their dashboard
    if (invitedUid) {
      await createShadowBooking(booking, invitedUid, email, displayName || email.split("@")[0]);
    }

    return NextResponse.json({
      success: true,
      player: newPlayer,
      totalInvited: currentPlayers.length + 1,
      maxInvites,
    });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// DELETE: Remove an invited player
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { bookingId, email } = await req.json();

    const bookingDoc = await adminDb.collection("bookings").doc(bookingId).get();
    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking no encontrado" }, { status: 404 });
    }

    const booking = { id: bookingDoc.id, ...bookingDoc.data() } as Booking;

    if (booking.studentId !== uid) {
      return NextResponse.json({ error: "No tienes permiso" }, { status: 403 });
    }

    const updatedPlayers = (booking.invitedPlayers || []).filter(
      p => p.email.toLowerCase() !== email.toLowerCase()
    );

    await adminDb.collection("bookings").doc(bookingId).update({
      invitedPlayers: updatedPlayers,
      updatedAt: new Date().toISOString(),
    });

    // Remove shadow booking if it exists
    const shadowSnap = await adminDb.collection("bookings")
      .where("parentBookingId", "==", bookingId)
      .where("studentEmail", "==", email.toLowerCase())
      .get();

    for (const doc of shadowSnap.docs) {
      await doc.ref.delete();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove invite error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Helper: create a shadow booking for an invited player
async function createShadowBooking(
  parentBooking: Booking,
  invitedUid: string,
  email: string,
  displayName: string
) {
  // Check if shadow already exists
  const existing = await adminDb.collection("bookings")
    .where("parentBookingId", "==", parentBooking.id)
    .where("studentId", "==", invitedUid)
    .get();

  if (!existing.empty) return; // Already exists

  await adminDb.collection("bookings").add({
    coachId: parentBooking.coachId,
    coachingOptionId: parentBooking.coachingOptionId,
    studentId: invitedUid,
    studentName: displayName,
    studentEmail: email,
    scheduledDate: parentBooking.scheduledDate,
    scheduledTime: parentBooking.scheduledTime,
    status: parentBooking.status,
    notes: "",
    amountCents: 0, // Invited player doesn't pay
    isGroupSession: true,
    groupType: parentBooking.groupType,
    invitedBy: parentBooking.studentId,
    parentBookingId: parentBooking.id,
    sessionStatus: parentBooking.sessionStatus || "scheduled",
    livekitRoom: parentBooking.livekitRoom,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
