# 🌐 Custom Domain Setup - hostilian.org

## ✅ Vercel Deployment Status

Your Courier Connect app is deployed at:
- **Production URL**: https://courier-connect-lq0tu3ce3-hostilianns-projects.vercel.app
- **Target Custom Domain**: hostilian.org

---

## 🔧 Step 1: Add Domain to Vercel

Run this command (or use Vercel dashboard):

```bash
vercel domains add hostilian.org
```

Or in the Vercel Dashboard:
1. Go to https://vercel.com/hostilianns-projects/courier-connect
2. Click **Settings** → **Domains**
3. Enter `hostilian.org` and click **Add**

---

## 🌍 Step 2: Configure DNS Records

### Option A: Use Vercel Nameservers (Recommended - Easiest)

If Vercel manages your DNS, they'll handle everything automatically.

In your domain registrar (where you bought hostilian.org):
1. Find DNS/Nameserver settings
2. Change nameservers to Vercel's:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. Wait 24-48 hours for propagation (usually faster)

---

### Option B: Add DNS Records Manually (If you manage DNS elsewhere)

In your DNS provider (Cloudflare, GoDaddy, Namecheap, etc.):

#### For Root Domain (hostilian.org):

**Add an A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Or ALIAS/CNAME Record (if supported):**
```
Type: ALIAS or ANAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

#### For www Subdomain (www.hostilian.org):

**Add a CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

---

## 🔐 Step 3: SSL Certificate (Automatic)

Vercel automatically provisions and manages SSL certificates for your domain using Let's Encrypt. Once DNS is configured:
- ✅ HTTPS will be enabled automatically
- ✅ Certificate auto-renews
- ✅ HTTP redirects to HTTPS

---

## ⚡ Step 4: Environment Variables on Vercel

Make sure your production environment variables are set:

```bash
# Add via CLI
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production

# Or via Dashboard
# Settings → Environment Variables → Add
```

Required variables:
```
MONGODB_URI=mongodb+srv://...your-atlas-connection
JWT_SECRET=your-64-character-secret
```

Optional variables:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
```

---

## 📊 Step 5: Verify Domain Setup

### Check DNS Propagation:
```bash
# Check if DNS is resolving
nslookup hostilian.org

# Check from multiple locations
# Visit: https://dnschecker.org/#A/hostilian.org
```

### Test Your Site:
Once DNS propagates (can take minutes to hours):
1. Visit https://hostilian.org
2. Should see your Courier Connect homepage
3. SSL certificate should be active (padlock icon)

---

## 🎯 Quick Setup Commands

```bash
# 1. Deploy to production
vercel --prod

# 2. Add custom domain
vercel domains add hostilian.org

# 3. Add www subdomain
vercel domains add www.hostilian.org

# 4. Check domain status
vercel domains ls

# 5. Set environment variables
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
```

---

## 🔍 Troubleshooting

### Domain Not Working After DNS Setup?

**Check DNS Configuration:**
```bash
# Verify A record
dig hostilian.org A

# Verify CNAME record
dig www.hostilian.org CNAME
```

**Common Issues:**

1. **DNS Not Propagated Yet**
   - Wait up to 48 hours (usually 15 mins - 2 hours)
   - Check https://dnschecker.org

2. **Wrong DNS Records**
   - Verify A record points to `76.76.21.21`
   - Verify CNAME points to `cname.vercel-dns.com`

3. **SSL Certificate Pending**
   - Wait a few minutes after DNS propagates
   - Vercel auto-provisions certificates
   - Check Vercel dashboard for status

4. **Environment Variables Missing**
   - App deploys but shows errors
   - Add required env vars in Vercel Settings

---

## 📱 Vercel Dashboard Links

- **Project Settings**: https://vercel.com/hostilianns-projects/courier-connect/settings
- **Domains**: https://vercel.com/hostilianns-projects/courier-connect/settings/domains
- **Environment Variables**: https://vercel.com/hostilianns-projects/courier-connect/settings/environment-variables
- **Deployments**: https://vercel.com/hostilianns-projects/courier-connect

---

## 🎨 Update Site Metadata (Optional)

Once your domain is live, update the site URLs in your code:

**File: `app/layout.tsx`**
```typescript
export const metadata: Metadata = {
  title: 'Courier Connect - Neighbors Helping Neighbors',
  description: '...',
  metadataBase: new URL('https://hostilian.org'),
  // ...
}
```

**File: `public/manifest.json`**
```json
{
  "name": "Courier Connect",
  "short_name": "Courier",
  "start_url": "https://hostilian.org",
  "scope": "https://hostilian.org",
  // ...
}
```

---

## ✅ Expected Timeline

| Step | Time |
|------|------|
| Deploy to Vercel | Instant |
| Add domain in Vercel | Instant |
| Configure DNS records | 5 minutes |
| DNS propagation | 15 mins - 48 hours |
| SSL certificate issued | 5-10 minutes after DNS |
| Site live at hostilian.org | After DNS + SSL |

---

## 🚀 Current Status

- ✅ **Deployed**: Production build on Vercel
- ⏳ **Domain**: Add hostilian.org in Vercel dashboard
- ⏳ **DNS**: Configure at your domain registrar
- ⏳ **SSL**: Auto-provisions after DNS setup
- ⏳ **Env Vars**: Add MONGODB_URI and JWT_SECRET

---

## 🎉 After Setup

Your Courier Connect platform will be accessible at:
- ✅ https://hostilian.org (root domain)
- ✅ https://www.hostilian.org (www subdomain)
- ✅ Auto HTTPS with SSL certificate
- ✅ Global CDN edge network
- ✅ Automatic deployments on git push

---

## 💡 Pro Tips

1. **Set up www redirect**: Configure www.hostilian.org to redirect to hostilian.org (or vice versa) in Vercel dashboard
2. **Enable Vercel Analytics**: Free in Settings → Analytics
3. **Set up monitoring**: Use Vercel's built-in monitoring or add Sentry
4. **Branch previews**: Every PR gets a preview URL automatically

---

<div align="center">

## 🌟 Your Domain Setup Guide

**Follow the steps above to get hostilian.org live!**

Need help? Check the Vercel documentation:
https://vercel.com/docs/concepts/projects/domains

</div>
