// app/api/session/start/route.js
import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function POST(request) {
  try {
    const headers = request.headers;

    const ip =
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headers.get("x-real-ip") ||
      "unknown";

    const userAgent = headers.get("user-agent") || null;

    const sessionId = crypto.randomUUID();

    await query(
      `
      INSERT INTO sessions (session_id, ip, user_agent, started_at)
      VALUES ($1, $2, $3, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago')
)
    `,
      [sessionId, ip, userAgent]
    );

    return NextResponse.json({ ok: true, sessionId });
  } catch (err) {
    console.error("session/start error:", err);
    return NextResponse.json({ ok: false, error: "db error" }, { status: 500 });
  }
}
