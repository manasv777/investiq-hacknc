"use client";

import React from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-[#0B1F3B] rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0B1F3B]">InvestIQ</h1>
            <p className="text-xs text-gray-600">Sign in to continue</p>
          </div>
        </div>

        <Button className="w-full" onClick={() => signIn("google", { callbackUrl: "/onboarding" })}>
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full mt-3"
          onClick={() => router.push('/onboarding?manual=true')}
        >
          Create account manually
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          By continuing, you agree to our Terms and acknowledge our Privacy Policy.
        </p>
      </div>
    </div>
  );
}


