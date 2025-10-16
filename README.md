# Courier Connect 🚀




Local delivery platform connecting customers with couriers.

## Features
- Customer delivery requests with tracking
- Courier dashboard and delivery management
- Email verification and password reset
- Customer ratings system
- Google Maps integration (address autocomplete + route preview)
- Stripe payment processing
- Multi-language support (14+ languages)
- Mobile-responsive design

## What is Courier Connect?
Connect with friendly local couriers for quick pickups and deliveries. Built for real people, real connections.
- Customers can request pickups without signing up
- Couriers can earn money helping their community
- Everyone enjoys fast, friendly, local service

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Quick Setup
```bash
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

Visit http://localhost:3000



### Required Environment Variables
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```



## Tech Stack
- Next.js 14 (App Router)
- MongoDB + Mongoose
- TypeScript
- Tailwind CSS + Framer Motion
- Resend (email)
- Google Maps API
- Stripe

### For Customers 🙋
- ✅ No registration required
- 📦 Simple pickup requests
- 📱 Real-time tracking
- 💰 Fair, transparent pricing

### For Couriers 🚴
- 💼 Flexible schedule
- 📍 Choose your deliveries
- 💳 Secure payments
- ⭐ Build your reputation



## License

MIT License - see LICENSE file for details

### Deployment

We recommend deploying to [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repo in Vercel
3. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Random 64-character secret

## Technology

Built with modern, reliable tools:

- **Next.js 14** - Fast, modern React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Beautiful, responsive design
- **MongoDB** - Flexible data storage
- **JWT** - Secure authentication

## Contributing

We welcome contributions! Keep changes user-focused and avoid adding technical complexity to the core experience.

## License

MIT License - see LICENSE file for details

---

Made with ❤️ for communities everywhere
