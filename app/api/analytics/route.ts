import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const rows = await prisma.onboarding.findMany();
    const funnel: Record<string, number> = { A:0,B:0,C:0,D:0,E:0,F:0,G:0 };
    rows.forEach((r) => {
      const steps: string[] = JSON.parse((r as any).completedStepsJson || "[]");
      steps.forEach((s) => { if (funnel[s] !== undefined) funnel[s]++; });
    });
    const topFAQs: { query: string; count: number }[] = [];
    const experienceDistribution: Record<string, number> = { beginner: 0, intermediate: 0, advanced: 0 };

    return NextResponse.json({ funnel, topFAQs, experienceDistribution, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
