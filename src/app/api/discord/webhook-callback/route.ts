import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
const DISCORD_WEBHOOK_REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_REDIRECT_URI || "";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state"); // Firebase UID
  const errorParam = req.nextUrl.searchParams.get("error");

  if (errorParam) {
    return NextResponse.redirect(new URL(`/dashboard?discord_webhook_error=${errorParam}`, req.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard?discord_webhook_error=missing_params", req.url));
  }

  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_WEBHOOK_REDIRECT_URI) {
    return NextResponse.redirect(new URL("/dashboard?discord_webhook_error=not_configured", req.url));
  }

  try {
    const tokenRes = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_WEBHOOK_REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      console.error("Discord webhook token error:", await tokenRes.text());
      return NextResponse.redirect(new URL("/dashboard?discord_webhook_error=auth_failed", req.url));
    }

    const tokenData = await tokenRes.json();
    const webhook = tokenData.webhook;

    if (!webhook?.url) {
      console.error("Discord token response missing webhook:", tokenData);
      return NextResponse.redirect(new URL("/dashboard?discord_webhook_error=no_webhook", req.url));
    }

    // Verify caller is a coach
    const userDoc = await adminDb.collection("users").doc(state).get();
    const userData = userDoc.data();
    if (!userData?.coachId || userData.role !== "coach") {
      return NextResponse.redirect(new URL("/dashboard?discord_webhook_error=not_a_coach", req.url));
    }

    await adminDb.collection("coaches").doc(userData.coachId).update({
      notificationDiscordWebhookUrl: webhook.url,
      notificationDiscordWebhookChannelId: webhook.channel_id || null,
      notificationDiscordWebhookGuildId: webhook.guild_id || null,
      notificationDiscordWebhookName: webhook.name || null,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.redirect(new URL("/dashboard?discord_webhook=connected", req.url));
  } catch (err) {
    console.error("Discord webhook callback error:", err);
    return NextResponse.redirect(new URL("/dashboard?discord_webhook_error=server_error", req.url));
  }
}
