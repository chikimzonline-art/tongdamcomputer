import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/leads
 * Public endpoint - accepts lead submissions from any form on the site.
 * Body: { name, email?, phone, source, subject, message }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, source, subject, message } = body;

    if (!name || !phone || !source || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const lead = await db.lead.create({
      data: {
        name: String(name).slice(0, 120),
        email: email ? String(email).slice(0, 160) : null,
        phone: String(phone).slice(0, 30),
        source: String(source).slice(0, 60),
        subject: String(subject).slice(0, 200),
        message: String(message).slice(0, 4000),
      },
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (e) {
    console.error("Lead create error:", e);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
