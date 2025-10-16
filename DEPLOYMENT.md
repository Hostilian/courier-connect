# Deployment Guide

## Vercel Deployment

1. Push code to GitHub (repository: Hostilian/courier-connect)
2. Import repository in Vercel
3. Add environment variables from `.env.example`
4. Deploy

## Environment Variables

Configure in Vercel dashboard:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## Custom Domain

1. Add domain in Vercel: hostilian.org
2. Update DNS records to point to Vercel

## Post-Deployment

- Configure Stripe webhook: `https://your-domain.com/api/stripe/webhook`
- Verify MongoDB connection is accessible
- Test email notifications
- Test all language routes

