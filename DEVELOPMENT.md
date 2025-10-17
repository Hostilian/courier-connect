# Development Workflows

This document describes common development workflows for Courier Connect.

## Table of Contents

- [Database Migrations](#database-migrations)
- [Testing Workflows](#testing-workflows)
- [Internationalization Workflow](#internationalization-workflow)
- [Feature Development](#feature-development)
- [Hotfix Workflow](#hotfix-workflow)

## Database Migrations

### Schema Changes

When modifying Mongoose schemas in `models/`:

1. **Make changes backward compatible when possible**
   ```typescript
   // Good: Adding optional field
   newField?: string;
   
   // Requires migration: Changing required field
   // oldField: string; → newField: number;
   ```

2. **Create migration script** (if needed):
   ```bash
   # Create scripts/migrations directory
   mkdir -p scripts/migrations
   
   # Create migration file
   touch scripts/migrations/001-add-field-to-deliveries.ts
   ```

3. **Migration script template**:
   ```typescript
   import dbConnect from '@/lib/mongodb';
   import DeliveryRequest from '@/models/DeliveryRequest';
   
   async function migrate() {
     await dbConnect();
     
     console.log('Starting migration...');
     
     const result = await DeliveryRequest.updateMany(
       { newField: { $exists: false } },
       { $set: { newField: 'default-value' } }
     );
     
     console.log(`Updated ${result.modifiedCount} documents`);
   }
   
   migrate()
     .then(() => {
       console.log('Migration completed');
       process.exit(0);
     })
     .catch((error) => {
       console.error('Migration failed:', error);
       process.exit(1);
     });
   ```

4. **Run migration**:
   ```bash
   npx ts-node scripts/migrations/001-add-field-to-deliveries.ts
   ```

5. **Test thoroughly** before deploying to production

### Rollback Strategy

- Keep previous schema version compatible for 1-2 releases
- Implement reverse migrations if possible
- Always backup production data before running migrations

## Testing Workflows

### Manual Testing Checklist

#### Before Every PR

- [ ] **Desktop browsers**
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest, if available)

- [ ] **Mobile devices**
  - [ ] Chrome mobile emulator (iPhone 12, Galaxy S21)
  - [ ] Actual device testing (recommended)
  - [ ] Portrait and landscape orientations

- [ ] **Language testing** (test at least 3)
  - [ ] English (en) - base language
  - [ ] One European language (cs, de, es, fr, it, pl, pt)
  - [ ] One RTL language (ar) - if UI changes
  - [ ] One Asian language (zh, vi)

- [ ] **User flows**
  - [ ] Customer request delivery (no login)
  - [ ] Track delivery by tracking ID
  - [ ] Courier registration & login
  - [ ] Courier accept & update delivery
  - [ ] Rating submission

#### Language-Specific Testing

```bash
# Test each locale
npm run dev

# Visit different locales:
# http://localhost:3000/en/
# http://localhost:3000/cs/
# http://localhost:3000/ar/  # Check RTL layout
```

### Performance Testing

```bash
# Build for production
npm run build

# Check bundle size
npm run build -- --analyze  # (if configured)

# Lighthouse audit
# Use Chrome DevTools > Lighthouse
# Test on mobile and desktop
```

### TypeScript & Lint Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Internationalization Workflow

### Adding New Translation Keys

1. **Add to English base** (`messages/en.json`):
   ```json
   {
     "newFeature": {
       "title": "New Feature",
       "description": "This is a new feature"
     }
   }
   ```

2. **Add to all other languages**:
   ```bash
   # Script to add placeholder translations
   node scripts/add-translation-key.js "newFeature.title" "New Feature"
   ```

   Or manually add to each `messages/*.json` file.

3. **Create translation issue** for non-English keys:
   - Use translation issue template
   - List all languages needing translation
   - Provide context for translators

4. **Use in code**:
   ```typescript
   const t = useTranslations();
   return <h1>{t('newFeature.title')}</h1>;
   ```

### Translation Verification Script

Run before committing translation changes:

```bash
# Check for missing keys
node scripts/verify-translations.js
```

Create `scripts/verify-translations.js`:
```javascript
const fs = require('fs');
const path = require('path');

const locales = ['en', 'cs', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'ru', 'tr', 'uk', 'vi', 'ar', 'zh'];

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const enKeyList = getAllKeys(enKeys);

console.log(`Base English keys: ${enKeyList.length}`);

for (const locale of locales.filter(l => l !== 'en')) {
  const localeKeys = JSON.parse(fs.readFileSync(`messages/${locale}.json`, 'utf8'));
  const localeKeyList = getAllKeys(localeKeys);
  const missing = enKeyList.filter(k => !localeKeyList.includes(k));
  
  if (missing.length > 0) {
    console.log(`\n❌ ${locale}: Missing ${missing.length} keys:`);
    missing.forEach(key => console.log(`   - ${key}`));
  } else {
    console.log(`✅ ${locale}: All keys present`);
  }
}
```

### Adding New Language

1. **Add to `lib/languages.ts`**:
   ```typescript
   {
     code: 'ja',
     name: 'Japanese',
     nativeName: '日本語',
     flag: '🇯🇵',
     rtl: false,
     culturalTheme: {
       primary: '#BC002D',
       secondary: '#FFFFFF',
       accent: '#BC002D',
       gradient: 'from-red-700 via-white to-red-700',
       pattern: 'sakura',
       description: 'Elegant Japanese aesthetic with sakura patterns'
     }
   }
   ```

2. **Create translation file**:
   ```bash
   cp messages/en.json messages/ja.json
   ```

3. **Update middleware** (if needed):
   ```typescript
   // middleware.ts - matcher will auto-update from languages.ts
   ```

4. **Translate content** or create translation issues

5. **Test the new locale**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/ja/
   ```

## Feature Development

### Standard Feature Flow

1. **Create feature branch**:
   ```bash
   git checkout -b feature/my-feature-name
   ```

2. **Implement feature**:
   - Start with mobile layout
   - Add translations
   - Test with multiple languages
   - Follow TypeScript best practices

3. **Test thoroughly**:
   - Manual testing (see checklist above)
   - TypeScript check
   - Lint
   - Build test

4. **Commit with clear messages**:
   ```bash
   git add .
   git commit -m "feat: Add delivery scheduling feature"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/my-feature-name
   # Create PR on GitHub using the template
   ```

6. **Address review feedback**

7. **Merge to main** (after approval)

### Feature Flags (Optional)

For large features, consider feature flags:

```typescript
// lib/feature-flags.ts
export const FEATURE_FLAGS = {
  DELIVERY_SCHEDULING: process.env.NEXT_PUBLIC_FEATURE_DELIVERY_SCHEDULING === 'true',
};

// Use in components
import { FEATURE_FLAGS } from '@/lib/feature-flags';

if (FEATURE_FLAGS.DELIVERY_SCHEDULING) {
  // Show new feature
}
```

## Hotfix Workflow

For critical production bugs:

1. **Create hotfix branch from main**:
   ```bash
   git checkout main
   git pull
   git checkout -b hotfix/critical-bug-fix
   ```

2. **Fix the bug** (minimal changes)

3. **Test thoroughly**

4. **Create PR with "hotfix" label**

5. **Fast-track review**

6. **Merge and deploy immediately**

7. **Notify team**

## Environment Management

### Local Development

```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/courier-connect
JWT_SECRET=local-dev-secret-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Staging/Production

- Use Vercel environment variables
- Never commit secrets
- Rotate secrets regularly
- Use different databases for staging/production

## Debugging Tips

### Server-Side Debugging

```typescript
// In API routes or server components
console.log('Debug:', { variable });

// Check Vercel logs or terminal output
```

### Client-Side Debugging

```typescript
// Use React DevTools
console.log('Client debug:', data);

// Check browser console
```

### Database Debugging

```bash
# Connect to MongoDB
mongosh "your-mongodb-uri"

# Check collections
use courier-connect
db.deliveryrequests.find().limit(5)
db.users.find().limit(5)
```

### Translation Debugging

```typescript
// Check which key is being used
const t = useTranslations();
console.log('Translation key:', 'home.hero.title');
console.log('Translation value:', t('home.hero.title'));
```

## Common Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run type-check       # TypeScript validation
npm run lint             # ESLint check
npm run lint -- --fix    # Auto-fix lint issues

# Database
mongosh "mongodb-uri"    # Connect to MongoDB
npm run migrate          # Run migrations (if configured)

# Git
git status               # Check status
git add .                # Stage all changes
git commit -m "msg"      # Commit with message
git push                 # Push to remote
git pull                 # Pull latest changes
```

---

**Need help?** Open a [Discussion](https://github.com/Hostilian/courier-connect/discussions) or check the [Contributing Guidelines](CONTRIBUTING.md).
