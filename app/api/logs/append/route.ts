import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mockdb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, userId, step, userInput, aiOutput, completed } = body;

    if (!sessionId || !step) {
      return NextResponse.json(
        { error: "sessionId and step are required" },
        { status: 400 }
      );
    }

    // Append to onboarding logs
    await mockDb.appendOnboardingLog({
      sessionId,
      userId,
      step,
      userInput: userInput || "",
      aiOutput: aiOutput || "",
      completed: completed || false,
    });

    // Also append to audit logs if it's a significant event
    if (completed) {
      await mockDb.appendAuditLog({
        eventId: `${sessionId}-${step}-${Date.now()}`,
        sessionId,
        eventType: "STEP_COMPLETED",
        details: JSON.stringify({ step, userInput, aiOutput }),
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Logging error:", error);
    return NextResponse.json(
      { error: "Failed to append log" },
      { status: 500 }
    );
  }
}
