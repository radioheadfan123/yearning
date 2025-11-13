import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasKey: !!process.env.RESEND_API_KEY,
    keyPreview: process.env.RESEND_API_KEY
      ? process.env.RESEND_API_KEY.slice(0, 6) + "..."
      : null,
  });
}
