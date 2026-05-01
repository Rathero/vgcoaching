import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getBookingById, getUserProfile, updateBookingSession } from "@/lib/firestore";
import { EgressClient, EgressStatus } from "livekit-server-sdk";

function getLiveKitHost(): string {
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "";
  return wsUrl.replace("wss://", "https://").replace("ws://", "http://");
}

function getStorageBucket(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`
    : "videogamecoaching-a4794.firebasestorage.app";
}

/**
 * GET /api/session/recording?bookingId=xxx
 * Check recording status and retrieve URL if available
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const bookingId = req.nextUrl.searchParams.get("bookingId");
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId required" }, { status: 400 });
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify participant
    const profile = await getUserProfile(uid);
    const isStudent = booking.studentId === uid;
    const isCoach = profile?.role === "coach" && profile?.coachId === booking.coachId;
    if (!isStudent && !isCoach) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    // If we already have a recording URL, return it
    if (booking.recordingUrl) {
      return NextResponse.json({
        status: "ready",
        recordingUrl: booking.recordingUrl,
      });
    }

    // If there's an egressId, check its status
    if (booking.egressId) {
      const host = getLiveKitHost();
      const apiKey = process.env.LIVEKIT_API_KEY;
      const apiSecret = process.env.LIVEKIT_API_SECRET;

      if (host && apiKey && apiSecret) {
        try {
          const egressClient = new EgressClient(host, apiKey, apiSecret);
          const egresses = await egressClient.listEgress({ egressId: booking.egressId });

          if (egresses.length > 0) {
            const egress = egresses[0];
            const egressStatus = egress.status;

            // If egress is complete, extract URL and save to booking
            if (egressStatus === EgressStatus.EGRESS_COMPLETE) {
              let recordingUrl: string | undefined;

              if (egress.fileResults?.length) {
                const fileResult = egress.fileResults[0];
                const filename = (fileResult as { filename?: string }).filename;
                if (filename) {
                  const bucket = getStorageBucket();
                  recordingUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filename)}?alt=media`;
                }
              }

              if (recordingUrl) {
                // Save the recording URL to the booking
                await updateBookingSession(bookingId, { recordingUrl });

                return NextResponse.json({
                  status: "ready",
                  recordingUrl,
                });
              }
            }

            // Map status to user-friendly string
            const statusMap: Record<number, string> = {
              [EgressStatus.EGRESS_STARTING]: "starting",
              [EgressStatus.EGRESS_ACTIVE]: "recording",
              [EgressStatus.EGRESS_ENDING]: "processing",
              [EgressStatus.EGRESS_COMPLETE]: "ready",
              [EgressStatus.EGRESS_FAILED]: "failed",
              [EgressStatus.EGRESS_ABORTED]: "aborted",
              [EgressStatus.EGRESS_LIMIT_REACHED]: "limit_reached",
            };

            return NextResponse.json({
              status: statusMap[egressStatus] || "unknown",
              egressStatus,
            });
          }
        } catch (error) {
          console.error("Egress check error:", error);
        }
      }
    }

    return NextResponse.json({ status: "none" });
  } catch (error) {
    console.error("Recording status error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
