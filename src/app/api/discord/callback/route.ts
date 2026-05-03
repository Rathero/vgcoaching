import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || "";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state"); // Contains the Firebase UID

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard?error=discord_missing_params", req.url));
  }

  if (!DISCORD_CLIENT_ID || DISCORD_CLIENT_ID === "your-discord-client-id") {
    return NextResponse.redirect(new URL("/dashboard?error=discord_not_configured", req.url));
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      console.error("Discord token error:", await tokenRes.text());
      return NextResponse.redirect(new URL("/dashboard?error=discord_auth_failed", req.url));
    }

    const tokenData = await tokenRes.json();

    // Get user info
    const userRes = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/dashboard?error=discord_user_failed", req.url));
    }

    const discordUser = await userRes.json();

    // Save Discord info to user profile
    const discordData = {
      discordId: discordUser.id,
      discordUsername: discordUser.global_name || discordUser.username,
      discordAvatar: discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : null,
      updatedAt: new Date().toISOString(),
    };

    // The state param contains the Firebase UID
    await adminDb.collection("users").doc(state).update(discordData);

    // If user is a coach, also update coach profile
    const userDoc = await adminDb.collection("users").doc(state).get();
    const userData = userDoc.data();
    if (userData?.role === "coach" && userData?.coachId) {
      await adminDb.collection("coaches").doc(userData.coachId).update(discordData);
    }

    return NextResponse.redirect(new URL("/dashboard?discord=connected", req.url));
  } catch (error) {
    console.error("Discord callback error:", error);
    return NextResponse.redirect(new URL("/dashboard?error=discord_error", req.url));
  }
}
