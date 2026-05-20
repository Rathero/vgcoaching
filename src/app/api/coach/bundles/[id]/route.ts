import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { deleteCoachBundle, getCoachBundle, updateCoachBundle } from "@/lib/bundles";

async function authCoach(req: NextRequest): Promise<{ coachId: string } | NextResponse> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split("Bearer ")[1];
  const decoded = await adminAuth.verifyIdToken(token);
  const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
  const userData = userDoc.data();
  if (!userData?.coachId || userData.role !== "coach") {
    return NextResponse.json({ error: "No eres coach" }, { status: 403 });
  }
  return { coachId: userData.coachId };
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authCoach(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const bundle = await getCoachBundle(id);
    if (!bundle) return NextResponse.json({ error: "Bono no encontrado" }, { status: 404 });
    if (bundle.coachId !== auth.coachId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const patch: Record<string, number | boolean> = {};
    if (body.sessions !== undefined) {
      if (!Number.isInteger(body.sessions) || body.sessions < 2 || body.sessions > 50) {
        return NextResponse.json({ error: "sessions inválido" }, { status: 400 });
      }
      patch.sessions = body.sessions;
    }
    if (body.priceCents !== undefined) {
      if (!Number.isInteger(body.priceCents) || body.priceCents < 0) {
        return NextResponse.json({ error: "priceCents inválido" }, { status: 400 });
      }
      patch.priceCents = body.priceCents;
    }
    if (typeof body.active === "boolean") patch.active = body.active;

    await updateCoachBundle(id, patch);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update bundle error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authCoach(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const bundle = await getCoachBundle(id);
    if (!bundle) return NextResponse.json({ error: "Bono no encontrado" }, { status: 404 });
    if (bundle.coachId !== auth.coachId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await deleteCoachBundle(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete bundle error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
