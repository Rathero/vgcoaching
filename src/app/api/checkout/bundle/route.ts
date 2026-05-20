import { NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getCoachBundle } from "@/lib/bundles";
import { getCoachById, getCoachingOptionById } from "@/lib/firestore";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { bundleId, idToken, gameSlug } = body;

  if (!bundleId) {
    return Response.json({ error: "bundleId requerido" }, { status: 400 });
  }

  // Auth required to buy bundle (we need to know who owns it)
  if (!idToken) {
    return Response.json({ error: "Inicia sesión para comprar un bono" }, { status: 401 });
  }

  let userId: string;
  let userEmail: string | undefined;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    userId = decoded.uid;
    userEmail = decoded.email;
  } catch {
    return Response.json({ error: "Token inválido" }, { status: 401 });
  }

  const bundle = await getCoachBundle(bundleId);
  if (!bundle || !bundle.active) {
    return Response.json({ error: "Bono no disponible" }, { status: 404 });
  }

  const coach = await getCoachById(bundle.coachId);
  const option = await getCoachingOptionById(bundle.coachingOptionId);
  if (!coach || !option) {
    return Response.json({ error: "Coach o opción no encontrados" }, { status: 404 });
  }

  // Bundle price has no platform commission for now — coach sets the final price.
  const totalCents = bundle.priceCents;

  if (totalCents === 0) {
    // Free bundle — create directly
    const { createUserBundleFromPurchase } = await import("@/lib/bundles");
    await createUserBundleFromPurchase({
      userId,
      coachId: bundle.coachId,
      coachingOptionId: bundle.coachingOptionId,
      bundleId: bundle.id,
      totalSessions: bundle.sessions,
      pricePaidCents: 0,
      stripeSessionId: `free_${Date.now()}_${userId}`,
    });
    return Response.json({ url: `/dashboard?bundle=purchased` });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const stripeConfigured = stripeKey && stripeKey !== "sk_test_placeholder";

  if (!stripeConfigured) {
    // Demo mode — record purchase directly
    const { createUserBundleFromPurchase } = await import("@/lib/bundles");
    await createUserBundleFromPurchase({
      userId,
      coachId: bundle.coachId,
      coachingOptionId: bundle.coachingOptionId,
      bundleId: bundle.id,
      totalSessions: bundle.sessions,
      pricePaidCents: totalCents,
      stripeSessionId: `demo_${Date.now()}_${userId}`,
    });
    return Response.json({ url: `/dashboard?bundle=purchased&demo=1` });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const productName = `Bono ${bundle.sessions}× ${option.name} con ${coach.displayName}`;
    const productDesc = `${bundle.sessions} sesiones · ${option.durationMinutes} min cada una`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: productName, description: productDesc },
          unit_amount: totalCents,
        },
        quantity: 1,
      }],
      metadata: {
        type: "bundle",
        bundleId: bundle.id,
        userId,
        coachId: bundle.coachId,
        coachingOptionId: bundle.coachingOptionId,
        sessions: String(bundle.sessions),
        priceCents: String(totalCents),
      },
      success_url: `${request.nextUrl.origin}/dashboard?bundle=purchased&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/games/${gameSlug || "league-of-legends"}/coach/${coach.slug}`,
    });

    // Record pending purchase intent so we can debug failed webhooks
    await adminDb.collection("userBundlePurchaseIntents").doc(session.id).set({
      stripeSessionId: session.id,
      userId,
      bundleId: bundle.id,
      coachId: bundle.coachId,
      coachingOptionId: bundle.coachingOptionId,
      sessions: bundle.sessions,
      priceCents: totalCents,
      createdAt: new Date().toISOString(),
    });

    return Response.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Bundle checkout error:", err);
    const message = err instanceof Error ? err.message : "Error desconocido";
    return Response.json({ error: `Error al procesar el pago: ${message}` }, { status: 500 });
  }
}
