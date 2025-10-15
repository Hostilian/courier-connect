# Courier Connect 🚀

> **Neighbors helping neighbors with local deliveries**

A warm, community-focused platform that connects people who need items delivered with friendly local couriers. Built with care for mobile-first experiences and genuine human connections.

## 💙 What Makes Us Special

Courier Connect isn't just another delivery app—it's about bringing communities together:

-   **For Customers**: No account needed! Just request help and track your delivery.
-   **For Couriers**: Earn money helping your neighbors while staying flexible.
-   **For Everyone**: Real people, real connections, and a service that just works.

## ✨ Core Features

### 🙋 For People Who Need Help
- 📦 Quick delivery requests—no sign-up hassles
- 🗺️ Simple pickup and delivery locations
- 💰 Fair, transparent pricing
- 📱 Real-time tracking with a friendly tracking ID
- 🎯 Perfect for envelopes, gifts, or marketplace pickups

### 🤝 For Couriers (Our Community Heroes)
- 💼 Flexible earning on your schedule
- 📍 Choose deliveries that work for you
- 💳 Secure payment system
- ⭐ Build your reputation helping others
- 🔐 Safe and verified platform

## 🛠 Technology Stack

Built with modern, reliable tools:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router) for fast, seamless experiences
-   **Language**: [TypeScript](https://www.typescriptlang.org/) for reliability
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for beautiful, responsive design
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Authentication**: Secure JWT-based system
-   **Validation**: [Zod](https://zod.dev/) for data safety

## 🚀 Getting Started

### What You'll Need

-   Node.js (v18 or newer)
-   npm or yarn
-   MongoDB (local or cloud—we recommend [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Quick Setup

1.  **Clone the project:**
    ```bash
    git clone https://github.com/Hostilian/courier-connect.git
    cd courier-connect
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment:**
    
    Copy the example file:
    ```bash
    copy .env.example .env.local
    ```
    
    Update `.env.local` with your own values:
    ```env
    # Your MongoDB connection string
    MONGODB_URI=mongodb://localhost:27017/courier-connect
    
    # A strong secret for JWT tokens (generate with: openssl rand -base64 32)
    JWT_SECRET=your-secret-here
    
    # Optional: Google Maps for enhanced location features
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
    ```

4.  **Start the app:**
    ```bash
    npm run dev
    ```
    
    Open [http://localhost:3000](http://localhost:3000) and see it in action! 🎉

## 📱 Mobile-First Design

We built this with phones in mind because that's how most people will use it:

-   📱 Smooth on all smartphones (iOS & Android)
-   🖥️ Beautiful on tablets and desktops too
-   ⚡ Fast loading and responsive
-   👆 Touch-friendly interface

## 📂 Project Structure

```
app/              → Pages and API routes (Next.js App Router)
components/       → Reusable React components
lib/              → Helper functions (database, auth, etc.)
models/           → Database schemas (User, DeliveryRequest)
public/           → Static files and assets
pages/api/auth/   → Authentication endpoints
```

## 🤝 Contributing

We'd love your help making Courier Connect even better! Feel free to:

-   🐛 Report bugs
-   💡 Suggest new features
-   🔧 Submit pull requests
-   ⭐ Star the repo if you like it!

## 📝 Available Commands

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Run production build
npm run lint    # Check code quality
```

## 💖 Built With Love

Created with care to help communities connect and support each other. Every line of code was written thinking about the real people who will use this.

---

**Questions or feedback?** We'd love to hear from you! Open an issue or reach out.

## 📧 Contact
For questions or support, please open an issue.

---

**Built with ❤️ for the community**
