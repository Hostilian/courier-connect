# Contributing to Courier Connect

Thank you for your interest in contributing to Courier Connect! This guide will help you get started.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include as many details as possible using our bug report template.

### Suggesting Features

Feature suggestions are welcome! Use the feature request template and explain:
- The problem you're trying to solve
- Your proposed solution
- Who would benefit (customers, couriers, or both)

### Improving Translations

We support 14+ languages! If you're a native speaker and notice translation issues:
- Use the translation issue template
- Provide context for why the change is needed
- Respect cultural nuances

### Contributing Code

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (see Testing Guidelines below)
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Git

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/courier-connect.git
cd courier-connect

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure your .env.local with:
# - MONGODB_URI (required)
# - JWT_SECRET (required)
# - Other optional services
```

### Running Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/en/` (or any other locale)

## 📝 Code Style & Conventions

### TypeScript Guidelines

- **No `any` types** - Always use proper TypeScript types
- **Explicit return types** for functions
- **Interfaces over types** for object shapes
- **Proper null handling** - Use optional chaining and nullish coalescing

### Component Structure

```typescript
// Client components (interactive)
'use client';

import { useState } from 'react';

export default function MyComponent() {
  // Component logic
}

// Server components (default, no directive needed)
export default async function MyPage() {
  // Can fetch data directly
}
```

### Naming Conventions

- **Components**: PascalCase (`DeliveryForm.tsx`)
- **Utilities**: camelCase (`lib/validation.ts`)
- **Constants**: UPPER_SNAKE_CASE (`const MAX_RETRIES = 3`)
- **Files**: kebab-case for non-components (`database-utils.ts`)

### API Route Pattern

```typescript
import dbConnect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Always connect first
    await dbConnect();
    
    // Your logic here
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🌍 Internationalization (i18n)

### Adding Translations

1. **Add key to English base** (`messages/en.json`):
```json
{
  "myFeature": {
    "title": "My Feature Title",
    "description": "Description here"
  }
}
```

2. **Add to all other language files** (`messages/cs.json`, `messages/de.json`, etc.)
   - If you don't speak the language, add the English text temporarily
   - Mark with `TODO: Translation needed` comment
   - Create a translation issue

3. **Use in components**:
```typescript
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations();
  return <h1>{t('myFeature.title')}</h1>;
}
```

### Cultural Theming

Each language has its own cultural theme in `lib/languages.ts`. When designing:
- Use theme colors from `getLocaleTheme(locale)`
- Respect cultural patterns (geometric, floral, art-nouveau, etc.)
- Test with multiple languages
- Consider RTL languages (Arabic, Hebrew)

## 📱 Mobile-First Design

### Responsive Design Guidelines

- **Start with mobile layout** (320px width)
- **Add breakpoints** using Tailwind:
  - `sm:` - 640px
  - `md:` - 768px
  - `lg:` - 1024px
  - `xl:` - 1280px

Example:
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Mobile: full width, tablet: half, desktop: third */}
</div>
```

### Touch-Friendly

- Minimum touch target: 44x44px
- Adequate spacing between interactive elements
- No hover-only interactions

## 🧪 Testing Guidelines

### Before Submitting PR

1. **Manual Testing**:
   - Test on desktop (Chrome, Firefox, Safari)
   - Test on mobile (Chrome mobile emulator minimum)
   - Test with at least 3 different languages
   - Test RTL layout if UI changes (Arabic locale)

2. **User Flows**:
   - Customer flow (no registration)
   - Courier flow (registration & login)
   - Delivery lifecycle (request → track → complete)

3. **TypeScript Check**:
```bash
npm run type-check
```

4. **Linting**:
```bash
npm run lint
```

5. **Build Test**:
```bash
npm run build
```

## 🔒 Security Guidelines

### Critical Rules

- **Never commit secrets** - Use environment variables
- **Validate all user input** - Use Zod schemas (`lib/validation.ts`)
- **Sanitize data** before database operations
- **Use prepared statements** - Mongoose handles this
- **No sensitive data in logs** - Avoid logging passwords, tokens, etc.

### Authentication

- Only couriers need authentication
- Customers use tracking IDs (no auth)
- JWT tokens stored in localStorage (client-side)
- Protected routes use `withAuth` HOC

## 🗄️ Database Guidelines

### MongoDB Connection

```typescript
// Always use this pattern
import dbConnect from '@/lib/mongodb';

async function myFunction() {
  await dbConnect(); // Required before any DB operation
  
  const delivery = await DeliveryRequest.findOne({ trackingId });
  // ...
}
```

### Schema Changes

- Keep changes backward compatible when possible
- Document breaking changes clearly
- Provide migration scripts if needed
- Test with existing data

## 🚀 Deployment

### Deployment Checklist

Before merging to `main`:

- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No console.log statements in production code
- [ ] Environment variables documented
- [ ] Database migrations provided (if needed)
- [ ] Translation keys added for all languages
- [ ] Mobile responsiveness verified
- [ ] Performance impact assessed

### Environment Variables

If adding new environment variables:
1. Add to `.env.example` with description
2. Document in `DEPLOYMENT.md`
3. Update Vercel environment in production

## 📞 Getting Help

- **Questions?** Open a [Discussion](https://github.com/Hostilian/courier-connect/discussions)
- **Bug?** Use the bug report template
- **Feature idea?** Use the feature request template
- **Translation help?** Use the translation issue template

## 🎯 Project Principles

Remember these core principles when contributing:

1. **Simplicity First** - Users don't care about technical complexity
2. **No Jargon** - Avoid API, GitHub, technical terms in user-facing content
3. **Mobile-First** - Most users are on phones
4. **Cultural Respect** - Honor each language's cultural context
5. **Customer-Friendly** - No registration barriers for customers
6. **Courier-Empowered** - Give couriers tools to succeed

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's license.

---

**Thank you for contributing to Courier Connect!** 🚀
