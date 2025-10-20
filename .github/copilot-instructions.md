npm run build     # Production build
npm run start     # Production server
npm run type-check # TypeScript validation

# Courier Connect – AI Agent Best Practices & Guidance

## Purpose
This document provides actionable instructions for AI coding agents working on Courier Connect. It covers architecture, workflows, code conventions, QA, deployment, and agent-specific best practices. **Always prioritize business value, clarity, and user experience.**

---

## 1. Platform Principles
- **Business-first:** Focus on connecting couriers and customers. Avoid technical jargon in user-facing content.
- **No customer registration:** Customers request deliveries without accounts. Couriers must register and verify.
- **Multilingual & culturally themed:** Each locale uses a unique theme from `lib/languages.ts`. Always apply correct colors, gradients, and patterns.
- **Location-aware:** Use `LocationProvider` and `LocationSelector` for country/city selection. Auto-detect and manual selection must work.

---

## 2. Architecture & Tech Stack
- **Next.js 14 (App Router, TypeScript)**
- **MongoDB/Mongoose** (singleton connection in `lib/mongodb.ts`)
- **JWT auth for couriers only** (`lib/auth.ts`)
- **Tailwind CSS + Framer Motion**
- **Stripe payments, Resend email, Google Maps API** (optional for MVP)
- **next-intl** for 14+ languages, with locale-prefixed routes

---

## 3. Routing & Structure
- **Locale prefix required:** All routes must start with `/[locale]/` (enforced by `middleware.ts`).
- **Public routes:** Homepage, request, track (no auth for customers).
- **Protected routes:** Courier dashboard, registration, login (auth required).
- **Route examples:**
  - `/[locale]/` – Homepage
  - `/[locale]/request` – Customer delivery request
  - `/[locale]/track` – Track delivery
  - `/[locale]/courier/register` – Courier registration
  - `/[locale]/courier/dashboard` – Courier dashboard

---

## 4. Coding Agent Best Practices
- **Always use business-friendly language in UI and docs.**
- **Mobile-first:** Design for mobile, then add desktop breakpoints.
- **Cultural themes:** Use `getLocaleTheme(locale)` for colors/patterns. Never use generic colors.
- **RTL support:** For Arabic/Hebrew, set `dir="rtl"` and apply correct CSS.
- **No customer auth:** Never add auth walls to customer flows.
- **Tracking IDs are public:** Anyone with an ID can track a delivery.
- **Type safety:** Use TypeScript strictly. Avoid `any` types.
- **Accessibility:** Use semantic HTML, ARIA labels, keyboard navigation, and ensure color contrast.
- **Performance:** Optimize images, lazy load, and minimize bundle size.
- **Testing:** Use Playwright for E2E, axe for accessibility, Lighthouse for performance.

---

## 5. Development & QA Workflow
**Follow this checklist for every major change:**
1. **Homepage loads at /** and all `/[locale]/` routes
2. **Customer delivery request flow:** Submit, get tracking ID, track
3. **Courier registration/login:** Register, verify email, login, dashboard
4. **Dashboard features:** Accept delivery, update status, view earnings
5. **Payments:** Stripe flow for customer/courier (test mode)
6. **Email notifications:** Trigger and verify (if configured)
7. **Location detection/selection:** Auto/manual, UI updates
8. **Mobile responsiveness:** Test on mobile viewport
9. **Accessibility:** ARIA, keyboard, color contrast
10. **SEO:** Meta tags, OpenGraph, sitemap
11. **Environment setup:** `.env.local`, `.env.example` complete
12. **TypeScript/lint:** `npm run type-check` and lint
13. **Production build:** `npm run build` (no errors)
14. **CI/CD:** Check `.github/workflows/ci.yml` for lint, type-check, build, test
15. **Deployment docs:** Up to date for Vercel, domain, environment
16. **Production deployment:** Deploy, verify live site
17. **Sales docs:** Business overview complete
18. **Performance:** Lighthouse audit, optimize
19. **Commit/push:** All changes with clear messages

---

## 6. File Reference
- **Translations:** `messages/[locale].json`
- **Language config:** `lib/languages.ts`
- **Country data:** `lib/countries.ts`
- **DB models:** `models/`
- **API routes:** `app/api/`
- **Client components:** `components/`
- **Auth logic:** `lib/auth.ts`
- **Email templates:** `lib/email.ts`
- **Validation schemas:** `lib/validation.ts`

---

## 7. Example Patterns
**API Route:**
```typescript
import dbConnect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  await dbConnect();
  // ...existing code...
}

export async function POST(request: NextRequest) {
  await dbConnect();
  // ...existing code...
}
```

**Protected Route (Courier):**
```typescript
import withAuth from '@/components/withAuth';

function CourierDashboard() {
  // ...existing code...
}

export default withAuth(CourierDashboard);
```

**Client Component:**
```typescript
'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function DeliveryCard({ trackingId, status, urgency }) {
  const t = useTranslations('delivery');
  // ...existing code...
}
```

**LocationProvider Usage:**
```typescript
'use client';
import { useLocationContext } from '@/components/LocationProvider';

const { location, setLocation, detectLocation } = useLocationContext();
// ...existing code...
```

---

## 8. Deployment & CI/CD
- **Vercel deployment:** Use `.github/workflows/deploy.yml` and `.github/workflows/ci.yml`.
- **Secrets:** Use `TOKENVERCEL` for Vercel CLI. Never commit secrets.
- **Environment files:** `.env.local`, `.env.example` must be complete and ignored in `.gitignore`.
- **Production:** Deploy to Vercel, configure domain, verify live site.

---

## 9. Agent Onboarding & Collaboration
- **Read this guide before making changes.**
- **Follow the QA checklist for every PR.**
- **Document all major changes in commit messages and PR descriptions.**
- **If unsure, ask for clarification or review.**
- **Prioritize user experience, clarity, and business value.**

---

## 10. Final Reminders
- **Keep it simple.** Courier Connect is about connecting people, not showcasing technology.
- **User-facing content must be warm, friendly, and jargon-free.**
- **Always test your changes across all locales and devices.**

---

**For questions or onboarding, refer to this guide and the README.**
