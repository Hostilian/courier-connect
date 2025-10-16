# Deployment

We recommend Vercel for zero-config deployment.

Steps
1. Push to GitHub (repository: Hostilian/courier-connect).
2. Import to Vercel and select this repo.
3. Add environment variables from `.env.example`.
4. Deploy.

Custom domain: hostilian.org
- In Vercel, add domain `hostilian.org` and `www.hostilian.org`.
- Update DNS to point to Vercel.

Notes
- Do not commit secrets.
- Ensure MongoDB (Atlas or self-hosted) is reachable from Vercel.
- Stripe webhook URL: set in Stripe Dashboard to `/api/stripe/webhook` of your deployment URL.
