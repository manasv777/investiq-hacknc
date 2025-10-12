import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccessibilityControls } from "@/components/AccessibilityControls";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InvestIQ - Your Voice-Guided Investment Companion",
  description:
    "A calm, voice-guided companion to open and understand your first investment account.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0B1F3B" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0B1F3B] focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>
        <div className="min-h-screen flex flex-col" id="main-content" role="main">
          <Providers>{children}</Providers>
        </div>
        <AccessibilityControls />
      </body>
    </html>
  );
}
