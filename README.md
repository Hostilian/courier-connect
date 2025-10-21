
<div align="center">
  <a href="https://hostilian.org" target="_blank">
    <img src="https://hostilian.org/images/courier-connect-logo.svg" alt="Courier Connect Logo" width="120" height="120">
  </a>
  <h1 align="center">Courier Connect</h1>
  <p align="center">
    <strong>Global Peer-to-Peer Delivery Platform</strong><br />
    Connecting people who need something delivered or picked up with local, verified couriers. No registration needed for customers. Mobile-first, culturally themed, and built for everyone.
  </p>
  <p align="center">
    <a href="https://hostilian.org"><strong>hostilian.org »</strong></a>
  </p>
  <div align="center">
    <a href="https://github.com/Hostilian/courier-connect/actions/workflows/ci.yml">
      <img src="https://github.com/Hostilian/courier-connect/actions/workflows/ci.yml/badge.svg" alt="CI Status">
    </a>
    <a href="https://github.com/Hostilian/courier-connect/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/Hostilian/courier-connect" alt="License">
    </a>
    <a href="https://github.com/Hostilian/courier-connect/issues">
      <img src="https://img.shields.io/github/issues/Hostilian/courier-connect" alt="GitHub issues">
    </a>
  </div>
</div>

---

## 🚀 Why Courier Connect?

- **No customer registration:** Anyone can request a delivery instantly, no account needed.
- **Global reach:** Available in all EU, North & South American countries, and more.
- **Mobile-first:** Designed for perfect usability on phones and tablets.
- **Cultural harmony:** Each language and country gets a unique, beautiful theme and layout.
- **Courier-first earnings:** Couriers earn 70% of every delivery fee, paid out automatically.
- **Transparent pricing:** Customers see the price up front, calculated by distance, urgency, and time.
- **Location-aware:** Auto-detect or select your city/country for local service and theming.
- **Real-time tracking:** Customers and couriers see live status and location on a map.
- **Simple payments:** Stripe integration for secure, instant payments and payouts.
- **Notifications:** Email and SMS updates for every step of the delivery.

## ✨ Features

- **Customer-Friendly:** No registration required for delivery requests.
- **Courier Network:** Verified couriers can register and accept local jobs.
- **Real-Time Tracking:** Live map tracking for all deliveries.
- **Multilingual:** Supports 14+ languages with cultural theming and flag selector.
- **Location-Aware:** Service areas across EU, North & South America, and more.
- **Secure Payments:** Stripe integration for online payments and payouts.
- **Date & Time Scheduling:** Customers choose exact delivery date/time; algorithm calculates price.
- **70/30 Profit Split:** Couriers get 70% of every job, platform takes 30%.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with `jose` (couriers only)
- **Styling:** Tailwind CSS & Framer Motion
- **Internationalization:** `next-intl` (locale-prefixed routes)
- **Payments:** Stripe
- **Maps:** Google Maps API
- **Email:** Resend, Mailgun/SendGrid
- **SMS:** Twilio

## 📂 Project Structure

```
/app
  /[locale]         # Internationalized routes
  /api              # API endpoints
/components         # Shared React components
/lib                # Core logic, utilities, and configs
/messages           # Translation files
/models             # Mongoose data models
/public             # Static assets
/tests              # E2E and unit tests
```

## 🚦 Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Hostilian/courier-connect.git
    cd courier-connect
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
  Copy `.env.example` to `.env.local` and fill in the required values.
  - `MONGODB_URI`: Your MongoDB connection string.
  - `JWT_SECRET`: A secret key for signing JWTs.
  - `NEXT_PUBLIC_APP_URL`: The public URL of your application (e.g., `http://localhost:3000`).
  - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) to get started.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
