# Courier Connect 🚀

> Neighbors helping neighbors with local deliveries

Connect with friendly local couriers for quick pickups and deliveries. Built for real people, real connections.

## What is Courier Connect?

A simple, mobile-first platform where:

- **Customers** can request pickups without signing up
- **Couriers** can earn money helping their community
- Everyone enjoys fast, friendly, local service

Perfect for envelopes, gifts, or marketplace items you can't pick up yourself.

## Features

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

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://mongodb.com/cloud/atlas))

### Quick Setup

```bash
# Clone and install
git clone https://github.com/Hostilian/courier-connect.git
cd courier-connect
npm install

# Configure environment
cp .env.example .env.local
# Add your MONGODB_URI and JWT_SECRET

# Run development server
npm run dev
```

Visit http://localhost:3000

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
