import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { listUserBundles } from "@/lib/bundles";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const bundles = await listUserBundles(decoded.uid);
    return NextResponse.json({ bundles });
  } catch (err) {
    console.error("List user bundles error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
