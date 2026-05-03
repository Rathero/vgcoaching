import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { createCoachApplication, getCoachApplicationByUserId } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // Check if user already has a pending/approved application
    const existing = await getCoachApplicationByUserId(uid);
    if (existing) {
      return NextResponse.json(
        { error: `Ya tienes una solicitud ${existing.status === "pending" ? "pendiente" : existing.status === "approved" ? "aprobada" : "rechazada"}.` },
        { status: 409 }
      );
    }

    const body = await req.json();
    const {
      displayName, avatarUrl, gameId, inGameName, rank, rankTier,
      roles, specialties, champions, bio, longBio, country, languages,
      coachingTypes, liveCoachingPrice, vodReviewPrice, duoCoachingPrice,
      championSpecificPrice, groupCoachingPrice,
    } = body;

    // Validation
    if (!displayName || !gameId || !inGameName || !rank || !rankTier || !bio) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const applicationId = await createCoachApplication({
      userId: uid,
      displayName,
      email: decoded.email || "",
      avatarUrl: avatarUrl || "",
      gameId,
      inGameName,
      rank,
      rankTier,
      roles: roles || [],
      specialties: specialties || [],
      champions: champions || [],
      bio,
      longBio: longBio || bio,
      country: country || "",
      languages: languages || ["Español"],
      coachingTypes: coachingTypes || ["live_coaching"],
      liveCoachingPrice: liveCoachingPrice || undefined,
      vodReviewPrice: vodReviewPrice || undefined,
      duoCoachingPrice: duoCoachingPrice || undefined,
      championSpecificPrice: championSpecificPrice || undefined,
      groupCoachingPrice: groupCoachingPrice || undefined,
    });

    // Update user profile to pending coach status
    await adminDb.collection("users").doc(uid).update({
      coachApplicationStatus: "pending",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, applicationId });
  } catch (error) {
    console.error("Coach application error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const application = await getCoachApplicationByUserId(decoded.uid);
    return NextResponse.json({ application });
  } catch (error) {
    console.error("Coach application check error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
