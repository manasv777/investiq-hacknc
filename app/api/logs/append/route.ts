import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

    // Append to audit logs table
    await prisma.auditLog.create({
      data: {
        sessionId,
        userId: userId || null,
        details: JSON.stringify({ step, userInput, aiOutput, completed }),
      },
    });

    // Optional: could also update Onboarding currentStep/completed here

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
