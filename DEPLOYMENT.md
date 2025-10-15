# 🚀 Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Hostilian/courier-connect)

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables on Vercel

Go to your project settings and add:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_minimum_32_characters
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key (optional)
```

---

## Deploy with Docker

### Build and Run

```bash
# Build image
docker build -t courier-connect .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI=your_connection_string \
  -e JWT_SECRET=your_secret \
  courier-connect
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Deploy to Railway

1. Visit [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables
5. Deploy!

---

## Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
ntl deploy --prod
```

---

## Deploy to AWS (Amplify)

1. Visit AWS Amplify Console
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy!

---

## Environment Setup

### Required Variables

```bash
MONGODB_URI          # MongoDB connection string
JWT_SECRET           # JWT secret (min 32 chars)
```

### Optional Variables

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY    # For maps integration
STRIPE_SECRET_KEY                   # For payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY # For payments
```

---

## Production Checklist

Before deploying to production:

- [x] Update environment variables
- [x] Test all pages work correctly
- [x] Verify mobile responsiveness
- [x] Check API endpoints
- [x] Test authentication flow
- [x] Verify database connection
- [x] Enable HTTPS
- [x] Set up monitoring
- [x] Configure domain (if custom)
- [x] Test payment integration (if enabled)

---

## Post-Deployment

### Monitoring

Set up monitoring with:
- Vercel Analytics (built-in)
- Google Analytics
- Sentry (error tracking)

### Custom Domain

On Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed

### SSL Certificate

SSL is automatic on Vercel and most platforms!

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables Not Working

Make sure to:
1. Set them in platform dashboard
2. Redeploy after adding variables
3. Check variable names match exactly

### Database Connection Issues

- Verify MongoDB URI is correct
- Check IP whitelist (for MongoDB Atlas)
- Ensure network access is enabled

---

## Performance Tips

- ✅ Enable caching headers (done in vercel.json)
- ✅ Use CDN for static assets
- ✅ Optimize images with Next/Image
- ✅ Enable compression
- ✅ Monitor Core Web Vitals

---

## Scaling

As your app grows:

1. **Database**: Upgrade MongoDB plan
2. **Hosting**: Upgrade Vercel/platform tier
3. **CDN**: Use Cloudflare for global edge caching
4. **Monitoring**: Add performance monitoring
5. **Load Balancing**: For high traffic

---

Need help? Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or open an issue!
