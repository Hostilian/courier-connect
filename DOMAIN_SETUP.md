# Domain Setup for Courier Connect on hostilian.org

## DNS Configuration for Squarespace Domain Management

| Host    | Type  | Priority | TTL     | Data                |
|---------|-------|----------|---------|---------------------|
| @       | A     | N/A      | 30 mins | 76.76.21.21         |
| www     | CNAME | N/A      | 30 mins | cname.vercel-dns.com|

## Vercel Configuration Steps

1. **Add Domain in Vercel**
   - Go to: Project → Settings → Domains
   - Add domain: `hostilian.org`
   - Add domain: `www.hostilian.org`

2. **Configure Redirects**
   - Set www → non-www or non-www → www as preferred
   - Recommended: non-www to www (hostilian.org → www.hostilian.org)

3. **HTTPS Configuration**
   - Vercel automatically provisions SSL certificates
   - Let Vercel handle SSL configuration
   - No additional setup needed for HTTPS

## After Configuration

1. **Verify Domain Connection**
   - Visit https://hostilian.org and https://www.hostilian.org
   - Both should load your Courier Connect application
   - Check for any SSL certificate errors

2. **Test API Functionality**
   - Test API endpoints to ensure domain configuration works
   - Verify MongoDB connectivity works with the new domain

3. **Update Environment Variables**
   - Make sure `NEXT_PUBLIC_APP_URL` is set to your domain:
   ```
   NEXT_PUBLIC_APP_URL=https://www.hostilian.org
   ```

4. **Optional: Set Up Custom Email**
   - If you want email at your domain, consider:
     - Google Workspace (mentioned in your domain panel)
     - Microsoft 365
     - Zoho Mail (free tier available)

## Troubleshooting

- **Domain not connecting**: Check DNS settings and verify they match Vercel requirements
- **SSL errors**: Wait up to 24 hours for certificates to provision
- **API issues**: Update CORS settings if needed for the new domain
- **Redirect problems**: Check Vercel domain settings for proper redirect configuration

## Domain Privacy and Security

- Keep domain privacy protection enabled
- Consider setting up DNSSEC if supported
- Set a strong password on your domain registrar account
- Enable two-factor authentication on Squarespace as suggested

## References

- [Vercel Domain Configuration Guide](https://vercel.com/docs/projects/domains)
- [Squarespace DNS Settings Guide](https://support.squarespace.com/hc/en-us/articles/360002101888)