// app/api/session/end/route.js
import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function POST(request) {
  try {
    const { sessionId, durationMs } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: "missing sessionId" },
        { status: 400 }
      );
    }

    await query(
      `
      UPDATE sessions
      SET ended_at = NOW(), duration_ms = $2
      WHERE session_id = $1
    `,
      [sessionId, durationMs ?? null]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("session/end error:", err);
    return NextResponse.json({ ok: false, error: "db error" }, { status: 500 });
  }
}
