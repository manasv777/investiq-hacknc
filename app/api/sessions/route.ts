import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mockdb";

// GET all sessions (for dashboard)
export async function GET(request: Request) {
  try {
    const sessions = await mockDb.getAllSessions();

    return NextResponse.json({
      sessions,
      count: sessions.length,
    });
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

    if (sessionId) {
      // Update existing session
      const updated = await mockDb.updateSession(sessionId, updates);
      return NextResponse.json({ session: updated });
    } else {
      // Create new session
      const newSession = await mockDb.createSession(updates);
      return NextResponse.json({ session: newSession });
    }
  } catch (error) {
    console.error("Error managing session:", error);
    return NextResponse.json(
      { error: "Failed to manage session" },
      { status: 500 }
    );
  }
}
