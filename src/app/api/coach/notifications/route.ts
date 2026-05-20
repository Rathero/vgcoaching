import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { notificationEmail } = await req.json();

    if (typeof notificationEmail !== "string") {
      return NextResponse.json({ error: "notificationEmail debe ser string" }, { status: 400 });
    }

    const trimmed = notificationEmail.trim();
    if (trimmed && !EMAIL_RE.test(trimmed)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data();
    if (!userData?.coachId || userData.role !== "coach") {
      return NextResponse.json({ error: "No eres coach" }, { status: 403 });
    }

    await adminDb.collection("coaches").doc(userData.coachId).update({
      notificationEmail: trimmed || null,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, notificationEmail: trimmed || null });
  } catch (err) {
    console.error("Update notificationEmail error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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

    const { target } = await req.json().catch(() => ({ target: "all" }));

    const updates: Record<string, null | string> = { updatedAt: new Date().toISOString() };
    if (target === "email" || target === "all") {
      updates.notificationEmail = null;
    }
    if (target === "discord" || target === "all") {
      updates.notificationDiscordWebhookUrl = null;
      updates.notificationDiscordWebhookChannelId = null;
      updates.notificationDiscordWebhookGuildId = null;
      updates.notificationDiscordWebhookName = null;
    }

    await adminDb.collection("coaches").doc(userData.coachId).update(updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete notification config error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
