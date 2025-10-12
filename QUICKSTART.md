# InvestIQ Voice - Quick Start Guide

Get up and running with InvestIQ Voice in under 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- (Optional) API keys for ElevenLabs and Snowflake

## Step 1: Clone and Install

```bash
# Navigate to the project directory
cd investiq-voice

# Install dependencies
npm install
```

## Step 2: Environment Setup (Optional)

The app works **without any API keys** using mock adapters!

```bash
# Copy the example environment file
cp .env.local.example .env.local

# (Optional) Add your API keys to .env.local
# ELEVENLABS_API_KEY=your_key_here
# SNOWFLAKE_ACCOUNT_IDENTIFIER=your_account
```

**Without API keys:**
- Mock AI responses (keyword-based)
- Mock TTS (silent audio with full subtitles)
- In-memory mock database

**With API keys:**
- Real Snowflake Cortex AI (mistral-large)
- Real ElevenLabs text-to-speech
- Production-ready experience

## Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Explore the App

### Home Page (`/`)
- View the hero section
- See compliance banner and sponsor badges
- Click "Start Voice Onboarding"

### Onboarding (`/onboarding`)
- Complete the 7-step wizard (A-G)
- Try voice input (click microphone button)
- Click "Why SSN?" chips for explanations
- Upload a document for OCR scanning
- Submit to see success animation

### Dashboard (`/dashboard`)
- View session analytics
- See completion funnel chart
- Check top FAQs

### Learn (`/learn`)
- Search investment terms
- Click "Explain" to hear definitions
- Voice-enabled glossary

## Step 5: Run Tests (Optional)

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Step 6: Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Common Tasks

### Add a New Glossary Term

Edit `app/learn/page.tsx` and add to `GLOSSARY_TERMS` array:

```typescript
const GLOSSARY_TERMS = [
  // ...existing terms
  "Your New Term",
];
```

The AI will automatically generate explanations!

### Customize Branding

Edit colors in `tailwind.config.ts`:

```typescript
colors: {
  navy: {
    DEFAULT: "#0B1F3B", // Change this
    // ...
  },
}
```

### Add a New Onboarding Step

1. Add step to `lib/schemas.ts`:
   ```typescript
   export const OnboardingStepSchema = z.enum([
     "A", "B", "C", "D", "E", "F", "G", "H" // Add "H"
   ]);
   ```

2. Add form fields in `components/OnboardingSteps.tsx`
3. Add validation in `app/onboarding/page.tsx`
4. Update progress in `components/ProgressPanel.tsx`

### Configure Google OAuth

1. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/)
2. Add to `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
   ```
3. Restart the dev server

## Demo Script (90 seconds)

Perfect for showing off the app:

1. **Home** → Click "Start Voice Onboarding"
2. **Step A** → Choose account type
3. **Step B** → Fill in name and email
4. **Step C** → Click "Why SSN?" chip → Hear explanation
5. **Step C** → Click "Scan ID" → Upload image → See OCR results
6. **Step E** → Toggle "board member" → See deny screen → Toggle back
7. **Step G** → Check all boxes → Submit → Confetti! 🎉
8. **Dashboard** → Show analytics

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### TypeScript errors
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

### Playwright browser not installed
```bash
npx playwright install chromium
```

### Audio not playing
- Check browser permissions for microphone/audio
- Try a different browser (Chrome/Edge recommended)
- Check that ElevenLabs API key is valid

## Next Steps

- Read the full [README.md](README.md)
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Review the [API documentation](#) in README
- Deploy to Vercel (see README)

## Support

- GitHub Issues: Report bugs or request features
- Documentation: See README.md for full details
- Community: Join discussions in GitHub

Enjoy building with InvestIQ Voice! 🚀


