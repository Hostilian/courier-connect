# Courier Connect 🌟

**Fast. Local. Friendly.**

Courier Connect brings your community together through quick, reliable deliveries. Whether you need a package picked up, a gift delivered, or an item from the marketplace brought to your door—our local couriers are here to help.

---

## 🎯 What We Do

### For Everyone 📦
- **No registration needed** to request a delivery
- Get an **envelope, gift, or marketplace item** delivered fast
- Track your delivery in real-time
- Fair pricing, no surprises

### For Couriers 🚴
- **Earn money** helping your neighbors
- **Flexible hours**—work when you want
- Choose the deliveries that work for you
- Build your reputation in the community

---

## 🌍 Worldwide Coverage

We serve communities across:
- 🇪🇺 European Union
- 🇺🇸 North America
- 🇧🇷 South America
- And many more countries!

When you visit Courier Connect, tell us where you are and we'll match you with friendly couriers nearby.

---

## 🚀 Getting Started

### What You Need
- **Node.js** version 18 or newer
- **MongoDB** database (you can use a free MongoDB Atlas account)
- **Google Maps API key** for address lookup
- **Stripe account** for payments (optional for development)

### Quick Setup

1. **Download the code:**
   ```bash
   git clone https://github.com/Hostilian/courier-connect.git
   cd courier-connect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment:**
   - Copy `.env.example` to `.env.local`
   - Add your MongoDB connection string
   - Add your Google Maps API key
   - Add other API keys as needed

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Visit the site:**
   Open your browser to `http://localhost:3000`

---

## 🔧 Configuration

Create a file called `.env.local` in the main folder and add:

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# Security
JWT_SECRET=your_secret_key_here

# Website URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (for sending notifications)
RESEND_API_KEY=your_resend_api_key

# Maps (for addresses)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Payments (optional for development)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

---

## 📱 Works Great on Phones

Courier Connect is designed to work perfectly on your phone, tablet, or computer. Use it anywhere, anytime.

---

## 🌐 Languages We Support

Choose your language when you visit:
- 🇬🇧 English
- 🇨🇿 Czech
- 🇩🇪 German
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇮🇹 Italian
- 🇵🇱 Polish
- 🇵🇹 Portuguese
- 🇷🇺 Russian
- 🇹🇷 Turkish
- 🇺🇦 Ukrainian
- 🇻🇳 Vietnamese
- 🇸🇦 Arabic
- 🇨🇳 Chinese

Each language version looks and feels right for your culture!

---

## 🤝 Contributing

We welcome help from the community! If you'd like to contribute:
- Report issues on GitHub
- Suggest new features
- Help with translations
- Share your ideas

---

## 📄 License

This project is available under the MIT License. Feel free to use it for your community!

---

## 🌟 Built With Care

- Modern web technology for speed and reliability
- Focus on real people and real connections
- Designed for ease of use
- Made with sunshine energy ☀️

---

**Ready to get started?** Visit [hostilian.org](https://hostilian.org) or run locally following the steps above!


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
