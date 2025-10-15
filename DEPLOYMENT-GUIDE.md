# Courier Connect - Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites
- GitHub account with courier-connect repository
- MongoDB Atlas cluster with connection string
- Vercel account (free tier works)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: complete platform ready for production"
git push origin itirations
```

### Step 2: Deploy on Vercel

1. **Go to [vercel.com](https://vercel.com/)**
2. **Import your repository:**
   - Click "Add New" → "Project"
   - Select "Import from GitHub"
   - Find `Hostilian/courier-connect`
   - Click "Import"

3. **Configure project settings:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```env
   MONGODB_URI=mongodb+srv://eren:1234@cluster0.mongodb.net/courier
   JWT_SECRET=5b4ee330bf5f988877ed742266f70525251379f8a6cb7cecce8bc6deb8958e182fa58d506290e76605d0cd8513e236f156f4fbe439e5f9fee18c3c2685a6fbc4
   NODE_ENV=production
   ```

   **Important:** Use production MongoDB URI (create new cluster for production)

5. **Click "Deploy"**
   - Vercel will build and deploy your app (~2-3 minutes)
   - You'll get a URL like: `courier-connect-xyz.vercel.app`

### Step 3: Configure Custom Domain

1. **In Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter: `hostilian.org`
   - Click "Add"

2. **Configure DNS (at your domain registrar):**
   
   Add these records:
   ```
   Type    Name    Value
   A       @       76.76.21.21
   CNAME   www     cname.vercel-dns.com
   ```

3. **Wait for SSL:**
   - Vercel auto-provisions SSL certificate (1-5 minutes)
   - Once ready, your site will be live at `https://hostilian.org`

### Step 4: Verify Deployment

Test all critical flows:

✅ **Homepage:** https://hostilian.org
✅ **Request Delivery:** https://hostilian.org/en/request
✅ **Track Delivery:** https://hostilian.org/en/track
✅ **Courier Register:** https://hostilian.org/en/courier/register
✅ **Courier Login:** https://hostilian.org/en/courier/login
✅ **Courier Dashboard:** https://hostilian.org/en/courier/dashboard

### Step 5: Production MongoDB Setup

**For production, create a separate MongoDB cluster:**

1. Go to MongoDB Atlas
2. Create new cluster (M10+ recommended for production)
3. **Configure Security:**
   - Add IP whitelist: `0.0.0.0/0` (or specific Vercel IPs)
   - Create database user with strong password
4. Get connection string
5. Update `MONGODB_URI` in Vercel environment variables
6. Redeploy from Vercel dashboard

---

## 🔄 Continuous Deployment

### GitHub Actions (Already Configured)

The CI/CD pipeline (`.github/workflows/ci-cd.yml`) automatically:

1. **On Every Push:**
   - Runs TypeScript type check
   - Runs ESLint
   - Builds the application
   - Runs tests (if available)

2. **On Pull Requests:**
   - Same checks as above
   - Vercel creates preview deployment

3. **On Merge to Main:**
   - Deploys to production automatically

### Manual Deployment

To manually trigger deployment:

```bash
# From Vercel CLI
npm i -g vercel
vercel --prod

# Or push to main branch
git push origin main
```

---

## 📊 Post-Deployment Checklist

### Immediate (Within 1 hour)
- [ ] Test customer flow: Request → Track
- [ ] Test courier flow: Register → Login → Accept → Deliver
- [ ] Verify all 14 languages load correctly
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Check all API endpoints respond correctly
- [ ] Verify MongoDB connection is stable

### Within 24 Hours
- [ ] Monitor error logs in Vercel dashboard
- [ ] Check MongoDB Atlas metrics (connections, operations)
- [ ] Test payment flow (when Stripe integrated)
- [ ] Verify email/SMS notifications work
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry)

### Within 1 Week
- [ ] Analyze user behavior (Google Analytics)
- [ ] Gather initial user feedback
- [ ] Monitor performance metrics (Core Web Vitals)
- [ ] Review and optimize database queries
- [ ] Set up backup strategy for MongoDB
- [ ] Plan marketing campaign launch

---

## 🔒 Security Recommendations

### Environment Variables
```env
# Production MongoDB (separate from development)
MONGODB_URI=mongodb+srv://prod_user:STRONG_PASSWORD@prod-cluster.mongodb.net/courier_prod

# Generate new JWT secret for production
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# Always set to production
NODE_ENV=production

# Add when ready
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
```

### MongoDB Security
1. **Enable IP Whitelist:** Add only Vercel IPs
2. **Strong Password:** Use 32+ character random string
3. **Database User:** Create read/write user (not admin)
4. **Enable Auditing:** Track all database access
5. **Backup Schedule:** Daily automated backups

### Application Security
1. **Rate Limiting:** Add to API routes (10 req/min)
2. **CORS:** Configure allowed origins
3. **Headers:** Add security headers in next.config.js
4. **Input Validation:** Sanitize all user inputs
5. **Error Handling:** Never expose stack traces in production

---

## 📈 Monitoring & Analytics

### Vercel Analytics (Built-in)
- Real-time traffic monitoring
- Performance metrics
- Geographic distribution
- Device/browser stats

### Google Analytics 4 (Recommended)
```bash
# Add to app/layout.tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
<Script id="google-analytics">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🚨 Troubleshooting

### Build Fails
**Error:** "Module not found"
```bash
# Solution: Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### MongoDB Connection Issues
**Error:** "MongoServerError: Authentication failed"
```bash
# Solutions:
# 1. Check username/password in connection string
# 2. Verify IP whitelist includes 0.0.0.0/0
# 3. Ensure database user has readWrite permissions
# 4. Test connection string locally first
```

### 404 on Custom Domain
**Issue:** Domain shows 404 after configuration
```bash
# Solutions:
# 1. Wait 24-48 hours for DNS propagation
# 2. Check DNS records are correctly configured
# 3. Verify domain is added in Vercel dashboard
# 4. Clear browser DNS cache (chrome://net-internals/#dns)
```

### Slow API Response
**Issue:** API routes taking >1s to respond
```bash
# Solutions:
# 1. Check MongoDB Atlas cluster location (use closest region)
# 2. Add database indexes on frequently queried fields
# 3. Enable MongoDB connection pooling
# 4. Consider Redis caching for frequent queries
# 5. Upgrade MongoDB cluster tier
```

---

## 📞 Support

**Deployment Issues:**
- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions

**Platform Issues:**
- Email: support@hostilian.org
- GitHub Issues: https://github.com/Hostilian/courier-connect/issues

---

## 🎉 Success!

Your Courier Connect platform is now live at **https://hostilian.org**!

**What's Working:**
✅ 14 languages (en, es, fr, de, it, pt, cs, uk, vi, tr, ru, pl, ar, zh)
✅ Customer delivery requests (no registration required)
✅ Real-time package tracking
✅ Courier registration & authentication
✅ Delivery acceptance & status updates
✅ Automatic earnings calculation
✅ Mobile-responsive design
✅ Cultural themes per language
✅ Secure JWT authentication
✅ MongoDB database backend

**Ready for Users! 🚀**
