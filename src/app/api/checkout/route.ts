import { NextRequest } from "next/server";
import { getCoachById, getCoachingOptionById, createBooking, getCommissionRate, calculateCommission } from "@/lib/firestore";
import { adminAuth } from "@/lib/firebase-admin";
import { notifyCoachOfBooking } from "@/lib/notifications";
import { getUserBundleById, redeemBundleSession } from "@/lib/bundles";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { coachId, coachingOptionId, scheduledDate, scheduledTime, studentName, studentEmail, notes, idToken, gameSlug, useBundleId } = body;

  const coach = await getCoachById(coachId);
  const option = await getCoachingOptionById(coachingOptionId);

  if (!coach || !option) {
    return Response.json({ error: "Invalid coach or option" }, { status: 400 });
  }

  // Calculate commission
  const commissionRate = getCommissionRate(coach);
  const { totalCents, commissionCents } = calculateCommission(option.priceCents, commissionRate);

  // Verify Firebase auth token if provided
  let studentId = "guest";
  if (idToken) {
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      studentId = decoded.uid;
    } catch {
      // Allow guest checkout
    }
  }

  // Create booking in Firestore with status "pending"
  const isGroup = option.type === "group_coaching";
  let bookingId: string;
  try {
    bookingId = await createBooking({
      coachId,
      coachingOptionId,
      studentId,
      studentEmail,
      studentName,
      scheduledDate,
      scheduledTime,
      notes: notes || "",
      amountCents: option.priceCents,
      status: "pending",
    });

    // Store commission and group coaching info on the booking
    const { adminDb } = await import("@/lib/firebase-admin");
    const updateData: Record<string, unknown> = { commissionCents };

    if (isGroup) {
      const maxPlayers = option.maxPlayers || 5;
      updateData.isGroupSession = true;
      updateData.groupType = maxPlayers <= 2 ? "duo" : "team";
      updateData.maxPlayers = maxPlayers;
      updateData.invitedPlayers = []; // buyer fills this later via invite
    }

    await adminDb.collection("bookings").doc(bookingId).update(updateData);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "SLOT_TAKEN") {
      return Response.json({ error: "Este horario ya está reservado. Elige otro." }, { status: 409 });
    }
    throw err;
  }

  // Build description
  const groupLabel = isGroup
    ? (option.maxPlayers || 5) <= 2 ? " (Duo)" : " (Equipo de 5)"
    : "";
  const productName = `${option.name} con ${coach.displayName}${groupLabel}`;
  const productDesc = `${option.durationMinutes} min · ${scheduledDate} a las ${scheduledTime}`;

  // Bundle redemption path — user pays with credit instead of money
  if (useBundleId) {
    if (studentId === "guest") {
      const { adminDb } = await import("@/lib/firebase-admin");
      await adminDb.collection("bookings").doc(bookingId).delete();
      return Response.json({ error: "Inicia sesión para usar un bono" }, { status: 401 });
    }
    const userBundle = await getUserBundleById(useBundleId);
    if (!userBundle) {
      const { adminDb } = await import("@/lib/firebase-admin");
      await adminDb.collection("bookings").doc(bookingId).delete();
      return Response.json({ error: "Bono no encontrado" }, { status: 404 });
    }
    try {
      await redeemBundleSession({
        bundleId: useBundleId,
        userId: studentId,
        coachId,
        coachingOptionId,
      });
    } catch (err: unknown) {
      const { adminDb } = await import("@/lib/firebase-admin");
      await adminDb.collection("bookings").doc(bookingId).delete();
      const code = err instanceof Error ? err.message : "BUNDLE_ERROR";
      const messages: Record<string, string> = {
        BUNDLE_NOT_FOUND: "Bono no encontrado",
        BUNDLE_NOT_OWNED: "Este bono no es tuyo",
        BUNDLE_COACH_MISMATCH: "El bono no es de este coach",
        BUNDLE_OPTION_MISMATCH: "El bono es para otro tipo de sesión",
        BUNDLE_NOT_ACTIVE: "El bono no está activo",
        BUNDLE_DEPLETED: "Ya no quedan sesiones en este bono",
      };
      return Response.json({ error: messages[code] || "Error al usar el bono" }, { status: 400 });
    }

    const { adminDb } = await import("@/lib/firebase-admin");
    await adminDb.collection("bookings").doc(bookingId).update({
      status: "confirmed",
      bundleId: useBundleId,
      amountCents: 0,
      updatedAt: new Date().toISOString(),
    });
    await notifyCoachOfBooking(bookingId);
    return Response.json({ url: `/booking/success?booking=${bookingId}&bundle=1` });
  }

  // Free booking path — skip Stripe entirely when total is 0
  if (totalCents === 0) {
    console.log(`🆓 Free booking ${bookingId} — skipping Stripe`);
    const { adminDb } = await import("@/lib/firebase-admin");
    await adminDb.collection("bookings").doc(bookingId).update({
      status: "confirmed",
      updatedAt: new Date().toISOString(),
    });
    await notifyCoachOfBooking(bookingId);
    return Response.json({ url: `/booking/success?booking=${bookingId}&free=true` });
  }

  // Stripe checkout
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const stripeConfigured = stripeKey && stripeKey !== "sk_test_placeholder";

  if (stripeConfigured) {
    // Stripe IS configured — payment is required, errors must NOT fall through to demo mode
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: studentEmail,
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: productName,
                description: productDesc,
              },
              unit_amount: totalCents, // Price + commission
            },
            quantity: 1,
          },
        ],
        metadata: {
          bookingId,
          coachId,
          coachingOptionId,
          scheduledDate,
          scheduledTime,
          studentName,
          studentId,
          commissionCents: commissionCents.toString(),
          basePriceCents: option.priceCents.toString(),
        },
        success_url: `${request.nextUrl.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking=${bookingId}`,
        cancel_url: `${request.nextUrl.origin}/games/${gameSlug || 'league-of-legends'}/coach/${coach.slug}`,
      });

      // Save Stripe session ID to booking
      const { adminDb } = await import("@/lib/firebase-admin");
      await adminDb.collection("bookings").doc(bookingId).update({
        stripeSessionId: session.id,
      });

      return Response.json({ url: session.url });
    } catch (err: unknown) {
      console.error("❌ Stripe checkout error:", err);

      // Cancel the pending booking since payment failed
      try {
        const { adminDb } = await import("@/lib/firebase-admin");
        await adminDb.collection("bookings").doc(bookingId).update({
          status: "cancelled",
          updatedAt: new Date().toISOString(),
        });
      } catch (cleanupErr) {
        console.error("Failed to cancel booking after Stripe error:", cleanupErr);
      }

      const message = err instanceof Error ? err.message : "Error desconocido";
      return Response.json(
        { error: `Error al procesar el pago: ${message}` },
        { status: 500 }
      );
    }
  }

  // Demo mode: only when Stripe is NOT configured at all
  console.warn("⚠️ Stripe not configured — confirming booking in demo mode");
  const { adminDb } = await import("@/lib/firebase-admin");
  await adminDb.collection("bookings").doc(bookingId).update({
    status: "confirmed",
  });
  await notifyCoachOfBooking(bookingId);

  const successUrl = `/booking/success?booking=${bookingId}&demo=true`;
  return Response.json({ url: successUrl });
}
