# InvestIQ Voice

> A calm, voice-guided companion to open and understand your first investment account.

## Overview

InvestIQ Voice is a production-quality Next.js 14 web application that provides a seamless, accessible, and AI-powered investment account opening experience. Built for the Fidelity QuickVest challenge, it combines voice-first UX, document scanning, and compliance features.

## Features

### 🤖 AI-Powered Guidance
- Text-based chat interface for account opening assistance
- Google Gemini (gemini-1.5-flash) for intelligent, conversational responses
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
- Subtitles for all audio responses
- Focus visible states

### 📊 Analytics Dashboard
- Session tracking and completion rates
- Step funnel visualization
- Top FAQs analysis
- Experience level distribution

### 📚 Voice-Enabled Glossary
- 20+ investment terms explained
- Text-to-speech for each definition
- Searchable interface
- Beginner-friendly language

## Tech Stack

- **Framework**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS, custom navy/white theme
- **UI Components**: Radix UI primitives (shadcn/ui style)
- **State**: Zustand
- **AI/Data**: Snowflake Cortex (mistral-large) with Mock Adapter fallback
- **Voice**: ElevenLabs TTS API
- **OCR**: Tesseract.js (client-side)
- **Auth**: NextAuth with Google OAuth (optional)
- **Charts**: Recharts
- **Testing**: Playwright (E2E)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Optional) ElevenLabs API key for real TTS
- (Optional) Snowflake account for production AI
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
│   │   ├── voice/           # ElevenLabs TTS
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
│   ├── Chat.tsx             # Voice/text chat
│   ├── MicButton.tsx        # Voice input
│   ├── AudioPlayer.tsx      # TTS playback
│   ├── ProgressPanel.tsx    # Step tracker
│   ├── OnboardingSteps.tsx  # Form steps A-G
│   └── TermCard.tsx         # Glossary terms
├── lib/
│   ├── snowflake.ts         # Cortex + Mock Adapter
│   ├── elevenlabs.ts        # TTS integration
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

## Key Files

- **`app/onboarding/page.tsx`**: Main wizard with two-pane layout
- **`components/OnboardingSteps.tsx`**: All form steps (A-G) with branching logic
- **`lib/snowflake.ts`**: Cortex API + Mock Adapter (auto-detects config)
- **`lib/prompts.ts`**: Calm, grade 6-8 prompt templates
- **`store/session.ts`**: Global state for onboarding data

## Environment Variables

See `.env.local.example` for all options. The app works **without any API keys** using mock adapters.

### Required API Keys

- `GEMINI_API_KEY`: Google Gemini API key for AI chat (get from https://aistudio.google.com/app/apikey)
- `GOOGLE_CLIENT_ID/SECRET`: For Google OAuth (optional - otherwise guest mode)

## API Integration

The app uses Google Gemini for AI-powered chat assistance:

- **Mock AI**: Keyword-based responses (SSN, DOB, risk, etc.)
- **Mock TTS**: Silent audio with full subtitles
- **Mock DB**: In-memory storage with seeded data

This ensures the app is **fully functional for demos** without external dependencies.

## Compliance & Security

### Demo Mode
- Compliance banner visible on all pages
- Consent toast before Security step
- Masked input fields (SSN, DOB)
- No real PII is stored or transmitted

### Deny Rules
- Restricted persons (board/policymaker/≥10% shareholder) are blocked at Step E
- Clear explanation and "Learn Why" link provided

### Audit Logging
- All step completions logged to `AUDIT_LOGS`
- Event types: `STEP_COMPLETED`, user actions
- Accessible via dashboard analytics

## Accessibility (A11y)

- ✅ WCAG AA compliant color contrast (navy #0B1F3B / white #F8FAFC)
- ✅ Full keyboard navigation (Tab, Enter, Space)
- ✅ ARIA labels on all interactive elements
- ✅ Focus visible states (2px navy outline)
- ✅ Semantic HTML (headings, landmarks, roles)
- ✅ Subtitles rendered under all audio
- ✅ Alternative text for icons

Run Lighthouse accessibility audit:
```bash
npm run build
npm start
# Open Chrome DevTools → Lighthouse → Accessibility
```

## Hero Demo Script (90 seconds)

1. **Home** → Show hero + compliance banner → Click "Start Voice Onboarding"
2. **Onboarding** → AI voice welcomes → Show chat interaction
3. **Security Step** → Tap "Why SSN?" chip → Audio explanation + subtitles
4. **Document Scan** → Upload ID → OCR extracts name/DOB → "Identity Check: Passed"
5. **Employment Step** → Toggle "board member = Yes" → Deny screen → Toggle back to "No"
6. **Review** → Check all acknowledgments → "Open My Account" → Success + confetti
7. **Dashboard** → Show completion %, funnel chart, top FAQs

## Judging Criteria Alignment

### Intuitiveness & Usability (25%)
- 3-screen flow: Home → Onboarding → Success
- Minimal clicks with progress bar
- "Explain This Step" chips throughout
- ≤120 word responses

### Effective AI Use (25%)
- Cortex COMPLETE for guidance
- CLASSIFY_TEXT for experience levels
- OCR with Tesseract.js
- Voice TTS with ElevenLabs

### Creativity & Innovation (20%)
- Voice-first onboarding
- Glossary that speaks
- Adaptive pace (brief by default, "Want more?" option)
- Confidence meter via OCR matching

### Feasibility & Scalability (20%)
- Snowflake-ready APIs
- Clean separation (API routes)
- Mock fallback for demos
- Vercel deploy-ready

### Accessibility & Inclusivity (10%)
- Voice + captions + keyboard + visual contrast
- ARIA labels and semantic HTML
- Grade 6-8 reading level

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# GEMINI_API_KEY, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
```

### Docker (Alternative)

```bash
# Build image
docker build -t investiq-voice .

# Run container
docker run -p 3000:3000 --env-file .env.local investiq-voice
```

## API Routes

### `/api/ai/complete`
- **POST**: Generate AI guidance
- Body: `{ prompt: string, context?: object }`
- Returns: `{ text: string, meta: object }`

### `/api/ai/classify`
- **POST**: Classify text (e.g., experience level)
- Body: `{ text: string, labels?: string[] }`
- Returns: `{ label: string, scores: Record<string, number> }`

### `/api/voice/speak`
- **POST**: Generate TTS audio
- Body: `{ text: string, voiceId?: string }`
- Returns: `{ audioUrl: string, subtitles: string }`

### `/api/logs/append`
- **POST**: Append to audit/onboarding logs
- Body: `{ sessionId, step, userInput, aiOutput, completed }`
- Returns: `{ success: boolean }`

### `/api/sessions`
- **GET**: List all sessions
- **POST**: Create/update session

### `/api/analytics`
- **GET**: Dashboard data (funnel, FAQs, distribution)

### `/api/deck/export`
- **GET**: Export presentation deck (JSON structure)

## Contributing

This is a hackathon submission. For improvements:
1. Fork the repo
2. Create a feature branch
3. Submit a PR with tests

## License

MIT License - see LICENSE file

## Credits

- **Built for**: Fidelity QuickVest Challenge @ HackNC 2025
- **AI**: Snowflake Cortex (mistral-large)
- **Voice**: ElevenLabs TTS
- **Design**: Custom navy/white theme inspired by Plynk

## Support

For questions or issues:
- Open a GitHub issue
- Email: support@investiq-voice.demo (demo only)

---

**Demo Mode Notice**: This is a demonstration application. Do not enter real personal information. No actual investment accounts are created.
