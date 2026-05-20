import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { notifyCoachOfBooking } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || stripeKey === "sk_test_placeholder") {
    return Response.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeKey);

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return Response.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return Response.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        // Update booking status to confirmed
        await adminDb.collection("bookings").doc(bookingId).update({
          status: "confirmed",
          stripePaymentId: session.payment_intent as string,
          updatedAt: new Date().toISOString(),
        });
        console.log(`✅ Booking ${bookingId} confirmed via webhook`);
        await notifyCoachOfBooking(bookingId);
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        // Release the slot by cancelling the booking
        await adminDb.collection("bookings").doc(bookingId).update({
          status: "cancelled",
          updatedAt: new Date().toISOString(),
        });
        console.log(`❌ Booking ${bookingId} cancelled (session expired)`);
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object;
      const paymentIntentId = charge.payment_intent as string;

      if (paymentIntentId) {
        // Find booking by stripe payment ID and cancel it
        const snap = await adminDb.collection("bookings")
          .where("stripePaymentId", "==", paymentIntentId)
          .limit(1).get();

        if (!snap.empty) {
          await snap.docs[0].ref.update({
            status: "cancelled",
            updatedAt: new Date().toISOString(),
          });
          console.log(`🔄 Booking refunded for payment ${paymentIntentId}`);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return Response.json({ received: true });
}
