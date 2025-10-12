# InvestIQ

> A calm, AI-guided companion to open and understand your first investment account.

## Overview

InvestIQ is a production-quality Next.js 14 web application that provides a seamless, accessible, and AI-powered investment account opening experience. Built for the Fidelity QuickVest challenge, it combines intelligent chat assistance, document scanning, and compliance features.

## Features

### 🤖 AI-Powered Guidance
- Text-based chat interface for account opening assistance
- Google Gemini (gemini-2.0-flash-exp) for intelligent, conversational responses
- ≤120 word responses at grade 6-8 reading level
- Context-aware assistance throughout the onboarding flow

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

### 📷 Document Scanning
- Client-side OCR using Tesseract.js
- ID and utility bill scanning
- Field extraction and identity matching
- No data leaves the browser

### ♿ Accessibility
- Full keyboard navigation
- ARIA labels and semantic HTML
- High-contrast navy/white theme
- Focus visible states

### 📊 Analytics Dashboard
- Session tracking and completion rates
- Step funnel visualization
- Top FAQs analysis
- Experience level distribution

### 📚 Investment Glossary
- 20+ investment terms explained
- Searchable interface
- Beginner-friendly language

## Tech Stack

- **Framework**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS, custom navy/white theme
- **UI Components**: Radix UI primitives (shadcn/ui style)
- **State**: Zustand
- **AI**: Google Gemini with Mock Adapter fallback
- **OCR**: Tesseract.js (client-side)
- **Auth**: NextAuth with Google OAuth (optional)
- **Charts**: Recharts
- **Testing**: Playwright (E2E)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Optional) Google Gemini API key for production AI
- (Optional) Google OAuth credentials for auth

### Installation

```bash
# Clone the repository
cd investiq-voice

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your API keys
# GEMINI_API_KEY=your_key (Get from https://aistudio.google.com/app/apikey)
# GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for auth
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
investiq-voice/
├── app/
│   ├── api/                 # API routes
│   │   ├── ai/              # AI completion & classification
│   │   ├── logs/            # Audit logging
│   │   ├── sessions/        # Session management
│   │   └── analytics/       # Dashboard data
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
│   ├── mockdb.ts            # In-memory database
│   ├── ocr.ts               # Tesseract helpers
│   ├── prompts.ts           # AI prompt templates
│   ├── risk.ts              # Risk assessment
│   ├── schemas.ts           # TypeScript types
│   └── utils.ts             # Helpers
├── store/
│   └── session.ts           # Zustand store
├── tests/
│   └── e2e.spec.ts          # Playwright tests
└── .env.local.example       # Environment template
```

## API Integration

The app uses Google Gemini for AI-powered chat assistance:

- **Production**: Google Gemini API (gemini-2.0-flash-exp)
- **Mock AI**: Keyword-based responses (SSN, DOB, risk, etc.)
- **Mock DB**: In-memory storage with seeded data

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

### `/api/ai/vision`
- **POST**: OCR document scanning
- Body: FormData with `file`
- Returns: `{ name: string, address: string, dob: string, confidence: number }`

### `/api/logs/append`
- **POST**: Append to audit/onboarding logs
- Body: `{ sessionId, step, userInput, aiOutput, completed }`
- Returns: `{ success: boolean }`

### `/api/sessions`
- **GET**: List all sessions
- **POST**: Create/update session

### `/api/analytics`
- **GET**: Dashboard data (funnel, FAQs, distribution)


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
