# 🚀 Courier Connect - Complete Deployment Guide

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Local Testing](#local-testing)
3. [Vercel Deployment](#vercel-deployment)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Custom Domain Configuration](#custom-domain-configuration)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Pre-Deployment Checklist

### Code Quality
- [x] TypeScript compilation passes (0 errors)
- [x] Production build completes successfully
- [x] CI/CD pipeline configured and passing
- [ ] All critical user flows tested locally
- [ ] E2E tests passing

### Configuration
- [x] `.env.example` up to date
- [ ] All required environment variables documented
- [ ] MongoDB connection string ready
- [ ] JWT secret generated (32+ characters)
- [ ] Stripe keys obtained (if using payments)
- [ ] Resend API key obtained (if using email)
- [ ] Google Maps API key obtained (if using maps)

### Security
- [ ] Rate limiting implemented
- [ ] CSRF protection enabled
- [ ] Input validation on all forms
- [ ] Secure HTTP headers configured
- [ ] Environment secrets not committed to Git

### Content
- [x] All 14 languages have translation files
- [ ] Legal pages complete (Privacy, Terms)
- [ ] Contact information updated
- [ ] Social media links configured

---

## 🖥️ Local Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

**Required Variables**:
```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secure-secret-at-least-32-characters-long
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Optional but Recommended**:
```env
RESEND_API_KEY=re_your_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
STRIPE_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

### 3. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

### 4. Test Critical Flows

#### Customer Flow
1. Go to homepage → Select language & location
2. Click "Request Delivery"
3. Fill delivery form with all required fields
4. Submit and get tracking ID
5. Visit tracking page with ID

#### Courier Flow
1. Go to `/courier/register`
2. Complete registration form
3. Login at `/courier/login`
4. View dashboard
5. Accept a delivery (if any available)
6. Update delivery status

#### Payment Flow (if Stripe configured)
1. Create delivery request
2. Click "Pay Now"
3. Use test card: `4242 4242 4242 4242`
4. Verify payment authorized
5. Mark delivery as delivered
6. Verify payment captured

### 5. Build for Production
```bash
npm run build
npm start
```

Verify production build runs without errors.

---

## ☁️ Vercel Deployment

### Option 1: Deploy via Vercel CLI (Recommended)

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Link Project
```bash
vercel link
```

Select your account and create new project or link existing.

#### 4. Configure Environment Variables
```bash
# Add production environment variables
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add NEXT_PUBLIC_APP_URL production
# ... add all other required variables
```

#### 5. Deploy to Production
```bash
vercel --prod
```

---

### Option 2: Deploy via Vercel Dashboard

#### 1. Go to Vercel Dashboard
Visit: https://vercel.com/new

#### 2. Import Git Repository
- Click "Add New" → "Project"
- Import from GitHub: `Hostilian/courier-connect`
- Select repository

#### 3. Configure Project
**Framework Preset**: Next.js  
**Root Directory**: `./`  
**Build Command**: `npm run build`  
**Output Directory**: `.next`  
**Install Command**: `npm install`

#### 4. Add Environment Variables

Click "Environment Variables" and add:

**Required**:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<secure-random-string-32chars>
NEXT_PUBLIC_APP_URL=https://courier-connect.vercel.app
```

**Optional**:
```
RESEND_API_KEY=re_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_DEFAULT_CURRENCY=usd
FROM_EMAIL=noreply@hostilian.org
```

**Important**: For production, use **LIVE** Stripe keys (`sk_live_...` and `pk_live_...`), not test keys.

#### 5. Deploy
Click "Deploy"

Wait for build to complete (~2-5 minutes).

---

## 🌐 Environment Variables Setup

### Generate Secure Secrets

#### JWT Secret
```bash
# Generate 32-character random string
openssl rand -base64 32
```

Or use online generator: https://randomkeygen.com/ (use Fort Knox Passwords)

#### MongoDB Atlas Setup
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow all) for Vercel
5. Get connection string
6. Replace `<password>` with your database password

**Connection String Format**:
```
mongodb+srv://username:password@cluster.mongodb.net/courier-connect?retryWrites=true&w=majority
```

#### Stripe Setup (Optional)
1. Go to https://dashboard.stripe.com
2. Get API keys from Developers → API keys
3. For production, use **LIVE** mode keys
4. Set up webhook endpoint: `https://hostilian.org/api/payments/webhook`
5. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Copy webhook secret

#### Resend Email Setup (Optional)
1. Go to https://resend.com
2. Create account
3. Get API key
4. Verify domain `hostilian.org`

#### Google Maps Setup (Optional)
1. Go to https://console.cloud.google.com
2. Enable Maps JavaScript API & Directions API
3. Create API key
4. Restrict key to your domain

---

## 🔗 Custom Domain Configuration

### 1. Configure DNS (hostilian.org)

In your DNS provider (Namecheap, GoDaddy, Cloudflare, etc.):

**Add A Record**:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto
```

**Add CNAME Record for www**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

### 2. Add Domain in Vercel

1. Go to project → Settings → Domains
2. Add domain: `hostilian.org`
3. Add domain: `www.hostilian.org`
4. Wait for DNS propagation (5-60 minutes)
5. Verify SSL certificate issued automatically

### 3. Update Environment Variable

In Vercel → Settings → Environment Variables:

Update `NEXT_PUBLIC_APP_URL` to:
```
https://hostilian.org
```

Redeploy after changing this variable.

### 4. Update Stripe Webhook (if using Stripe)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Update endpoint URL to: `https://hostilian.org/api/payments/webhook`
3. Copy new webhook secret
4. Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables

---

## ✅ Post-Deployment Verification

### 1. Homepage
- [ ] Visit https://hostilian.org
- [ ] All sections load correctly
- [ ] Language selector works
- [ ] Location selector works
- [ ] Mobile responsive design works
- [ ] All links work

### 2. Customer Flow
- [ ] Create delivery request
- [ ] Fill form and submit
- [ ] Receive tracking ID
- [ ] Track delivery works
- [ ] Payment flow works (if enabled)

### 3. Courier Flow
- [ ] Register new courier account
- [ ] Receive verification email (if email enabled)
- [ ] Login to dashboard
- [ ] View available deliveries
- [ ] Accept delivery
- [ ] Update delivery status
- [ ] Stripe Connect onboarding works (if enabled)

### 4. API Health Check
```bash
# Check API endpoints
curl https://hostilian.org/api/health
```

### 5. Performance Check
- [ ] Run Lighthouse audit (should be 90+ on all metrics)
- [ ] Check page load time (< 3 seconds)
- [ ] Verify mobile performance

### 6. Security Check
- [ ] HTTPS working correctly
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] Secure headers present

---

## 📊 Monitoring & Maintenance

### Vercel Analytics
Enable in project settings → Analytics
- Track page views
- Monitor performance
- View visitor insights

### Error Monitoring (Optional)
Recommended: Sentry.io

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Logs
View deployment logs in Vercel Dashboard → Deployments → Select deployment → View Logs

### Database Monitoring
Monitor MongoDB Atlas:
- Go to Atlas dashboard
- Check connection count
- Monitor disk usage
- Set up alerts for high usage

---

## 🔧 Troubleshooting

### Build Fails

**Issue**: TypeScript errors
```bash
npm run type-check
```
Fix all type errors before deploying.

**Issue**: Missing dependencies
```bash
npm ci
```

**Issue**: Environment variables not set
- Check all required variables are added in Vercel
- Verify no typos in variable names

### Runtime Errors

**Issue**: "MONGODB_URI is not defined"
- Add `MONGODB_URI` to Vercel environment variables
- Redeploy

**Issue**: "JWT_SECRET must be at least 32 characters"
- Generate secure 32+ character secret
- Update `JWT_SECRET` in Vercel
- Redeploy

**Issue**: Stripe webhooks not working
- Verify webhook URL: `https://hostilian.org/api/payments/webhook`
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Test webhook in Stripe Dashboard

**Issue**: Email not sending
- Verify `RESEND_API_KEY` is set
- Check domain verification in Resend
- Check FROM_EMAIL is from verified domain

### Performance Issues

**Issue**: Slow page loads
- Enable image optimization
- Add caching headers
- Use CDN for static assets
- Optimize database queries

**Issue**: High API response times
- Check MongoDB query performance
- Add database indexes
- Optimize API route logic

---

## 🎯 Production Checklist

### Pre-Launch
- [ ] All environment variables set
- [ ] Stripe live keys configured (not test keys)
- [ ] Email domain verified
- [ ] Database backed up
- [ ] DNS configured
- [ ] SSL certificate active

### Launch Day
- [ ] Monitor error logs
- [ ] Test all critical flows
- [ ] Have rollback plan ready
- [ ] Monitor performance metrics
- [ ] Check payment processing works

### Post-Launch
- [ ] Set up monitoring alerts
- [ ] Schedule regular database backups
- [ ] Monitor Stripe dashboard for payments
- [ ] Track user signups
- [ ] Review error logs daily

---

## 📞 Support Resources

- **Vercel Support**: https://vercel.com/support
- **MongoDB Support**: https://www.mongodb.com/cloud/atlas/support
- **Stripe Support**: https://support.stripe.com
- **Next.js Docs**: https://nextjs.org/docs

---

## 🚦 Quick Commands

```bash
# Local development
npm run dev

# Type check
npm run type-check

# Build production
npm run build

# Start production server locally
npm start

# Deploy to Vercel
vercel --prod

# Check environment status
node -e "require('./lib/env-validation').console.log(getEnvironmentStatus())"
```

---

**Last Updated**: October 20, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅

---

Made with ❤️ by the Courier Connect team
