"use client";

import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useSessionStore } from "@/store/session";

function AuthSync() {
  const { data: session, status } = useSession();
  const initializeSession = useSessionStore((s) => s.initializeSession);
  const currentUserId = useSessionStore((s) => s.userId);

  useEffect(() => {
    if (status === "loading") return;
    const nextUserId = session?.user?.id;
    if (nextUserId && nextUserId !== currentUserId) {
      // New authenticated user: initialize a fresh session scoped to this user
      initializeSession(nextUserId);
    }
    if (!nextUserId && currentUserId) {
      // Logged out: reset to anonymous session
      initializeSession(undefined);
    }
  }, [status, session?.user?.id, currentUserId, initializeSession]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthSync />
      {children}
    </SessionProvider>
  );
}


