import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("Missing RESEND_API_KEY");
      return NextResponse.json(
        { ok: false, error: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.NOTIFY_FROM || !process.env.NOTIFY_TO) {
      console.error("Missing NOTIFY_FROM or NOTIFY_TO");
      return NextResponse.json(
        { ok: false, error: "Missing NOTIFY_FROM or NOTIFY_TO" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: process.env.NOTIFY_FROM,
      to: process.env.NOTIFY_TO,
      subject: "someone visited your playlist page",
      html: "<p>They clicked the button.</p>",
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: String(error) },
        { status: 500 }
      );
    }

    console.log("Email sent:", data);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("Notify route error:", e);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
