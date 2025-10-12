import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all sessions (for dashboard)
export async function GET(request: Request) {
  try {
    const rows = await prisma.onboarding.findMany();
    const sessions = rows.map((r) => ({
      sessionId: r.sessionId,
      userId: r.userId,
      currentStep: r.currentStep || undefined,
      completedSteps: [],
      startedAt: r.startedAt.toISOString(),
      completedAt: r.completedAt?.toISOString(),
      ...((r.data as any) || {}),
    }));
    return NextResponse.json({ sessions, count: sessions.length });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST create/update session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, updates } = body;
    if (!sessionId) {
      // Create new row keyed by generated sessionId
      const created = await prisma.onboarding.create({
        data: {
          userId: updates.userId || "anon",
          sessionId: updates.sessionId,
          data: updates,
          currentStep: updates.currentStep,
          completedStepsJson: JSON.stringify(updates.completedSteps || []),
          completedAt: updates.completedAt ? new Date(updates.completedAt) : null,
          applicationStatus: updates.applicationStatus || null,
          approvedAt: updates.approvedAt ? new Date(updates.approvedAt) : null,
          kycProvider: updates.kycProvider || null,
          kycSessionId: updates.kycSessionId || null,
          kycStatus: updates.kycStatus || null,
          kycUrl: updates.kycUrl || null,
          kycUpdatedAt: updates.kycUpdatedAt ? new Date(updates.kycUpdatedAt) : null,
        },
      });
      return NextResponse.json({ session: created });
    }
    const updated = await prisma.onboarding.update({
      where: { sessionId },
      data: {
        data: updates,
        currentStep: updates.currentStep,
        completedStepsJson: JSON.stringify(updates.completedSteps || []),
        completedAt: updates.completedAt ? new Date(updates.completedAt) : null,
        applicationStatus: updates.applicationStatus || null,
        approvedAt: updates.approvedAt ? new Date(updates.approvedAt) : null,
        kycProvider: updates.kycProvider || null,
        kycSessionId: updates.kycSessionId || null,
        kycStatus: updates.kycStatus || null,
        kycUrl: updates.kycUrl || null,
        kycUpdatedAt: updates.kycUpdatedAt ? new Date(updates.kycUpdatedAt) : null,
      },
    });
    return NextResponse.json({ session: updated });
  } catch (error) {
    console.error("Error managing session:", error);
    return NextResponse.json(
      { error: "Failed to manage session" },
      { status: 500 }
    );
  }
}
