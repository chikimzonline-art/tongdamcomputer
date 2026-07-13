import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/leads
 * Public endpoint - accepts lead submissions from any form on the site.
 * Body: { name, email?, phone, source, subject, message }
 *
 * Rate limited to 5 requests per minute per IP to prevent spam/abuse.
 */
export async function POST(req: NextRequest) {
  // --- Rate limiting ---
  const ip = getClientIp(req);
  const { limited, remaining, resetAt } = rateLimit(ip, {
    limit: 5,
    windowMs: 60_000, // 1 minute
  });

  if (limited) {
    const retryAfterSeconds = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a moment before trying again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

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

    return NextResponse.json(
      { ok: true, id: lead.id },
      {
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (e) {
    console.error("Lead create error:", e);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
