// pages/api/session/start.js
import { query } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const forwarded = req.headers["x-forwarded-for"] || "";
  const ip = forwarded.split(",")[0].trim() || "unknown";

  try {
    const result = await query(
      "insert into sessions (ip, started_at) values ($1, now()) returning id",
      [ip]
    );

    const sessionId = result.rows[0].id;
    return res.status(200).json({ sessionId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "db error" });
  }
}
