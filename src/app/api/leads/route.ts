import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

/**
 * POST /api/leads
 * Store lead capture data from Masterclass and Coach Request forms.
 * Body: { type: "masterclass" | "coach_request", name, email, ...extra }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email } = body;

    if (!type || !name || !email) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }

    await adminDb.collection("leads").add({
      type,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      // Coach request extra fields
      ...(body.roles && { roles: body.roles }),
      ...(body.specifications && { specifications: body.specifications.trim() }),
      ...(body.gameSlug && { gameSlug: body.gameSlug }),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
