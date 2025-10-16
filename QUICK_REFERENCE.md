# Quick Reference Guide

Essential commands and patterns for Courier Connect development.

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/Hostilian/courier-connect.git
cd courier-connect
npm install
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development
npm run dev
# Visit http://localhost:3000/en/
```

## 📝 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server

# Code Quality
npm run type-check       # TypeScript validation
npm run lint             # ESLint check
npm run lint -- --fix    # Auto-fix issues

# Git Workflow
git checkout -b feature/my-feature    # New feature branch
git add .
git commit -m "feat: Description"
git push origin feature/my-feature
```

## 🌍 Testing Languages

Visit different locales:
- English: `http://localhost:3000/en/`
- Czech: `http://localhost:3000/cs/`
- German: `http://localhost:3000/de/`
- Arabic (RTL): `http://localhost:3000/ar/`

## 📦 Project Structure

```
courier-connect/
├── app/                    # Next.js app directory
│   ├── [locale]/          # Locale-based routes
│   │   ├── page.tsx       # Homepage
│   │   ├── request/       # Customer request (no auth)
│   │   ├── track/         # Track delivery
│   │   └── courier/       # Courier routes (auth required)
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities & helpers
│   ├── languages.ts       # Language configs & themes
│   ├── countries.ts       # Country data
│   ├── mongodb.ts         # DB connection
│   └── auth.ts            # JWT authentication
├── messages/              # Translation files
│   ├── en.json           # English (base)
│   ├── cs.json, de.json, etc.
├── models/                # MongoDB models
│   ├── DeliveryRequest.ts
│   ├── User.ts
│   └── Rating.ts
└── .github/               # GitHub configs
    ├── workflows/         # CI/CD
    └── ISSUE_TEMPLATE/    # Issue templates
```

## 🔑 Key Patterns

### API Route
```typescript
import dbConnect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await dbConnect(); // Always first!
  // Your logic...
  return NextResponse.json({ data });
}
```

### Protected Route
```typescript
'use client';
import withAuth from '@/components/withAuth';

function Dashboard() { /* ... */ }
export default withAuth(Dashboard);
```

### Translation
```typescript
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations();
  return <h1>{t('home.hero.title')}</h1>;
}
```

### Location Context
```typescript
import { useLocationContext } from '@/components/LocationProvider';

const { location, setLocation, detectLocation } = useLocationContext();
```

## 🎨 Styling

Mobile-first with Tailwind:
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Mobile: full width, tablet: half, desktop: third */}
</div>
```

Cultural theming:
```typescript
import { getLocaleTheme } from '@/lib/languages';
const theme = getLocaleTheme(locale);
// Use theme.primary, theme.gradient, etc.
```

## 🔍 Debugging

```bash
# Check TypeScript errors
npm run type-check

# View build output
npm run build

# Database connection
mongosh "your-mongodb-uri"

# Check Vercel logs
vercel logs --follow
```

## 📋 Before Committing

- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Tested on mobile (Chrome emulator minimum)
- [ ] Tested with 2+ languages
- [ ] No `console.log` in production code
- [ ] All user-facing text uses translations

## 🚨 Common Issues

**Build fails?**
- Check TypeScript errors: `npm run type-check`
- Missing environment variables in `.env.local`

**Database connection errors?**
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB Atlas IP whitelist

**Translations not working?**
- Verify key exists in `messages/en.json`
- Check locale in URL: `/en/`, `/cs/`, etc.
- Clear Next.js cache: Delete `.next` folder

**Authentication issues?**
- Verify `JWT_SECRET` is set
- Check token in localStorage (browser DevTools)

## 📚 Documentation

- **For Contributors**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **For Developers**: [DEVELOPMENT.md](DEVELOPMENT.md)
- **For DevOps**: [DEVOPS.md](DEVOPS.md)
- **For Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **For AI Agents**: [.github/copilot-instructions.md](.github/copilot-instructions.md)

## 🆘 Getting Help

- 🐛 Found a bug? [Report it](.github/ISSUE_TEMPLATE/bug_report.yml)
- 💡 Have an idea? [Suggest it](.github/ISSUE_TEMPLATE/feature_request.yml)
- 🌍 Translation issue? [Report it](.github/ISSUE_TEMPLATE/translation_issue.yml)
- ❓ Questions? [Start a discussion](https://github.com/Hostilian/courier-connect/discussions)

## 🔐 Security

- Never commit secrets (use `.env.local`)
- Report security issues privately via GitHub Security Advisories
- Run `npm audit` regularly

## 📦 Dependencies

```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Fix auto-fixable issues
npm audit fix
```

## 🎯 Key Principles

1. **Simplicity First** - Keep it simple for users
2. **Mobile-First** - Design for phones first
3. **No Jargon** - Avoid technical terms in UI
4. **Cultural Respect** - Honor each language's culture
5. **Customer-Friendly** - No barriers for customers
6. **Type-Safe** - No `any` types in TypeScript

---

**Quick tip**: Bookmark this file for instant access to common commands and patterns!
