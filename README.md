# Courier Connect

![CI](https://github.com/Hostilian/courier-connect/workflows/CI/badge.svg)
![Deploy](https://github.com/Hostilian/courier-connect/workflows/Deploy%20to%20Production/badge.svg)

**Local Delivery Platform**

Courier Connect is a multilingual delivery service platform connecting customers with local couriers. Simple, fast, and available in 14+ languages.

## Features

- ✅ No login required for customers
- 🌍 14+ languages with instant switching
- 📱 Mobile-first responsive design
- 📍 Real-time delivery tracking
- 💳 Secure Stripe payments
- 📧 Email notifications
- 🗺️ Google Maps integration
- 🌐 RTL support for Arabic and other languages

## Quick Links

- 🚀 [Contributing Guidelines](CONTRIBUTING.md)
- 📖 [Development Workflows](DEVELOPMENT.md)
- 🛠️ [DevOps Guide](DEVOPS.md)
- 📋 [Deployment Guide](DEPLOYMENT.md)
- 🤝 [Code of Conduct](CODE_OF_CONDUCT.md)
- 🤖 [AI Agent Instructions](.github/copilot-instructions.md)

## Getting Started

### Requirements

- Node.js 18+
- MongoDB database

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env.local and configure

# Start development server
npm run dev
```

Visit http://localhost:3000

## Environment Variables

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# Security
JWT_SECRET=your_jwt_secret_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email
RESEND_API_KEY=your_resend_api_key

# Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key

# Payments (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## Supported Languages

Czech, German, English, Spanish, French, Italian, Polish, Portuguese, Russian, Turkish, Ukrainian, Vietnamese, Arabic, Chinese

## How It Works

### For Customers

1. Visit website and select language
2. Enter pickup and delivery details
3. Get matched with nearby courier
4. Track delivery in real-time
5. Pay securely and rate experience

### For Couriers

1. Register with verification
2. View available delivery jobs
3. Accept deliveries and earn
4. Update status as you deliver
5. Build your reputation

## Deployment

### Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

See DEPLOYMENT.md for details.

## Technology

- Next.js 14 (App Router)
- MongoDB with Mongoose
- TypeScript
- Tailwind CSS & Framer Motion
- next-intl (14+ languages)
- Stripe (payments)
- Resend (emails)
- Google Maps API

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our [code conventions](CONTRIBUTING.md)
4. Test thoroughly (see [Development Guide](DEVELOPMENT.md))
5. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed workflows including:
- Database migrations
- Testing procedures
- Internationalization workflow
- Feature development process

## Community

- 🐛 [Report a Bug](.github/ISSUE_TEMPLATE/bug_report.yml)
- ✨ [Request a Feature](.github/ISSUE_TEMPLATE/feature_request.yml)
- 🌍 [Translation Issue](.github/ISSUE_TEMPLATE/translation_issue.yml)
- 💬 [Discussions](https://github.com/Hostilian/courier-connect/discussions)

## License

MIT License

---

**Made with ❤️ by the Courier Connect Team**

