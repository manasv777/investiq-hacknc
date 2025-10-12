import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Minimal Veriff session creation proxy
// Docs: https://developers.veriff.com/#sessions

export async function POST(req: NextRequest) {
  try {
    const { sessionId, person } = await req.json();
    if (!process.env.VERIFF_API_KEY) {
      return NextResponse.json({ error: "VERIFF_API_KEY missing" }, { status: 500 });
    }

    const payload = {
      verification: {
        callback: `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/kyc/veriff/webhook`,
        person,
        vendorData: sessionId,
        document: { type: "ID_CARD" },
      },
    };

    const res = await fetch("https://api.veriff.me/v1/sessions", {
      method: "POST",
      headers: {
        "X-AUTH-CLIENT": process.env.VERIFF_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json({ error: "Failed to create session", details: text }, { status: 502 });
    }

    const data = await res.json();
    const verification = data?.verification || {};
    return NextResponse.json({
      kycProvider: "veriff",
      kycSessionId: verification?.id,
      kycUrl: verification?._links?.veriff?.href || verification?.url,
      kycStatus: "pending",
    });
  } catch (e: any) {
    return NextResponse.json({ error: "KYC session error", details: e?.message || String(e) }, { status: 500 });
  }
}


