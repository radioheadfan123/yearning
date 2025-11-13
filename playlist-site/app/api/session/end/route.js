import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, durationMs } = body || {};

    if (!sessionId) {
      return NextResponse.json({ error: "no sessionId" }, { status: 400 });
    }

    await query(
      "update sessions set ended_at = now(), duration_ms = $1 where id = $2",
      [durationMs ?? null, sessionId]
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
