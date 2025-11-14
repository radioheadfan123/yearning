import { NextResponse } from "next/server";
import { Resend } from "resend";
import { query } from "../../lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const headers = request.headers;

    const ip =
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headers.get("x-real-ip") ||
      "unknown";

    let sessionId = null;
    try {
      const body = await request.json();
      sessionId = body?.sessionId ?? null;
    } catch {
      // no body, ignore
    }

    // log click into notifications table
    await query(
      `
      INSERT INTO notifications (ip, session_id, clicked_at)
      VALUES ($1, $2, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago'))
      `,
      [ip, sessionId]
    );

    // send email via Resend
    await resend.emails.send({
      from: process.env.NOTIFY_FROM,
      to: process.env.NOTIFY_TO,
      subject: "someone visited your playlist",
      text: `The button was clicked.\nIP: ${ip}\nSession: ${sessionId ?? "unknown"}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("notify error:", err);
    return NextResponse.json({ ok: false, error: "notify failed" }, { status: 500 });
  }
}
