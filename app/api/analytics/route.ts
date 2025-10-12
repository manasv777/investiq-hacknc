import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mockdb";

export async function GET(request: Request) {
  try {
    const [funnel, topFAQs, experienceDistribution] = await Promise.all([
      mockDb.getStepFunnel(),
      mockDb.getTopFAQs(5),
      mockDb.getExperienceDistribution(),
    ]);

    return NextResponse.json({
      funnel,
      topFAQs,
      experienceDistribution,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
