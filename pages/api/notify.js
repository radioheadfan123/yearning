// pages/api/notify.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.NOTIFY_FROM,
      to: process.env.NOTIFY_TO,
      subject: "Notify button clicked",
      html: "<p>Someone clicked the notify button on your playlist page.</p>",
    });

    if (error) {
      console.error(error);
      return res.status(500).json({ ok: false });
    }

    return res.status(200).json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false });
  }
}
