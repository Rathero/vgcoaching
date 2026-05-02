import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getBookingById, getUserProfile, updateBookingSession } from "@/lib/firestore";
import {
  EgressClient,
  RoomServiceClient,
  EncodedFileOutput,
  EncodedFileType,
  GCPUpload,
} from "livekit-server-sdk";

function getLiveKitHost(): string {
  // Convert wss://xxx.livekit.cloud to https://xxx.livekit.cloud
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "";
  return wsUrl.replace("wss://", "https://").replace("ws://", "http://");
}

function getEgressClient(): EgressClient | null {
  const host = getLiveKitHost();
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!host || !apiKey || !apiSecret) {
    console.warn("LiveKit credentials not configured for Egress");
    return null;
  }

  return new EgressClient(host, apiKey, apiSecret);
}

function getGCPCredentials(): string {
  return process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "";
}

function getStorageBucket(): string {
  return process.env.NEXT_PUBLIC_FB_PROJECT_ID
    ? `${process.env.NEXT_PUBLIC_FB_PROJECT_ID}.firebasestorage.app`
    : "videogamecoaching-a4794.firebasestorage.app";
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { bookingId, action } = await req.json();
    if (!bookingId || !["start", "end"].includes(action)) {
      return NextResponse.json({ error: "bookingId and action (start|end) required" }, { status: 400 });
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

    const roomName = `session-${bookingId}`;

    if (action === "start") {
      // Skip if already live (avoid duplicate recordings)
      if (booking.sessionStatus === "live") {
        return NextResponse.json({ success: true, sessionStatus: "live", alreadyStarted: true });
      }

      // Mark session as live
      await updateBookingSession(bookingId, {
        sessionStatus: "live",
        sessionStartedAt: new Date().toISOString(),
        livekitRoom: roomName,
      });

      // Start LiveKit Egress recording
      const egressClient = getEgressClient();
      let egressId: string | undefined;

      if (egressClient) {
        try {
          const gcpCredentials = getGCPCredentials();
          const bucket = getStorageBucket();

          const fileOutput = new EncodedFileOutput({
            fileType: EncodedFileType.MP4,
            filepath: `recordings/${bookingId}/{room_name}_{time}.mp4`,
            output: {
              case: "gcp",
              value: new GCPUpload({
                credentials: gcpCredentials,
                bucket: bucket,
              }),
            },
          });

          const egressInfo = await egressClient.startRoomCompositeEgress(
            roomName,
            fileOutput,
            { layout: "grid" }
          );

          egressId = egressInfo.egressId;

          if (egressId) {
            await updateBookingSession(bookingId, { egressId });
          }

          console.log(`Recording started for booking ${bookingId}, egress: ${egressId}`);
        } catch (egressError) {
          // Log but don't fail the session — recording is supplementary
          console.error("Failed to start recording:", egressError);
        }
      }

      return NextResponse.json({
        success: true,
        sessionStatus: "live",
        recording: !!egressId,
        egressId,
      });
    }

    if (action === "end") {
      let recordingUrl: string | undefined;

      // Stop LiveKit Egress recording
      const egressClient = getEgressClient();
      if (egressClient && booking.egressId) {
        try {
          const stoppedEgress = await egressClient.stopEgress(booking.egressId);
          console.log(`Recording stopped for booking ${bookingId}, status: ${stoppedEgress.status}`);

          // Extract recording URL from file results
          if (stoppedEgress.fileResults && stoppedEgress.fileResults.length > 0) {
            const fileResult = stoppedEgress.fileResults[0];
            // The location field contains the GCS path
            const filename = (fileResult as { filename?: string }).filename;
            if (filename) {
              // Build a Firebase Storage download URL
              const bucket = getStorageBucket();
              recordingUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filename)}?alt=media`;
            }
          }
        } catch (egressError) {
          console.error("Failed to stop recording:", egressError);

          // Try to get recording URL from listing egress
          try {
            const egresses = await egressClient.listEgress({ egressId: booking.egressId });
            if (egresses.length > 0 && egresses[0].fileResults?.length) {
              const fileResult = egresses[0].fileResults[0];
              const filename = (fileResult as { filename?: string }).filename;
              if (filename) {
                const bucket = getStorageBucket();
                recordingUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filename)}?alt=media`;
              }
            }
          } catch {
            console.error("Failed to list egress for recording URL");
          }
        }
      }

      // Close the LiveKit room so it doesn't linger
      try {
        const host = getLiveKitHost();
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        if (host && apiKey && apiSecret) {
          const roomService = new RoomServiceClient(host, apiKey, apiSecret);
          await roomService.deleteRoom(roomName);
          console.log(`Room ${roomName} deleted`);
        }
      } catch (roomErr) {
        console.error("Failed to delete room:", roomErr);
      }

      // Mark session as completed
      await updateBookingSession(bookingId, {
        sessionStatus: "completed",
        sessionEndedAt: new Date().toISOString(),
        status: "completed",
        ...(recordingUrl ? { recordingUrl } : {}),
      });

      return NextResponse.json({
        success: true,
        sessionStatus: "completed",
        recordingUrl: recordingUrl || null,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Session manage error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
