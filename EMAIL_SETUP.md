# Configuring Email for hostilian.org

Since you're using Squarespace as your domain registrar and they're promoting Google Workspace for custom email, here's how to set up professional email for your domain.

## Option 1: Google Workspace (Recommended for Business)

### Features
- Professional email (@hostilian.org)
- Google productivity tools (Docs, Sheets, etc.)
- 30GB to unlimited storage depending on plan
- Video conferencing
- Shared calendars
- 24/7 support

### Setup Steps
1. Click "Get Started" on the Squarespace email promotion
2. Follow the Google Workspace setup wizard
3. Verify domain ownership (typically through a DNS TXT record)
4. Set up user accounts (e.g., contact@hostilian.org, support@hostilian.org)
5. Configure MX records (Google Workspace will provide these)

### Cost
- Business Starter: $6/user/month
- Business Standard: $12/user/month
- Business Plus: $18/user/month

## Option 2: Zoho Mail (Budget-Friendly)

### Features
- Professional email (@hostilian.org)
- 5GB to 50GB storage depending on plan
- Web client and mobile apps
- Free plan available (limited features)

### Setup Steps
1. Sign up at [Zoho Mail](https://www.zoho.com/mail/)
2. Add your domain (hostilian.org)
3. Verify domain ownership
4. Add these DNS records to Squarespace:

   | Host     | Type  | Priority | TTL     | Data                          |
   |----------|-------|----------|---------|-------------------------------|
   | @        | MX    | 10       | 30 mins | mx.zoho.com                   |
   | @        | MX    | 20       | 30 mins | mx2.zoho.com                  |
   | zoho1._domainkey | CNAME | N/A    | 30 mins | [provided by Zoho]           |
   | zoho2._domainkey | CNAME | N/A    | 30 mins | [provided by Zoho]           |

### Cost
- Forever Free: $0 (up to 5 users, 5GB/user)
- Mail Lite: $1/user/month
- Mail Premium: $4/user/month

## Option 3: Squarespace Email Marketing (Not for Regular Email)

If you only need to send marketing emails and newsletters:

1. Use Squarespace Email Campaigns
2. Set up in your Squarespace dashboard
3. No additional DNS configuration required

This is NOT for receiving emails or day-to-day communication.

## Option 4: Email Forwarding

If you just need a professional email address that forwards to your existing email:

1. Use a service like [ImprovMX](https://improvmx.com/) (free plan available)
2. Add their MX records to your Squarespace DNS settings
3. Configure forwarding addresses

Example setup:
- Forward info@hostilian.org → your-personal-email@gmail.com
- Send emails from your Gmail but they appear as from info@hostilian.org

## DNS Records for Email

When setting up email, you'll need to add these record types:

1. **MX Records**: Direct email to the correct mail server
2. **SPF Records**: Prevent email spoofing
3. **DKIM Records**: Email authentication
4. **DMARC Records**: Reporting and conformance

Your email provider will give you the exact values to use.

## Important Notes

- Email setup is separate from your website hosting
- Vercel doesn't provide email hosting
- You can use different services for website (Vercel) and email (Google/Zoho)
- Always set up proper SPF/DKIM records to avoid spam filtering issues
- Test your email setup thoroughly before using it for important communication