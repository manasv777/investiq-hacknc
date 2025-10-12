import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mockdb";

export const runtime = "nodejs";

// Veriff sends events when verification status changes
// We'll map vendorData (our sessionId) and update kyc fields in mock DB

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const vendorData = body?.verification?.vendorData || body?.vendorData;
    const status = body?.verification?.status || body?.status;
    const veriffId = body?.verification?.id;

    if (!vendorData) {
      return NextResponse.json({ error: "Missing vendorData" }, { status: 400 });
    }

    const updates: any = {
      kycProvider: "veriff",
      kycSessionId: veriffId,
      kycStatus: status,
      kycUpdatedAt: new Date().toISOString(),
    };
    // If approved, mark application approved for fast-track
    if (status === "approved") {
      updates.applicationStatus = "approved";
      updates.approvedAt = new Date().toISOString();
      // Ensure submitted is set if not already
      updates.completedAt = updates.completedAt || new Date().toISOString();
    }
    await mockDb.updateSession(vendorData, updates);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Webhook error", details: e?.message || String(e) }, { status: 500 });
  }
}


