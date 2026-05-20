import { adminDb } from "./firebase-admin";
import { getCoachById, getCoachingOptionById } from "./firestore";
import type { Booking, Coach, CoachingOption } from "./types";
import { formatPrice } from "./utils";

const RESEND_API_URL = "https://api.resend.com/emails";

interface BookingContext {
  booking: Booking;
  coach: Coach;
  option: CoachingOption | null;
}

async function loadBookingContext(bookingId: string): Promise<BookingContext | null> {
  const doc = await adminDb.collection("bookings").doc(bookingId).get();
  if (!doc.exists) return null;
  const booking = { id: doc.id, ...doc.data() } as Booking;

  const coach = await getCoachById(booking.coachId);
  if (!coach) return null;

  const option = booking.coachingOptionId
    ? await getCoachingOptionById(booking.coachingOptionId)
    : null;

  return { booking, coach, option };
}

function buildSubject(ctx: BookingContext): string {
  const { booking, option } = ctx;
  const sessionName = option?.name || "Sesión de coaching";
  return `Nueva reserva: ${sessionName} — ${booking.scheduledDate} ${booking.scheduledTime}`;
}

function buildPlainBody(ctx: BookingContext): string {
  const { booking, coach, option } = ctx;
  const groupSuffix = booking.isGroupSession
    ? ` (grupo · ${booking.groupType === "duo" ? "Duo" : "Equipo"})`
    : "";

  return [
    `Hola ${coach.displayName},`,
    ``,
    `Tienes una nueva reserva confirmada.`,
    ``,
    `Sesión: ${option?.name || "Coaching"}${groupSuffix}`,
    `Duración: ${option?.durationMinutes ?? "?"} min`,
    `Fecha: ${booking.scheduledDate} a las ${booking.scheduledTime}`,
    ``,
    `Alumno: ${booking.studentName}`,
    booking.notes ? `Notas: ${booking.notes}` : ``,
    ``,
    `Importe pagado: ${formatPrice(booking.amountCents)}`,
    `Booking ID: ${booking.id}`,
  ].filter(Boolean).join("\n");
}

function buildHtmlBody(ctx: BookingContext): string {
  const { booking, coach, option } = ctx;
  const groupSuffix = booking.isGroupSession
    ? ` <small>(grupo · ${booking.groupType === "duo" ? "Duo" : "Equipo"})</small>`
    : "";

  const notesRow = booking.notes
    ? `<tr><td><strong>Notas</strong></td><td>${escapeHtml(booking.notes)}</td></tr>`
    : "";

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
  <h2 style="margin-top:0;">Nueva reserva confirmada</h2>
  <p>Hola <strong>${escapeHtml(coach.displayName)}</strong>, acabas de recibir una nueva reserva.</p>
  <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;background:#f7f7f8;border-radius:8px;">
    <tr><td><strong>Sesión</strong></td><td>${escapeHtml(option?.name || "Coaching")}${groupSuffix}</td></tr>
    <tr><td><strong>Duración</strong></td><td>${option?.durationMinutes ?? "?"} min</td></tr>
    <tr><td><strong>Fecha</strong></td><td>${escapeHtml(booking.scheduledDate)} a las ${escapeHtml(booking.scheduledTime)}</td></tr>
    <tr><td><strong>Alumno</strong></td><td>${escapeHtml(booking.studentName)}</td></tr>
    ${notesRow}
    <tr><td><strong>Importe</strong></td><td>${formatPrice(booking.amountCents)}</td></tr>
    <tr><td><strong>Booking ID</strong></td><td><code>${escapeHtml(booking.id)}</code></td></tr>
  </table>
</div>`.trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(ctx: BookingContext): Promise<void> {
  const to = ctx.coach.notificationEmail?.trim();
  if (!to) {
    console.log(`[notify] coach ${ctx.coach.id} has no notificationEmail — skip email`);
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.warn("[notify] RESEND_API_KEY or EMAIL_FROM missing — skip email");
    return;
  }

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: buildSubject(ctx),
      text: buildPlainBody(ctx),
      html: buildHtmlBody(ctx),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${text}`);
  }
}

async function sendDiscord(ctx: BookingContext): Promise<void> {
  const url = ctx.coach.notificationDiscordWebhookUrl?.trim();
  if (!url) {
    console.log(`[notify] coach ${ctx.coach.id} has no notificationDiscordWebhookUrl — skip Discord`);
    return;
  }

  const { booking, option } = ctx;
  const fields = [
    { name: "Sesión", value: option?.name || "Coaching", inline: true },
    { name: "Duración", value: `${option?.durationMinutes ?? "?"} min`, inline: true },
    { name: "Fecha", value: `${booking.scheduledDate} · ${booking.scheduledTime}`, inline: false },
    { name: "Alumno", value: booking.studentName, inline: true },
    { name: "Importe", value: formatPrice(booking.amountCents), inline: true },
  ];
  if (booking.notes) {
    fields.push({ name: "Notas", value: booking.notes.slice(0, 1024), inline: false });
  }
  if (booking.isGroupSession) {
    fields.push({
      name: "Grupo",
      value: booking.groupType === "duo" ? "Duo" : "Equipo",
      inline: true,
    });
  }

  const payload = {
    username: "VG Coaching",
    embeds: [{
      title: "Nueva reserva confirmada",
      description: `Hola **${ctx.coach.displayName}**, tienes una nueva reserva.`,
      color: 0x5865F2,
      fields,
      footer: { text: `Booking ID: ${booking.id}` },
      timestamp: new Date().toISOString(),
    }],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Discord webhook ${res.status}: ${text}`);
  }
}

/**
 * Notify a coach that a booking was confirmed.
 * Sends email + Discord based on what the coach configured in their profile.
 * Never throws — failures are logged so they don't break the payment flow.
 */
export async function notifyCoachOfBooking(bookingId: string): Promise<void> {
  try {
    const ctx = await loadBookingContext(bookingId);
    if (!ctx) {
      console.warn(`[notify] booking ${bookingId} or its coach not found`);
      return;
    }

    // Skip notification for shadow bookings (invited group players)
    if (ctx.booking.parentBookingId) {
      console.log(`[notify] booking ${bookingId} is a shadow booking — skip`);
      return;
    }

    const results = await Promise.allSettled([sendEmail(ctx), sendDiscord(ctx)]);
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`[notify] ${i === 0 ? "email" : "discord"} failed for booking ${bookingId}:`, r.reason);
      }
    });
  } catch (err) {
    console.error(`[notify] unexpected error for booking ${bookingId}:`, err);
  }
}
