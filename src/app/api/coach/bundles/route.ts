import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { createCoachBundle, listCoachBundles } from "@/lib/bundles";
import { getCoachingOptionById } from "@/lib/firestore";

// GET: public list of bundles for a coach (used by booking page).
// ?coachId=...  +  ?activeOnly=1
export async function GET(req: NextRequest) {
  const coachId = req.nextUrl.searchParams.get("coachId");
  if (!coachId) {
    return NextResponse.json({ error: "coachId required" }, { status: 400 });
  }
  const activeOnly = req.nextUrl.searchParams.get("activeOnly") === "1";
  const bundles = await listCoachBundles(coachId, activeOnly);
  return NextResponse.json({ bundles });
}

// POST: coach creates a new bundle. Requires auth + role=coach.
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data();
    if (!userData?.coachId || userData.role !== "coach") {
      return NextResponse.json({ error: "No eres coach" }, { status: 403 });
    }

    const { coachingOptionId, sessions, priceCents, active } = await req.json();

    if (!coachingOptionId || typeof coachingOptionId !== "string") {
      return NextResponse.json({ error: "coachingOptionId requerido" }, { status: 400 });
    }
    if (!Number.isInteger(sessions) || sessions < 2 || sessions > 50) {
      return NextResponse.json({ error: "sessions debe ser entero entre 2 y 50" }, { status: 400 });
    }
    if (!Number.isInteger(priceCents) || priceCents < 0) {
      return NextResponse.json({ error: "priceCents inválido" }, { status: 400 });
    }

    // Verify the option belongs to this coach and is individual
    const option = await getCoachingOptionById(coachingOptionId);
    if (!option || option.coachId !== userData.coachId) {
      return NextResponse.json({ error: "Opción de coaching no encontrada" }, { status: 404 });
    }
    if (option.type === "group_coaching") {
      return NextResponse.json({ error: "Los bonos no aplican a sesiones de grupo" }, { status: 400 });
    }

    const id = await createCoachBundle({
      coachId: userData.coachId,
      coachingOptionId,
      sessions,
      priceCents,
      active: typeof active === "boolean" ? active : true,
    });
    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Create bundle error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
