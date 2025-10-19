<div align="center">
  <a href="https://hostilian.org" target="_blank">
    <img src="https://hostilian.org/images/courier-connect-logo.svg" alt="Courier Connect Logo" width="120" height="120">
  </a>
  <h1 align="center">Courier Connect</h1>
  <p align="center">
    <strong>Peer-to-Peer Local Delivery Platform</strong>
    <br />
    Connecting customers with local couriers. No registration needed for customers.
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

## ✨ Features

- **Customer-Friendly**: No registration required for delivery requests.
- **Courier Network**: Verified couriers can register and accept local jobs.
- **Real-Time Tracking**: Live map tracking for all deliveries.
- **Multilingual**: Supports 14+ languages with cultural theming.
- **Location-Aware**: Service areas across EU, North & South America.
- **Secure Payments**: Stripe integration for online payments.

## 🚀 Quick Start

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
    ```bash
    cp .env.example .env.local
    ```
    - `MONGODB_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A secret key for signing JWTs.
    - `NEXT_PUBLIC_APP_URL`: The public URL of your application (e.g., `http://localhost:3000`).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with `jose`
- **Styling**: Tailwind CSS & Framer Motion
- **Internationalization**: `next-intl`
- **Payments**: Stripe
- **Maps**: Google Maps API
- **Email**: Resend

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

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) to get started.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
