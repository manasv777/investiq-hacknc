# InvestIQ

> A calm, AI-guided companion to open and understand your first investment account.

## Overview

InvestIQ is a production-quality Next.js 14 web application that provides a seamless, accessible, and AI-powered investment account opening experience. Built for the Fidelity QuickVest challenge, it combines intelligent chat assistance, document scanning, and compliance features.

## Features

### 🤖 AI-Powered Guidance (Chat + Voice)
- Text-based chat interface for account opening assistance
- Google Gemini for intelligent, conversational responses
- ≤120 word responses at grade 6-8 reading level
- Context-aware assistance throughout the onboarding flow
- Optional Text‑to‑Speech (TTS) playback of assistant messages via ElevenLabs

### 📋 Complete Onboarding Flow (Steps A-G)
- **A. Account Type**: Stocks & Funds or Stocks, Funds & Crypto
- **B. Basics**: Personal info + military experience branching
- **C. Security**: DOB, SSN (masked), citizenship
- **D. Address**: Residential verification
- **E. Employment**: Job info + restricted person checks (deny rules)
- **F. Trusted Contact**: Optional emergency contact
- **G. Review & Confirm**: Acknowledgments + submission

### 🔐 Security & Compliance
- Client-side input masking for sensitive data (SSN, DOB)
- Deny rules for board members/policymakers/≥10% shareholders
- Audit logging for all significant events
- Compliance Mode banner on all pages

### 📷 Document Scanning + ✅ Fast KYC (Veriff)
- Client-side OCR using Tesseract.js (ID and utility bill)
- Field extraction and identity matching (local-only processing)
- One-click Fast Approval via Veriff KYC (facial recognition & document checks)
- KYC status shown on personal dashboard; approved users see account activation

### ♿ Accessibility
- Full keyboard navigation (Skip link, logical landmarks)
- ARIA live regions for chat updates; `aria-busy` while AI is responding
- High-contrast toggle and adjustable text size (A / A+ / A++)
- Visible focus outlines, proper labels/`aria-describedby`, and screen‑reader hints

### 📊 Analytics (Admin) and 📈 Personal Dashboard
- Analytics: step funnel, session counts (admin view)
- Personal: accounts, KPIs, Market Watch, Market Performance (post-login)
- CTA to resume/view onboarding and continue KYC if needed

### 📚 Investment Glossary
- 20+ investment terms explained
- Searchable interface
- Beginner-friendly language

## Tech Stack

- **Framework**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS, custom navy/white theme
- **UI Components**: Radix UI primitives (shadcn/ui style)
- **State**: Zustand (with local persistence)
- **AI**: Google Gemini with mock fallback
- **TTS**: ElevenLabs (graceful fallback if no key)
- **OCR**: Tesseract.js (client-side)
- **Auth**: NextAuth (Google OAuth), Prisma adapter
- **Charts**: Recharts
- **Testing**: Playwright (E2E)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google OAuth credentials (required for login)
- (Optional) Google Gemini API key for production AI
- (Optional) ElevenLabs API key for TTS

### Installation

```bash
# Clone the repository
cd investiq

# Install dependencies
npm install

# Create .env.local and add:
# DATABASE_URL="file:./dev.db"
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your_random_string
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# (optional) GEMINI_API_KEY=...
# (optional) ELEVENLABS_API_KEY=...
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Testing

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
investiq/
├── app/
│   ├── api/                 # API routes
│   │   ├── ai/              # AI completion & classification
│   │   ├── logs/            # Audit logging (Prisma)
│   │   ├── sessions/        # Session management (Prisma)
│   │   ├── analytics/       # Analytics data (Prisma)
│   │   └── kyc/             # Veriff session + webhook
│   ├── page.tsx             # Home page
│   ├── onboarding/          # Two-pane wizard
│   ├── dashboard/           # Analytics
│   ├── learn/               # Glossary
│   └── deck/                # Presentation slides
├── components/
│   ├── ui/                  # Base UI components
│   ├── Chat.tsx             # Text chat
│   ├── ProgressPanel.tsx    # Step tracker
│   ├── OnboardingSteps.tsx  # Form steps A-G
│   └── TermCard.tsx         # Glossary terms
├── lib/
│   ├── gemini.ts            # Google Gemini client
│   ├── db.ts                # Prisma client
│   ├── ocr.ts               # Tesseract helpers
│   ├── prompts.ts           # AI prompt templates
│   ├── risk.ts              # Risk assessment
│   ├── schemas.ts           # TypeScript types
│   └── utils.ts             # Helpers
├── store/
│   └── session.ts           # Zustand store (persisted)
├── prisma/
│   └── schema.prisma        # SQLite schema (dev)
├── tests/
│   └── e2e.spec.ts          # Playwright tests
└── .env.local.example       # Environment template
```

## API Integration

The app integrates several services:

- **AI**: Google Gemini (fallback to mock)
- **TTS**: ElevenLabs (graceful fallback and format negotiation)
- **DB**: Prisma + SQLite (local dev). Switch to Postgres by updating `datasource db` and `DATABASE_URL`.
- **KYC**: Veriff (session creation + webhook)

This ensures the app is **fully functional for demos** without external dependencies.

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# GEMINI_API_KEY, GEMINI_MODEL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
```

### Docker (Alternative)

```bash
# Build image
docker build -t investiq .

# Run container
docker run -p 3000:3000 --env-file .env.local investiq
```

## API Routes

### `/api/ai/complete`
- **POST**: Generate AI guidance
- Body: `{ prompt: string, context?: object }`
- Returns: `{ text: string }`

### `/api/ai/classify`
- **POST**: Classify text (e.g., experience level)
- Body: `{ text: string, labels?: string[] }`
- Returns: `{ label: string }`

### `/api/kyc/veriff/session`
- **POST**: Create Veriff verification session
- Body: `{ sessionId: string, person: { givenName, lastName, idNumber? } }`
- Returns: `{ kycSessionId, kycUrl, kycStatus }`

### `/api/kyc/veriff/webhook`
- **POST**: Veriff webhook handler
- Body: Veriff event payload (includes `vendorData` with our sessionId)
- Side effect: updates onboarding row with `kycStatus` and auto-approves on `approved`

### `/api/logs/append`
- **POST**: Append to audit log (Prisma)
- Body: `{ sessionId, step, userInput, aiOutput, completed }`
- Returns: `{ success: boolean }`

### `/api/sessions`
- **GET**: List sessions (Prisma)
- **POST**: Create/update onboarding (Prisma)

### `/api/analytics`
- **GET**: Analytics data: step funnel (Prisma)

### `/api/voice/speak`
- **POST**: ElevenLabs TTS – returns `audio/mpeg` or `audio/ogg`
- Handles timeouts (504), content-type checks, and 204 when no key


## License

MIT License - see LICENSE file

## Credits

- **Built for**: Fidelity QuickVest Challenge @ HackNC 2025
- **Design**: Custom navy/white theme inspired by Plynk

## Support

For questions or issues:
- Open a GitHub issue
- Email: support@investiq.demo (demo only)

---

**Demo Mode Notice**: This is a demonstration application. Do not enter real personal information. No actual investment accounts are created.
