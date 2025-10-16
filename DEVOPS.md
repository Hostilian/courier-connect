# DevOps & Operations Guide

This guide covers monitoring, logging, error tracking, and operational procedures for Courier Connect.

## Table of Contents

- [Monitoring Setup](#monitoring-setup)
- [Logging](#logging)
- [Error Tracking](#error-tracking)
- [Performance Monitoring](#performance-monitoring)
- [Deployment](#deployment)
- [Incident Response](#incident-response)
- [Backup & Recovery](#backup--recovery)

## Monitoring Setup

### Vercel Analytics

Vercel provides built-in analytics for your Next.js application.

**Setup:**

1. Enable in Vercel dashboard
2. Add to your project:
   ```bash
   npm install @vercel/analytics
   ```

3. Add to root layout:
   ```typescript
   // app/layout.tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

**Key Metrics to Monitor:**
- Page views per locale
- Delivery request conversion rate
- Courier registration funnel
- Error rates by page
- Response times

### Uptime Monitoring

Use a service like UptimeRobot or BetterUptime:

**Endpoints to Monitor:**
```
https://hostilian.org/en/
https://hostilian.org/api/health (create this)
```

**Create Health Check Endpoint:**

```typescript
// app/api/health/route.ts
import dbConnect from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check database connection
    await dbConnect();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        app: 'running'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    }, { status: 503 });
  }
}
```

## Logging

### Server-Side Logging

**Production Logging Pattern:**

```typescript
// lib/logger.ts
type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  trackingId?: string;
  locale?: string;
  [key: string]: any;
}

export function log(
  level: LogLevel,
  message: string,
  context?: LogContext
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
    environment: process.env.NODE_ENV,
  };
  
  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to logging service (e.g., Datadog, LogTail)
    console.log(JSON.stringify(logEntry));
  } else {
    // Development: pretty print
    console.log(`[${level.toUpperCase()}]`, message, context || '');
  }
}

// Usage examples
export const logger = {
  info: (msg: string, ctx?: LogContext) => log('info', msg, ctx),
  warn: (msg: string, ctx?: LogContext) => log('warn', msg, ctx),
  error: (msg: string, ctx?: LogContext) => log('error', msg, ctx),
};
```

**Usage in API Routes:**

```typescript
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    logger.info('Delivery request received', {
      locale: body.locale,
      urgency: body.urgency,
    });
    
    // Process request...
    
    logger.info('Delivery request created', {
      trackingId: delivery.trackingId,
    });
    
    return NextResponse.json({ trackingId });
  } catch (error) {
    logger.error('Failed to create delivery', {
      error: error.message,
      stack: error.stack,
    });
    
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Client-Side Logging

**Avoid logging sensitive data:**

```typescript
// lib/client-logger.ts
export function logClientError(error: Error, context?: any) {
  // Don't log in production to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Client error:', error, context);
  }
  
  // Send to error tracking service (see Error Tracking section)
}
```

### Vercel Logs

Access logs in Vercel dashboard:
1. Go to your project
2. Click "Deployments"
3. Select deployment
4. Click "View Function Logs"

Or use Vercel CLI:
```bash
vercel logs [deployment-url]
```

## Error Tracking

### Sentry Integration (Recommended)

**1. Install Sentry:**

```bash
npm install @sentry/nextjs
```

**2. Configure Sentry:**

```bash
npx @sentry/wizard -i nextjs
```

**3. Add environment variables:**

```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token
```

**4. Initialize in app:**

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  
  // Filter out sensitive data
  beforeSend(event) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
    }
    return event;
  },
});
```

**5. Use in code:**

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      locale: locale,
      userType: 'customer',
    },
    extra: {
      trackingId: trackingId,
    },
  });
}
```

### Manual Error Tracking API

If not using Sentry, create a simple error tracking endpoint:

```typescript
// app/api/errors/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { error, context } = await request.json();
    
    // Log error
    console.error('[CLIENT ERROR]', {
      timestamp: new Date().toISOString(),
      error,
      context,
      userAgent: request.headers.get('user-agent'),
    });
    
    // TODO: Send to monitoring service or database
    
    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}
```

## Performance Monitoring

### Core Web Vitals

Monitor Core Web Vitals in production:

```typescript
// app/[locale]/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <SpeedInsights />
    </>
  );
}
```

### Database Query Performance

Monitor slow queries:

```typescript
// lib/mongodb.ts
import mongoose from 'mongoose';

// Enable query logging in development
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

// Track slow queries
mongoose.plugin(function(schema) {
  schema.pre('find', function() {
    this.start = Date.now();
  });
  
  schema.post('find', function(result) {
    const duration = Date.now() - this.start;
    if (duration > 1000) { // Log queries > 1 second
      console.warn(`Slow query (${duration}ms):`, this.getQuery());
    }
  });
});
```

### API Response Time Monitoring

Create middleware to track response times:

```typescript
// middleware/performance.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const start = Date.now();
  
  const response = NextResponse.next();
  
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
  
  return response;
}
```

## Deployment

### Pre-Deployment Checklist

- [ ] All tests pass (`npm run build`, `npm run type-check`)
- [ ] Environment variables configured in Vercel
- [ ] Database migrations completed (if any)
- [ ] Translation keys verified
- [ ] Performance tested (Lighthouse score > 90)
- [ ] Mobile responsiveness verified
- [ ] Security audit passed (`npm audit`)

### Deployment Process

**Via GitHub (Automatic):**

1. Merge PR to `main` branch
2. GitHub Actions runs CI checks
3. Vercel auto-deploys to production
4. Monitor deployment in Vercel dashboard

**Manual Deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Post-Deployment Verification

1. **Check health endpoint:**
   ```bash
   curl https://hostilian.org/api/health
   ```

2. **Test key user flows:**
   - Customer: Request delivery
   - Customer: Track delivery
   - Courier: Login
   - Courier: Accept delivery

3. **Check error rates** in Vercel/Sentry dashboard

4. **Monitor logs** for 10-15 minutes after deployment

### Rollback Procedure

If issues detected:

1. **Via Vercel Dashboard:**
   - Go to Deployments
   - Find last stable deployment
   - Click "Promote to Production"

2. **Via CLI:**
   ```bash
   vercel rollback [deployment-url]
   ```

3. **Notify team** of rollback and investigate issue

## Incident Response

### Severity Levels

- **P0 (Critical)**: Site down, data loss, security breach
- **P1 (High)**: Major feature broken, affecting all users
- **P2 (Medium)**: Feature broken for some users
- **P3 (Low)**: Minor issue, cosmetic bugs

### Incident Response Steps

**1. Detection:**
- Monitoring alerts
- User reports
- Error tracking spikes

**2. Assessment:**
- Determine severity
- Identify affected users/features
- Check error logs and metrics

**3. Response:**
- P0: Immediate rollback or hotfix
- P1: Hotfix within 2-4 hours
- P2: Fix in next deployment
- P3: Add to backlog

**4. Communication:**
- Update status page (if available)
- Notify users via email (if critical)
- Post mortem after resolution

**5. Resolution:**
- Apply fix
- Verify resolution
- Monitor for recurrence

**6. Post-Mortem:**
- Document what happened
- Identify root cause
- Create action items to prevent recurrence

## Backup & Recovery

### Database Backups

**MongoDB Atlas (Recommended):**
- Enable automatic backups in Atlas dashboard
- Snapshots every 24 hours
- 7-day retention

**Manual Backup:**

```bash
# Backup entire database
mongodump --uri="mongodb-uri" --out=./backup-$(date +%Y%m%d)

# Backup specific collection
mongodump --uri="mongodb-uri" --collection=deliveryrequests --out=./backup

# Restore from backup
mongorestore --uri="mongodb-uri" ./backup-20241016
```

### Environment Variables Backup

Keep secure backup of environment variables:

```bash
# Export from Vercel
vercel env pull .env.backup

# Store securely (encrypted, not in git)
```

### Disaster Recovery Plan

1. **Database Failure:**
   - Restore from latest Atlas snapshot
   - Update connection string if needed
   - Verify data integrity

2. **Vercel/Hosting Failure:**
   - Check Vercel status page
   - If extended outage, consider temporary hosting on different provider
   - Have backup of latest codebase

3. **Data Loss:**
   - Restore from most recent backup
   - Notify affected users
   - Implement additional safeguards

## Security Monitoring

### Regular Security Tasks

**Weekly:**
- [ ] Review error logs for suspicious activity
- [ ] Check npm audit results
- [ ] Review user account activity

**Monthly:**
- [ ] Rotate JWT secrets
- [ ] Review database access logs
- [ ] Update dependencies

**Quarterly:**
- [ ] Security audit
- [ ] Penetration testing (if budget allows)
- [ ] Review and update security policies

### Security Incident Response

If security incident detected:

1. **Immediate:**
   - Take affected system offline if necessary
   - Change compromised credentials
   - Document everything

2. **Assessment:**
   - Determine scope of breach
   - Identify affected users/data

3. **Notification:**
   - Notify affected users
   - Report to authorities if required (GDPR)

4. **Remediation:**
   - Fix vulnerability
   - Conduct security audit
   - Implement additional security measures

## Useful Commands

```bash
# Monitoring
vercel logs --follow                    # Live logs
vercel logs [deployment-url]            # Specific deployment logs

# Deployment
vercel --prod                           # Deploy to production
vercel rollback [deployment-url]        # Rollback deployment

# Database
mongosh "connection-string"             # Connect to MongoDB
mongodump --uri="uri" --out=./backup    # Backup database
mongorestore --uri="uri" ./backup       # Restore database

# Security
npm audit                               # Check for vulnerabilities
npm audit fix                           # Fix vulnerabilities automatically
```

## Monitoring Checklist

Daily:
- [ ] Check error rates
- [ ] Review critical logs
- [ ] Verify uptime

Weekly:
- [ ] Review performance metrics
- [ ] Check database growth
- [ ] Review user feedback

Monthly:
- [ ] Analyze trends
- [ ] Review capacity planning
- [ ] Update documentation

---

**Need help?** Contact the DevOps team or open an issue for infrastructure-related questions.
