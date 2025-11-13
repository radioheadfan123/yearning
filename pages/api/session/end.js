// pages/api/session/end.js
import { query } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { sessionId, durationMs } = req.body || {};
    if (!sessionId) return res.status(400).json({ error: "no sessionId" });

    await query(
      "update sessions set ended_at = now(), duration_ms = $1 where id = $2",
      [durationMs ?? null, sessionId]
    );

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "db error" });
  }
}
