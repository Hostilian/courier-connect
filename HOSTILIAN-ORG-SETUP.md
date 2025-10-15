# 🚀 Quick Setup: Deploy to hostilian.org

## ✅ Current Status
- ✅ App deployed to Vercel: https://courier-connect-lq0tu3ce3-hostilianns-projects.vercel.app
- ⏳ Custom domain: hostilian.org (needs setup)

---

## 🎯 Simple 3-Step Setup

### Step 1: Add Domain in Vercel Dashboard (2 minutes)

1. **Open your project**: https://vercel.com/hostilianns-projects/courier-connect
2. Click **Settings** → **Domains**
3. Type `hostilian.org` in the input box
4. Click **Add**
5. Vercel will show you what DNS records to add

---

### Step 2: Configure DNS (5 minutes + propagation time)

Go to where you manage `hostilian.org` DNS (your domain registrar):

#### Add These Records:

**For hostilian.org (root):**
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
```

**For www.hostilian.org:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Common DNS Providers:**
- **Cloudflare**: DNS → Add record
- **Namecheap**: Advanced DNS → Add New Record
- **GoDaddy**: DNS Management → Add
- **Google Domains**: DNS → Custom records

---

### Step 3: Add Environment Variables (IMPORTANT!)

Your app needs these to work:

**Via Vercel Dashboard:**
1. Go to https://vercel.com/hostilianns-projects/courier-connect/settings/environment-variables
2. Add each variable:

```
MONGODB_URI = mongodb+srv://your-connection-string
JWT_SECRET = your-64-character-random-secret
```

**Generate JWT Secret:**
```bash
# Run this to generate a secure secret:
openssl rand -base64 64
```

**MongoDB Atlas:**
1. Go to https://cloud.mongodb.com
2. Create cluster (free tier available)
3. Get connection string from "Connect" button
4. Replace `<password>` with your database password

---

## ⏰ Timeline

| Action | Time |
|--------|------|
| Add domain in Vercel | Instant |
| Configure DNS records | 5 minutes |
| DNS propagation | 15 mins - 48 hours (usually 1-2 hours) |
| SSL certificate | Automatic after DNS |
| Site live! | After DNS propagates |

---

## ✅ How to Know It's Working

### Check DNS Propagation:
Visit: https://dnschecker.org/#A/hostilian.org
- Should show `76.76.21.21` worldwide

### Check Your Site:
1. Visit https://hostilian.org
2. See your Courier Connect homepage
3. Green padlock = SSL working

---

## 🆘 Troubleshooting

### "Site can't be reached"
- **Wait**: DNS takes time to propagate (up to 48 hours)
- **Check**: Visit https://dnschecker.org/#A/hostilian.org

### "Connection not secure" / SSL error
- **Wait**: SSL certificate takes 5-10 mins after DNS is ready
- **Check**: Vercel dashboard shows certificate status

### App shows errors after loading
- **Fix**: Add environment variables (MONGODB_URI, JWT_SECRET)
- **Where**: Vercel Settings → Environment Variables

### Domain shows "Deployment Not Found"
- **Fix**: Make sure domain is added to the correct project
- **Check**: Vercel dashboard → Domains section

---

## 📱 Use Vercel Dashboard (Easiest Way)

Instead of CLI, use the visual interface:

1. **Domains**: https://vercel.com/hostilianns-projects/courier-connect/settings/domains
2. **Environment Variables**: https://vercel.com/hostilianns-projects/courier-connect/settings/environment-variables
3. **Deployments**: https://vercel.com/hostilianns-projects/courier-connect

---

## 🎉 After Setup

Your site will be live at:
- ✅ https://hostilian.org
- ✅ https://www.hostilian.org
- ✅ Auto HTTPS/SSL
- ✅ Global CDN
- ✅ Auto-deploy on git push

---

## 💾 Quick Reference: DNS Records

**Copy these values to your DNS provider:**

```
# Root domain
Type: A
Host: @
Value: 76.76.21.21
TTL: 3600

# WWW subdomain
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: 3600
```

---

## 🔗 Helpful Links

- **Vercel Domain Docs**: https://vercel.com/docs/concepts/projects/domains
- **Your Project**: https://vercel.com/hostilianns-projects/courier-connect
- **DNS Checker**: https://dnschecker.org
- **MongoDB Atlas**: https://cloud.mongodb.com

---

<div align="center">

## 🎯 Next Action

**Go to Vercel Dashboard and add hostilian.org:**

https://vercel.com/hostilianns-projects/courier-connect/settings/domains

Then configure DNS at your domain registrar!

</div>
