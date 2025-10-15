# Courier Connect

A modern, mobile-first platform for on-demand local deliveries.

## Project Overview

Courier Connect is a Next.js application that facilitates a two-sided marketplace for deliveries:
1.  **Customers** can quickly request a delivery without needing to register an account.
2.  **Couriers** can register, log in, and accept pending delivery jobs from their dashboard.

The application is built with a focus on user experience, performance, and mobile-first design.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Authentication**: Custom JWT-based authentication
-   **Validation**: [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   MongoDB instance (local or cloud-hosted)

### Setup

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
    Create a `.env.local` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
    Update the variables in `.env.local` with your own configuration:
    -   `MONGODB_URI`: Your MongoDB connection string.
    -   `JWT_SECRET`: A strong, unique secret for signing JWTs. You can generate one with `openssl rand -base64 32`.
    -   `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: (Optional) Your Google Maps API key for map-related features.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

## Core Features

-   **Customer Flow**: Anonymously create delivery requests through a multi-step form. Receive a unique tracking ID upon submission.
-   **Courier Flow**: Register for an account, log in, and view a dashboard of available deliveries. Accept jobs to see them assigned to you.
-   **Real-time Tracking**: Customers can use their tracking ID to view the live status and timeline of their delivery.
-   **Responsive Design**: The UI is fully responsive and optimized for mobile devices.

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Creates a production-ready build of the application.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Lints the codebase for issues.

## Project Structure

-   `app/`: Contains the pages and API routes for the application (App Router).
-   `components/`: Shared React components.
-   `lib/`: Helper functions and libraries (e.g., database connection, auth).
-   `models/`: Mongoose schemas for database models (`User`, `DeliveryRequest`).
-   `public/`: Static assets.
-   `pages/api/auth/`: API routes for authentication (Pages Router, for compatibility with some auth patterns).

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## 📧 Contact
For questions or support, please open an issue.

---

**Built with ❤️ for the community**
