import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  
  return {
    title: 'Help & FAQ | Courier Connect',
    description: 'Frequently asked questions about our courier delivery service for customers and couriers.',
  };
}

export default function HelpPage() {
  const faqData = {
    customers: [
      {
        question: "How do I request a delivery?",
        answer: "Simply go to the Request Delivery page, fill in the sender and receiver details, add package information, and submit. You'll receive a tracking ID immediately."
      },
      {
        question: "How much does delivery cost?",
        answer: "We offer three pricing tiers: Standard ($5, 2-3 days), Express ($10, 1 day), and Urgent ($20, 2-4 hours). Choose the option that best fits your needs."
      },
      {
        question: "How can I track my delivery?",
        answer: "Use your tracking ID (format: CC-XXXXXX) on the Track Delivery page. You'll see real-time updates as your package moves through each stage."
      },
      {
        question: "What items cannot be delivered?",
        answer: "We cannot deliver illegal substances, weapons, hazardous materials, perishable food, live animals, or items exceeding 50kg/110lbs. See our Terms of Service for complete details."
      },
      {
        question: "Can I cancel a delivery?",
        answer: "Yes, you can cancel for free before a courier accepts. After acceptance, cancellation fees apply: 50% for Standard/Express, 75% for Urgent deliveries."
      },
      {
        question: "What if my package is damaged or lost?",
        answer: "Report issues within 24 hours. Couriers carry insurance up to $500. File a claim through your tracking page and we'll investigate immediately."
      },
      {
        question: "Do I need an account to request delivery?",
        answer: "No account needed! Just provide contact information when requesting. However, couriers must register to offer delivery services."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, PayPal, and digital wallets through our secure payment processor Stripe."
      }
    ],
    couriers: [
      {
        question: "How do I become a courier?",
        answer: "Register on the Courier Registration page, verify your identity, provide insurance documentation, and complete a background check. Approval typically takes 2-3 business days."
      },
      {
        question: "How much can I earn?",
        answer: "Couriers earn 85% of each delivery fee. Standard: $4.25, Express: $8.50, Urgent: $17. Top couriers earn $500-2000/week depending on volume and location."
      },
      {
        question: "What are the requirements?",
        answer: "Must be 18+, have valid driver's license, vehicle insurance, clean driving record, smartphone for app, and pass background check. Professional demeanor required."
      },
      {
        question: "How do I get paid?",
        answer: "Earnings are deposited weekly to your bank account via direct deposit. Minimum payout is $25. Track earnings in your courier dashboard."
      },
      {
        question: "Can I choose which deliveries to accept?",
        answer: "Yes! View available deliveries, see pickup/dropoff locations and pay, then choose which ones to accept. No penalties for declining."
      },
      {
        question: "What if the customer isn't available?",
        answer: "Attempt delivery 3 times. If unavailable, contact support for instructions. Package may be returned or held at a designated location per customer preference."
      },
      {
        question: "How does the rating system work?",
        answer: "Customers rate couriers after delivery (1-5 stars). Maintain 4.0+ average for good standing. Ratings below 3.5 may result in account review."
      },
      {
        question: "What insurance do I need?",
        answer: "Commercial vehicle insurance covering delivery services. Minimum $500,000 liability. Upload proof of insurance during registration. Must maintain current coverage."
      }
    ],
    technical: [
      {
        question: "Is my data secure?",
        answer: "Yes! We use HTTPS encryption, secure JWT authentication, bcrypt password hashing, and regular security audits. See our Privacy Policy for details."
      },
      {
        question: "Which languages are supported?",
        answer: "We support 14 languages: English, Spanish, French, German, Italian, Portuguese, Czech, Ukrainian, Vietnamese, Turkish, Russian, Polish, Arabic, and Chinese."
      },
      {
        question: "Does the platform work on mobile?",
        answer: "Absolutely! Our responsive design works perfectly on smartphones, tablets, and desktops. Progressive Web App (PWA) support coming soon for offline functionality."
      },
      {
        question: "How do I change my language preference?",
        answer: "Use the language selector in the navigation menu (top right). Your preference is saved automatically for future visits."
      },
      {
        question: "What browsers are supported?",
        answer: "All modern browsers: Chrome, Firefox, Safari, Edge (latest 2 versions). Internet Explorer is not supported."
      },
      {
        question: "Can I use the platform offline?",
        answer: "Currently requires internet connection. PWA with offline support is in development and will allow tracking and basic features without connectivity."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Help & FAQ
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Find answers to common questions about our courier delivery platform
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#customers" className="text-center p-4 rounded-lg hover:bg-blue-50 transition">
            <div className="text-3xl mb-2">📦</div>
            <div className="font-semibold text-gray-900">For Customers</div>
            <div className="text-sm text-gray-600">Requesting & tracking deliveries</div>
          </a>
          <a href="#couriers" className="text-center p-4 rounded-lg hover:bg-purple-50 transition">
            <div className="text-3xl mb-2">🚗</div>
            <div className="font-semibold text-gray-900">For Couriers</div>
            <div className="text-sm text-gray-600">Earnings, requirements & process</div>
          </a>
          <a href="#technical" className="text-center p-4 rounded-lg hover:bg-green-50 transition">
            <div className="text-3xl mb-2">💻</div>
            <div className="font-semibold text-gray-900">Technical</div>
            <div className="text-sm text-gray-600">Platform, security & features</div>
          </a>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* For Customers */}
        <section id="customers" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="text-4xl mr-3">📦</span>
            For Customers
          </h2>
          <div className="space-y-4">
            {faqData.customers.map((faq, index) => (
              <details key={index} className="bg-white rounded-lg shadow-md overflow-hidden group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 pt-2 text-gray-700 leading-relaxed border-t">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* For Couriers */}
        <section id="couriers" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="text-4xl mr-3">🚗</span>
            For Couriers
          </h2>
          <div className="space-y-4">
            {faqData.couriers.map((faq, index) => (
              <details key={index} className="bg-white rounded-lg shadow-md overflow-hidden group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 pt-2 text-gray-700 leading-relaxed border-t">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Technical */}
        <section id="technical" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="text-4xl mr-3">💻</span>
            Technical & Platform
          </h2>
          <div className="space-y-4">
            {faqData.technical.map((faq, index) => (
              <details key={index} className="bg-white rounded-lg shadow-md overflow-hidden group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 pt-2 text-gray-700 leading-relaxed border-t">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Still Need Help */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is available 24/7 to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@hostilian.org"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Email Us
            </a>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            Response time: Usually within 2 hours
          </p>
        </section>
      </div>
    </div>
  );
}
