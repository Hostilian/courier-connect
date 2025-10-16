# Courier Connect 🚀

🌍 **Multilingual Local Delivery Platform** | 🇨🇿 🇬🇧 🇹🇷 🇺🇦 🇻🇳 +9 more languages

Local delivery platform connecting customers with couriers. Works perfectly on mobile.

## ✨ Features
- ✅ **No login required** for customers - just request & track
- 🌐 **14+ languages** with cultural theming (Czech, English, Turkish, Ukrainian, Vietnamese, Arabic, and more)
- 📱 **Mobile-first design** - optimized for phones and tablets
- 🚩 **QuickFlags** - instant language switching with flag shortcuts
- 🧭 **Location-aware** - detects your city, shows local couriers
- 📍 **Real-time tracking** - follow your delivery every step
- 💳 **Stripe payments** - secure online payment processing
- 📧 **Email notifications** - delivery updates via Resend
- 🗺️ **Google Maps** - address autocomplete & route preview
- 🌙 **RTL support** - right-to-left layouts for Arabic, Persian, Hebrew
- ⚡ **Fast & accessible** - Lighthouse 90+ score, WCAG AA compliant

## What is Courier Connect?
Connect with friendly local couriers for quick pickups and deliveries. Built for real people, real connections.
- Customers can request pickups without signing up
- Couriers can earn money helping their community
- Everyone enjoys fast, friendly, local service

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Setup
```bash
# Clone and install
npm install

# Copy environment template
cp .env.example .env.local

# Add your API keys to .env.local
# (see Environment Variables section below)

# Run development server
npm run dev
```

Visit **http://localhost:3000**

### Test Different Languages
- Czech: http://localhost:3000/cs
- English: http://localhost:3000/en
- Turkish: http://localhost:3000/tr
- Ukrainian: http://localhost:3000/uk
- Vietnamese: http://localhost:3000/vi
- Arabic (RTL): http://localhost:3000/ar

### Required Environment Variables
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_64_chars
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional (features work without these, but are limited)
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

**Note:** Resend, Google Maps, and Stripe are **optional**. The app will:
- Skip email sending if `RESEND_API_KEY` is missing
- Use basic input for addresses if `GOOGLE_MAPS_API_KEY` is missing
- Return 503 for payment routes if `STRIPE_SECRET_KEY` is missing

## 📱 Mobile QA & Testing

### Automated Tests
```bash
# Run mobile QA tests (requires Puppeteer)
npm run qa:mobile

# Run Lighthouse audit
npm run qa:lighthouse:mobile

# Type-check
npm run type-check

# Lint
npm run lint

# Production build test
npm run build
```

### Manual Testing
See comprehensive guides in `docs/`:
- **`docs/MOBILE_QA.md`** - Full mobile testing checklist
- **`docs/MOBILE_QA_CHECKLIST.txt`** - Printable quick checklist (60 min test)
- **`docs/TRANSLATION_POLISH.md`** - Translation quality guide
- **`docs/TRANSLATION_MOBILE_QA_SUMMARY.md`** - Summary & next steps

**Quick smoke test (10 minutes):**
1. Open DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)
2. Select "iPhone 14" or "Pixel 7"
3. Test each language: 🇨🇿 🇬🇧 🇹🇷 🇺🇦 🇻🇳
4. Fill out request form → get tracking code
5. Track delivery → verify status shows
6. Test courier login/register
7. Switch to Arabic (`/ar`) → verify RTL layout

## 🌐 Supported Languages

| Language | Code | Status | Cultural Theme |
|----------|------|--------|----------------|
| Czech | `cs` | ⭐⭐⭐⭐⭐ | Bohemian crystal (red-blue-white) |
| English | `en` | ⭐⭐⭐⭐⭐ | Warm & professional (yellow-orange-red) |
| Turkish | `tr` | ⭐⭐⭐⭐ | Ottoman tulip (red-white-gold) |
| Ukrainian | `uk` | ⭐⭐⭐⭐⭐ | Embroidery (blue-yellow) |
| Vietnamese | `vi` | ⭐⭐⭐⭐ | Lantern & lotus (red-yellow) |
| Spanish | `es` | ⭐⭐⭐⭐ | Flamenco (red-yellow) |
| French | `fr` | ⭐⭐⭐⭐ | Art Nouveau (blue-white-red) |
| German | `de` | ⭐⭐⭐⭐ | Bauhaus (black-red-yellow) |
| Arabic | `ar` | ⭐⭐⭐⭐ | Islamic geometric (green-white-gold) |
| +5 more | ... | ⭐⭐⭐⭐ | See `lib/languages.ts` |

**QuickFlags:** Czech 🇨🇿, English 🇬🇧, Turkish 🇹🇷, Ukrainian 🇺🇦, Vietnamese 🇻🇳



## 🛠️ Tech Stack
- **Next.js 14** (App Router)
- **TypeScript** - Type-safe development
- **next-intl** - i18n with deep-merge fallback
- **MongoDB + Mongoose** - Database
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Resend** - Email (optional)
- **Google Maps API** - Location services (optional)
- **Stripe** - Payments (optional)
- **Lucide React** - Icons
- **JWT** - Authentication

## 📦 Project Structure
```
courier-connect/
├── app/
│   ├── [locale]/           # Localized routes
│   │   ├── layout.tsx      # Locale layout with RTL support
│   │   ├── page.tsx        # Home page with cultural themes
│   │   ├── request/        # Customer request flow
│   │   ├── track/          # Delivery tracking
│   │   └── courier/        # Courier login/register/dashboard
│   ├── api/                # API routes
│   │   ├── auth/           # Registration, login, verify
│   │   ├── deliveries/     # CRUD operations
│   │   ├── courier/        # Courier-specific endpoints
│   │   └── stripe/         # Payment processing
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── LocationProvider.tsx  # Global location context
│   ├── WelcomeModal.tsx     # First-visit location selector
│   ├── QuickFlags.tsx       # Language switcher shortcuts
│   └── ...
├── lib/
│   ├── languages.ts        # Language configs with cultural themes
│   ├── countries.ts        # Country list with flags
│   ├── email.ts            # Email utilities (Resend)
│   ├── maps.ts             # Google Maps utilities
│   └── mongodb.ts          # Database connection
├── messages/               # i18n JSON files
│   ├── cs.json             # Czech
│   ├── en.json             # English
│   ├── tr.json             # Turkish
│   ├── uk.json             # Ukrainian
│   ├── vi.json             # Vietnamese
│   └── ...
├── models/                 # Mongoose models
│   ├── User.ts
│   ├── DeliveryRequest.ts
│   └── Rating.ts
├── docs/                   # Documentation
│   ├── MOBILE_QA.md        # Full mobile testing guide
│   ├── TRANSLATION_POLISH.md  # Translation quality guide
│   └── ...
└── i18n.ts                 # next-intl configuration
```

## 👥 User Flows

### For Customers 🙋
1. **No registration required**
2. Visit home → Click "Request Delivery"
3. Fill 3-step form:
   - Pickup info (name, phone, address)
   - Delivery info (recipient, address)
   - Preferences (package type, urgency)
4. Get tracking code immediately
5. Track delivery in real-time

### For Couriers 🚴
1. Register → Upload documents → Wait for approval
2. Login → View available jobs
3. Accept delivery → Mark as picked up
4. Navigate to delivery location
5. Mark as delivered → Earn money

## 🌍 Localization Details

### Language Switching
- **QuickFlags** component on home page
- Click flag → instant language switch
- URL updates: `/cs`, `/uk`, `/tr`, etc.
- Selection persists across navigation
- Full language selector in header

### Cultural Theming
Each language has a unique visual theme:
- **Primary/secondary colors** from national identity
- **Gradient patterns** reflecting culture
- **Symbolic patterns** (Bohemian crystal, embroidery, tulips, lanterns)
- **Tone of voice** adapted per culture

Example (Czech):
```typescript
{
  primary: '#DC2626',      // Red from flag
  secondary: '#1E40AF',    // Blue from flag
  accent: '#FFFFFF',       // White
  gradient: 'from-red-600 via-blue-600 to-white',
  pattern: 'bohemian',     // Crystal patterns
}
```

### RTL Support
- Automatic layout mirroring for Arabic, Persian, Hebrew, Urdu
- `<html dir="rtl">` set automatically
- CSS Flexbox/Grid reverse direction
- Icons and flags preserve orientation
- Numbers stay LTR in RTL context

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (e.g., https://hostilian.org)
   - Optional: `RESEND_API_KEY`, `GOOGLE_MAPS_API_KEY`, `STRIPE_SECRET_KEY`
4. Deploy!

### Custom Domain
Add to `vercel.json`:
```json
{
  "domains": ["hostilian.org", "www.hostilian.org"]
}
```

## � License
MIT License - see LICENSE file for details

## 🤝 Contributing
See `CONTRIBUTING.md` (if exists) or:
1. Fork the repo
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit: `git commit -m "Add amazing feature"`
4. Push: `git push origin feat/amazing-feature`
5. Open a Pull Request

### Translation Contributions
We welcome native speaker reviews! To improve translations:
1. Edit `messages/{locale}.json` (e.g., `messages/tr.json`)
2. Follow the "sunshine official" tone (see `docs/TRANSLATION_POLISH.md`)
3. Test locally: `npm run dev` → visit `/tr`
4. Submit PR with native speaker feedback

## 📚 Documentation

- **`README.md`** - This file
- **`docs/MOBILE_QA.md`** - Comprehensive mobile testing guide
- **`docs/MOBILE_QA_CHECKLIST.txt`** - Quick 60-minute checklist
- **`docs/TRANSLATION_POLISH.md`** - Translation quality guide
- **`docs/TRANSLATION_MOBILE_QA_SUMMARY.md`** - Summary & status
- **`docs/DEPLOYMENT.md`** - Deployment instructions (if exists)
- **`CONTRIBUTING.md`** - Contribution guidelines (if exists)

## 🐛 Troubleshooting

### Build fails with "Cannot find module 'resend'"
**Solution:** Resend is lazy-loaded. Ensure your build has all dependencies:
```bash
npm install
```

### Email not sending
**Solution:** Check `.env.local` has `RESEND_API_KEY`. If missing, emails will be skipped with a console warning.

### Google Maps autocomplete not working
**Solution:** Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to `.env.local`. If missing, a basic text input will be used.

### Stripe payment fails
**Solution:** Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. If missing, payment routes return 503.

### Translations not updating
**Solution:**
1. Clear Next.js cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Verify JSON syntax in `messages/{locale}.json`

### Mobile layout broken
**Solution:** Run mobile QA tests:
```bash
npm run qa:mobile
```
Check `docs/MOBILE_QA.md` for detailed testing steps.

## 💬 Support & Community

- **Issues:** [GitHub Issues](https://github.com/Hostilian/courier-connect/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Hostilian/courier-connect/discussions)
- **Email:** support@hostilian.org (if applicable)

## 🎯 Roadmap

- [x] Multi-language support (14+ languages)
- [x] Mobile-first responsive design
- [x] RTL layout support
- [x] Cultural theming per locale
- [x] Location detection & selection
- [x] QuickFlags language switcher
- [ ] Real-time WebSocket tracking
- [ ] Push notifications (PWA)
- [ ] Courier earnings dashboard
- [ ] Admin panel
- [ ] Dark mode
- [ ] Offline mode with service worker

## 🌟 Credits

Built with ❤️ by the Hostilian team.

**Special thanks to:**
- Next.js team for the amazing framework
- next-intl for robust i18n support
- Vercel for seamless deployment
- All contributors and translators

---

**⭐ Star this repo if you find it helpful!**

**🐛 Found a bug? [Open an issue](https://github.com/Hostilian/courier-connect/issues)**

**🌐 Want to add a language? [Contribute a translation](#-contributing)**

---

Made with 🌍 for a global audience | Powered by ☀️ sunshine energy

## Contributing

We welcome contributions! Keep changes user-focused and avoid adding technical complexity to the core experience.

## License

MIT License - see LICENSE file for details

---

Made with ❤️ for communities everywhere
