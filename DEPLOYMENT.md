# Deployment Guide

This guide covers deploying InvestIQ Voice to production.

## Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/investiq-voice)

### Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd investiq-voice
   vercel
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Add the following (all optional):
     - `ELEVENLABS_API_KEY`
     - `ELEVENLABS_VOICE_ID`
     - `SNOWFLAKE_ACCOUNT_IDENTIFIER`
     - `SNOWFLAKE_WAREHOUSE`
     - `SNOWFLAKE_DATABASE`
     - `SNOWFLAKE_SCHEMA`
     - `SNOWFLAKE_ROLE`
     - `SNOWFLAKE_USER`
     - `NEXTAUTH_URL` (your production URL)
     - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`

5. **Redeploy** to apply environment variables:
   ```bash
   vercel --prod
   ```

### Domain Configuration

1. Go to your Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable to your domain

## Docker Deployment

### Build Docker Image

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF
```

### Update next.config.ts

Add to `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // Add this for Docker
  // ... rest of config
};
```

### Build and Run

```bash
# Build image
docker build -t investiq-voice .

# Run container
docker run -p 3000:3000 \
  -e ELEVENLABS_API_KEY=your_key \
  -e NEXTAUTH_SECRET=your_secret \
  investiq-voice
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## AWS Deployment

### AWS Amplify

1. Connect your GitHub repository
2. Amplify will auto-detect Next.js
3. Add environment variables in Amplify Console
4. Deploy automatically on git push

### AWS Elastic Beanstalk

1. Install EB CLI:
   ```bash
   pip install awsebcli
   ```

2. Initialize:
   ```bash
   eb init -p node.js investiq-voice
   ```

3. Create environment:
   ```bash
   eb create investiq-voice-prod
   ```

4. Deploy:
   ```bash
   eb deploy
   ```

## Environment Variables for Production

### Required (None! App works with mocks)

The app is fully functional without any API keys using mock adapters.

### Optional for Enhanced Features

```env
# ElevenLabs (for real TTS)
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Snowflake (for real AI)
SNOWFLAKE_ACCOUNT_IDENTIFIER=abc12345.us-east-1
SNOWFLAKE_WAREHOUSE=COMPUTE_WH
SNOWFLAKE_DATABASE=QUICKVEST_AI
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_ROLE=ACCOUNTADMIN
SNOWFLAKE_USER=your_user
SNOWFLAKE_OAUTH_REFRESH_TOKEN=...

# NextAuth (for Google OAuth)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Performance Optimization

### Enable Caching

Add to `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  // ...
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
};
```

### CDN Configuration

If using Vercel, CDN is automatic. For other platforms:
- Cache static assets (`/_next/static/*`) for 1 year
- Cache images for 1 month
- Cache API routes minimally

### Database Connection Pooling

For production Snowflake:
- Use connection pooling
- Set appropriate timeouts
- Implement retry logic

## Security Checklist

- [ ] Set `NEXTAUTH_SECRET` to a strong random value
- [ ] Use HTTPS only (Vercel provides this automatically)
- [ ] Rotate API keys regularly
- [ ] Enable CORS only for your domain
- [ ] Set appropriate CSP headers
- [ ] Enable rate limiting on API routes
- [ ] Audit dependencies regularly (`npm audit`)
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard:
- Web Analytics for performance metrics
- Logs for debugging

### Custom Monitoring

Add to your app:
```bash
npm install @vercel/analytics
```

In `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Health Check

Create `app/api/health/route.ts`:
```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
```

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run build`
- Verify all dependencies are installed
- Check Node.js version (18+)

### Environment Variables Not Working
- Restart the server after adding variables
- In Vercel, redeploy after adding variables
- Check for typos in variable names

### API Routes Timeout
- Increase serverless function timeout in Vercel settings
- Optimize database queries
- Implement caching

### Out of Memory
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`
- Optimize large dependencies
- Use dynamic imports for heavy components

## Rollback

### Vercel
```bash
# List deployments
vercel ls

# Promote a previous deployment
vercel promote <deployment-url>
```

### Docker
```bash
# Tag versions
docker tag investiq-voice:latest investiq-voice:v1.0.0

# Rollback
docker stop investiq-voice
docker run -d --name investiq-voice investiq-voice:v1.0.0
```

## Post-Deployment

1. **Test the deployment**:
   - Run through the full onboarding flow
   - Test voice input
   - Test document scanning
   - Check dashboard analytics

2. **Monitor logs** for errors

3. **Set up alerts** for:
   - Error rates
   - Response times
   - API failures

4. **Document the deployment**:
   - URL
   - Environment
   - API keys used
   - Deployment date

## Support

For deployment issues:
- Check Vercel/AWS documentation
- Open a GitHub issue
- Review logs in your platform's dashboard

---

Happy deploying! 🚀


