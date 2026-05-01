import { NextRequest } from "next/server";
import { getCoachById, getCoachingOptionById, createBooking } from "@/lib/firestore";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { coachId, coachingOptionId, scheduledDate, scheduledTime, studentName, studentEmail, notes, idToken } = body;

  const coach = await getCoachById(coachId);
  const option = await getCoachingOptionById(coachingOptionId);

  if (!coach || !option) {
    return Response.json({ error: "Invalid coach or option" }, { status: 400 });
  }

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
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "SLOT_TAKEN") {
      return Response.json({ error: "Este horario ya está reservado. Elige otro." }, { status: 409 });
    }
    throw err;
  }

  // Try Stripe checkout
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && stripeKey !== "sk_test_placeholder") {
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
                name: `${option.name} con ${coach.displayName}`,
                description: `${option.durationMinutes} min · ${scheduledDate} a las ${scheduledTime}`,
              },
              unit_amount: option.priceCents,
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
        },
        success_url: `${request.nextUrl.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking=${bookingId}`,
        cancel_url: `${request.nextUrl.origin}/games/league-of-legends/coach/${coach.slug}`,
      });

      // Save Stripe session ID to booking
      const { adminDb } = await import("@/lib/firebase-admin");
      await adminDb.collection("bookings").doc(bookingId).update({
        stripeSessionId: session.id,
      });

      return Response.json({ url: session.url });
    } catch (err: unknown) {
      console.error("Stripe error:", err);
    }
  }

  // Demo mode: confirm booking directly
  const { adminDb } = await import("@/lib/firebase-admin");
  await adminDb.collection("bookings").doc(bookingId).update({
    status: "confirmed",
  });

  const successUrl = `/booking/success?booking=${bookingId}&demo=true`;
  return Response.json({ url: successUrl });
}
