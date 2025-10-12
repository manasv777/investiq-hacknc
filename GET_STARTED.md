# 🚀 Get Started with InvestIQ Voice

## Quick Start (5 minutes)

### 1. Start the Development Server

```bash
cd investiq-voice
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Explore the App

✅ **No API keys needed!** The app works fully with mock adapters.

#### Home Page
- View the hero section with "Start Voice Onboarding" button
- Notice the compliance banner at the top
- Click "Learn" to explore the glossary
- Click "Dashboard" to see analytics

#### Try the Onboarding Flow
1. Click **"Start Voice Onboarding"**
2. Choose account type (Step A)
3. Fill in basic info (Step B)
4. Click **"Why SSN?"** to hear AI explanation
5. Try uploading an ID for OCR scanning
6. Complete all steps to see success animation!

#### Explore the Dashboard
- View session statistics
- See the onboarding funnel chart
- Check top FAQs

#### Learn Investment Terms
- Go to `/learn`
- Search for terms like "ETF" or "Roth IRA"
- Click "Explain" to hear voice definitions

## Features Highlights

### ✨ Voice Input
Click the microphone button in the chat to use voice commands!

### 🎙️ AI Explanations
Click any "Why X?" chip to get instant AI explanations with audio.

### 📷 Document Scanning
Click "Scan ID" or "Scan Utility Bill" to try OCR document verification.

### 🔐 Privacy Toggle
In the Security step, toggle "Show/Hide Sensitive" to see masking in action.

### 📊 Real-Time Progress
Watch the progress bar update as you complete each step.

## API Keys (Optional)

Want real AI and voice? Add these to `.env.local`:

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add:
ELEVENLABS_API_KEY=your_key_here
SNOWFLAKE_ACCOUNT_IDENTIFIER=your_account
```

Without keys:
- ✅ Mock AI (keyword-based responses)
- ✅ Mock TTS (silent audio with subtitles)
- ✅ All features work perfectly!

## Testing

Run the E2E test suite:

```bash
npm run test:e2e
```

Or with UI mode:

```bash
npm run test:e2e:ui
```

## Build for Production

```bash
npm run build
npm start
```

## What's Included

✅ **5 Complete Pages**
- Home with hero section
- Onboarding wizard (7 steps)
- Dashboard with analytics
- Learn glossary
- Deck presentation

✅ **15+ Components**
- Chat with voice input
- Progress tracker
- Form steps A-G
- Audio player
- And more!

✅ **8 API Routes**
- AI completion
- Voice synthesis
- Logging
- Analytics
- And more!

✅ **Full Documentation**
- README (300+ lines)
- Quick start guide
- Contributing guidelines
- Deployment guide

## Architecture

```
Frontend (Next.js + React)
    ↓
API Routes (Next.js API)
    ↓
Services Layer
    ├── Snowflake Cortex (AI) → Mock Adapter
    ├── ElevenLabs (TTS) → Mock Audio
    └── Mock Database (In-memory)
```

## Key Technologies

- **Next.js 14** - App Router, Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Tesseract.js** - OCR
- **Playwright** - E2E testing

## 90-Second Demo Flow

Perfect for showing off the app:

1. **Home** → "Start Voice Onboarding" (5s)
2. **Step A** → Choose account type (5s)
3. **Step B** → Fill name/email (10s)
4. **Step C** → Click "Why SSN?" → Hear explanation (15s)
5. **Step C** → Upload ID → See OCR results (15s)
6. **Step E** → Toggle board member (10s)
7. **Step G** → Submit → Confetti! (20s)
8. **Dashboard** → Show analytics (10s)

**Total: 90 seconds** ⏱️

## Accessibility

This app is fully accessible:
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Screen reader compatible
- ✅ ARIA labels everywhere
- ✅ High contrast colors
- ✅ Skip links
- ✅ Focus visible states

Try navigating with keyboard only!

## Troubleshooting

### Port already in use?
```bash
lsof -ti:3000 | xargs kill -9
```

### Dependencies issue?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors?
```bash
rm -rf .next
npm run build
```

## Next Steps

1. ✅ Explore all pages
2. ✅ Try voice input
3. ✅ Upload a document for OCR
4. ✅ Complete the full onboarding flow
5. ✅ Check the dashboard analytics
6. ✅ Run the E2E tests
7. 🚀 Deploy to Vercel!

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

That's it! Your app will be live in ~2 minutes.

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🤝 Check [CONTRIBUTING.md](CONTRIBUTING.md)
- 🚀 See [DEPLOYMENT.md](DEPLOYMENT.md)
- 📝 Review [SUMMARY.md](SUMMARY.md)

---

**Enjoy building with InvestIQ Voice!** 🎉

Built for HackNC 2025 with ❤️
