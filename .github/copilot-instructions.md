# Courier Connect - AI Agent Instructions

## Project Overview

Courier Connect is a **peer-to-peer local delivery platform** connecting customers with couriers. Core principle: **Customers need NO registration** - they simply request delivery. Only couriers register for verification.

**Critical**: This is a **business-focused platform**, not a technical showcase. Avoid API jargon, GitHub terminology, or technical complexity in user-facing content. Keep it simple: "Courier Connect" - we connect couriers with customers.

## Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Internationalization**: next-intl (14+ languages, locale-prefixed routes `/[locale]/path`)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based (couriers only) via `jose` library
- **Styling**: Tailwind CSS with Framer Motion animations
- **Payments**: Stripe integration (optional for MVP)
- **Maps**: Google Maps API (optional for MVP)
- **Email**: Resend API for notifications

## Key Architectural Patterns

### 1. Multilingual with Cultural Theming

**Every language has its own cultural theme** defined in `lib/languages.ts`:

```typescript
// Each language has unique colors, gradients, patterns
culturalTheme: {
  primary: '#FBBF24',
  secondary: '#FF6B6B', 
  accent: '#3B82F6',
  gradient: 'from-yellow-400 via-orange-300 to-red-400',
  pattern: 'geometric',  // geometric, flamenco, art-nouveau, etc.
  description: 'Warm and professional...'
}
```

- **14+ languages** supported (en, cs, de, es, fr, it, pl, pt, ru, tr, uk, vi, ar, zh)
- **RTL support** for Arabic and Hebrew languages
- Themes are applied dynamically via `getLocaleTheme(locale)` 
- Pattern overlays adapt to cultural context (floral, waves, geometric, etc.)

### 2. Location-Aware Service Areas

Users select their **country and optionally city** via `LocationProvider` context:
- Auto-detection using browser geolocation + reverse geocoding
- Manual selection via `LocationSelector` dropdown
- Stored in localStorage (`cc_location_v1`)
- Displayed prominently: "Local couriers in Prague" or "Serving Czech Republic"
- **All EU countries, North & South America** are supported service areas

Country data is comprehensive in `lib/countries.ts` - use it for validation and display.

### 3. Two-User-Type Flow

**Customers** (no registration):
1. Land on homepage, select language + location
2. Click "Request Delivery" → fill form (sender, receiver, package details)
3. Get tracking ID → track delivery
4. Rate courier after delivery

**Couriers** (registration required):
1. Register via `/courier/register` with email verification
2. Dashboard shows available deliveries filtered by their location
3. Accept delivery → update status (picked_up, in_transit, delivered)
4. Build reputation via ratings

### 4. Delivery Lifecycle

Status flow: `pending` → `accepted` → `picked_up` → `in_transit` → `delivered` / `cancelled`

- **Tracking ID format**: `CC-XXXXXX` (6 random alphanumeric)
- **Pricing**: Based on urgency (standard: $5, express: $10, urgent: $20)
- **Models**: `DeliveryRequest`, `User`, `Rating` in `models/`

### 5. Route Structure

```
/[locale]/                 → Homepage (public)
/[locale]/request          → Customer delivery request (public, no auth)
/[locale]/track            → Track delivery by ID (public)
/[locale]/courier/register → Courier registration
/[locale]/courier/login    → Courier login
/[locale]/courier/dashboard → Courier dashboard (protected)
```

**Middleware** (`middleware.ts`) handles locale routing automatically - all routes are prefixed with locale.

### 6. Database Connection

Uses singleton pattern in `lib/mongodb.ts`:
- Cached connection in global scope (required for serverless)
- **Always** call `await dbConnect()` before DB operations in API routes
- Models use Mongoose schemas with timestamps

## Critical Development Workflows

### Running the App

```bash
npm run dev       # Development server (localhost:3000)
npm run build     # Production build
npm run start     # Production server
npm run type-check # TypeScript validation
```

**First run**: Copy `.env.example` → `.env.local` and configure:
- `MONGODB_URI` - Required for DB
- `JWT_SECRET` - Required for auth
- `NEXT_PUBLIC_APP_URL` - App URL
- Optional: Stripe, Google Maps, Resend API keys

### Testing Multilingual Content

1. Add translations to `messages/[locale].json` (use English `messages/en.json` as template)
2. Access via `useTranslations()` hook: `t('home.hero.title')`
3. **Fallback**: Missing keys automatically fall back to English
4. Test at `http://localhost:3000/[locale]/page` (e.g., `/cs/`, `/uk/`, `/tr/`)

### Adding New Languages

1. Add language config to `lib/languages.ts` (code, flag, theme)
2. Create `messages/[code].json` translation file
3. Update `middleware.ts` matcher pattern if needed
4. Locale will auto-populate in `i18n.ts` from languages array

### Mobile-First Responsive Design

- **Always design mobile-first**: Start with mobile layout, add `md:` and `lg:` breakpoints
- Use Framer Motion for smooth animations
- Test on Chrome mobile emulator
- PWA-ready: `manifest.json` configured

## Common Patterns & Conventions

### API Routes

**Standard API route pattern:**

```typescript
// app/api/example/route.ts
import dbConnect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';

// GET request
export async function GET(request: NextRequest) {
  try {
    await dbConnect(); // Always connect first
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    const data = await Model.findById(id);
    
    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST request
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate input
    if (!body.requiredField) {
      return NextResponse.json(
        { error: 'Missing required field' },
        { status: 400 }
      );
    }
    
    const result = await Model.create(body);
    
    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
```

**Protected API route (courier only):**

```typescript
import { getAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { user } = await getAuth(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Continue with authenticated logic
  // user.userId is available
}
```

### Protected Routes (Courier Only)

Use `withAuth` HOC from `components/withAuth.tsx`:

```typescript
// app/[locale]/courier/dashboard/page.tsx
'use client';

import withAuth from '@/components/withAuth';

function CourierDashboard() {
  // Component code - only accessible to authenticated couriers
  return <div>Dashboard content</div>;
}

export default withAuth(CourierDashboard);
```

### Creating New Pages

**Public page example:**

```typescript
// app/[locale]/about/page.tsx
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// Metadata (server-side)
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

// Page component (server component by default)
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold">About Us</h1>
      {/* Content */}
    </div>
  );
}
```

**Client interactive page:**

```typescript
// app/[locale]/request/page.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function RequestPage() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        router.push(`/track?id=${data.trackingId}`);
      } else {
        alert(t('errors.requestFailed'));
      }
    } catch (error) {
      alert(t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? t('common.loading') : t('request.submit')}
      </button>
    </form>
  );
}
```

### Component Organization

- **Client components**: Use `"use client"` directive (forms, interactive UI)
- **Server components**: Default (static pages, layouts)
- **Shared components**: `components/` directory
- **Page-specific logic**: Keep in page component or extract to `/lib/hooks/`

**Example client component with translations:**

```typescript
// components/DeliveryCard.tsx
'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

interface DeliveryCardProps {
  trackingId: string;
  status: string;
  urgency: string;
}

export default function DeliveryCard({ trackingId, status, urgency }: DeliveryCardProps) {
  const t = useTranslations('delivery');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 md:p-6"
    >
      <div className="flex items-center gap-3">
        <Package className="w-6 h-6 text-blue-600" />
        <div>
          <p className="font-semibold">{trackingId}</p>
          <p className="text-sm text-gray-600">
            {t(`status.${status}`)} • {t(`urgency.${urgency}`)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
```

**Example server component:**

```typescript
// app/[locale]/about/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function AboutPage({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'about' });
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>
      <p className="text-lg text-gray-700">{t('description')}</p>
    </div>
  );
}
```

### State Management

- **Global location**: `LocationProvider` context (country, city, coordinates)
- **Auth state**: JWT in localStorage + `useAuth` hook
- **Form state**: React Hook Form (see `lib/hooks/useCourierRegistrationForm.ts`)
- **Toast notifications**: `react-hot-toast`

**Using LocationProvider:**

```typescript
'use client';

import { useLocationContext } from '@/components/LocationProvider';
import { getCountryByCode } from '@/lib/countries';

export default function MyComponent() {
  const { location, setLocation, detectLocation } = useLocationContext();
  
  const country = location.countryCode 
    ? getCountryByCode(location.countryCode) 
    : null;
  
  return (
    <div>
      <p>Current location: {location.city || country?.name || 'Not set'}</p>
      <button onClick={detectLocation}>Detect My Location</button>
    </div>
  );
}
```

**Using translations with dynamic values:**

```typescript
import { useTranslations } from 'next-intl';

function DeliveryStatus({ trackingId, estimatedTime }) {
  const t = useTranslations();
  
  return (
    <p>
      {t('delivery.trackingMessage', {
        id: trackingId,
        time: estimatedTime
      })}
    </p>
  );
}

// In messages/en.json:
// "delivery": {
//   "trackingMessage": "Tracking ID: {id} - ETA: {time}"
// }
```

**Using toast notifications:**

```typescript
import toast from 'react-hot-toast';

async function handleSubmit() {
  try {
    await submitDelivery();
    toast.success(t('delivery.successMessage'));
  } catch (error) {
    toast.error(t('delivery.errorMessage'));
  }
}
```

## Critical "Gotchas"

1. **Locale must always be in path** - middleware enforces `/[locale]/` prefix
2. **MongoDB connection must be cached** - serverless requires global singleton pattern  
3. **RTL languages need special CSS** - check `language.rtl` flag and apply `dir="rtl"`
4. **Cultural themes are visual identity** - don't use generic colors, use theme from `lib/languages.ts`
5. **Customers = no auth required** - never add auth walls to request/track flows
6. **Tracking IDs are public** - anyone with ID can track (by design)

## Deployment (Vercel)

- Push to GitHub (Hostilian/courier-connect repo)
- Import in Vercel, add environment variables
- Custom domain: `hostilian.org`
- Configure Stripe webhook: `https://hostilian.org/api/stripe/webhook`

## Quality Standards

- **User experience first**: Simple, clear, no jargon
- **Mobile-optimized**: Touch-friendly, fast loading
- **Culturally respectful**: Themes honor each language's culture
- **Accessible**: Semantic HTML, proper ARIA labels
- **Type-safe**: No `any` types, leverage TypeScript fully
- **Performant**: Optimize images, lazy load components

## File Lookup Quick Reference

- Translations: `messages/[locale].json`
- Language config: `lib/languages.ts`
- Country data: `lib/countries.ts`
- DB models: `models/`
- API routes: `app/api/`
- Client components: `components/`
- Auth logic: `lib/auth.ts`
- Email templates: `lib/email.ts`
- Validation schemas: `lib/validation.ts`

## Complete Code Examples

### Example 1: Creating a New API Endpoint

```typescript
// app/api/deliveries/stats/route.ts
import dbConnect from '@/lib/mongodb';
import { getAuth } from '@/lib/auth';
import DeliveryRequest from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/deliveries/stats - Get delivery statistics
export async function GET(request: NextRequest) {
  try {
    // Authenticate courier
    const { user } = await getAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30d';

    // Calculate date range
    const daysAgo = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Aggregate statistics
    const stats = await DeliveryRequest.aggregate([
      {
        $match: {
          courierId: user.userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$price' }
        }
      }
    ]);

    return NextResponse.json({ 
      stats,
      period,
      courierId: user.userId
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
```

### Example 2: Creating a New Multilingual Page

```typescript
// app/[locale]/services/page.tsx
'use client';

import { useTranslations, useLocale } from 'next-intl';
import { getLocaleTheme } from '@/lib/languages';
import { motion } from 'framer-motion';
import { Truck, Clock, Shield, DollarSign } from 'lucide-react';

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();
  const theme = getLocaleTheme(locale);

  const services = [
    {
      icon: Truck,
      titleKey: 'delivery.title',
      descKey: 'delivery.description',
    },
    {
      icon: Clock,
      titleKey: 'express.title',
      descKey: 'express.description',
    },
    {
      icon: Shield,
      titleKey: 'secure.title',
      descKey: 'secure.description',
    },
    {
      icon: DollarSign,
      titleKey: 'affordable.title',
      descKey: 'affordable.description',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.titleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              style={{
                borderTop: `4px solid ${theme.primary}`,
              }}
            >
              <service.icon 
                className="w-12 h-12 mb-4" 
                style={{ color: theme.primary }}
              />
              <h3 className="text-xl font-semibold mb-2">
                {t(service.titleKey)}
              </h3>
              <p className="text-gray-600">
                {t(service.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Don't forget to add translations to messages/en.json:
// "services": {
//   "hero": {
//     "title": "Our Services",
//     "subtitle": "Fast, reliable, and affordable delivery solutions"
//   },
//   "delivery": {
//     "title": "Local Delivery",
//     "description": "Quick delivery within your city"
//   },
//   ...
// }
```

### Example 3: Creating a Form with Validation

```typescript
// components/CourierApplicationForm.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';

// Validation schema
const applicationSchema = z.object({
  fullName: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone'),
  vehicleType: z.enum(['bike', 'car', 'motorcycle', 'van']),
  licenseNumber: z.string().min(5, 'Invalid license'),
  city: z.string().min(2, 'City required'),
});

type ApplicationData = z.infer<typeof applicationSchema>;

export default function CourierApplicationForm() {
  const t = useTranslations('courier.application');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    email: '',
    phone: '',
    vehicleType: 'bike',
    licenseNumber: '',
    city: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = applicationSchema.parse(formData);

      // Submit to API
      const res = await fetch('/api/courier/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t('success'));
        router.push('/courier/dashboard');
      } else {
        toast.error(data.error || t('error'));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error(t('validationError'));
      } else {
        toast.error(t('networkError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{t('title')}</h2>

      {/* Full Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {t('fields.fullName')}
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.fullName ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {t('fields.email')}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Vehicle Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {t('fields.vehicleType')}
        </label>
        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="bike">{t('vehicles.bike')}</option>
          <option value="motorcycle">{t('vehicles.motorcycle')}</option>
          <option value="car">{t('vehicles.car')}</option>
          <option value="van">{t('vehicles.van')}</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
```

### Example 4: Database Model with Hooks

```typescript
// models/Notification.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'delivery_update' | 'new_delivery' | 'rating_received' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['delivery_update', 'new_delivery', 'rating_received', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// Virtual for time ago
NotificationSchema.virtual('timeAgo').get(function () {
  const seconds = Math.floor((Date.now() - this.createdAt.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
});

// Pre-save hook
NotificationSchema.pre('save', function (next) {
  // Add any pre-save logic here
  next();
});

// Static methods
NotificationSchema.statics.markAsRead = async function (
  userId: string,
  notificationIds: string[]
) {
  return this.updateMany(
    {
      _id: { $in: notificationIds },
      userId,
    },
    { $set: { read: true } }
  );
};

NotificationSchema.statics.getUnreadCount = async function (userId: string) {
  return this.countDocuments({ userId, read: false });
};

// Instance methods
NotificationSchema.methods.markAsRead = async function () {
  this.read = true;
  return this.save();
};

export default mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);
```

---

**Remember**: Keep it simple. Courier Connect is about **connecting people**, not showcasing technology. User-facing content should be warm, friendly, and free of technical jargon.
