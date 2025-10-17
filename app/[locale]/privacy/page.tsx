export const metadata = {
  title: 'Privacy Policy | Courier Connect',
  description: 'Learn how Courier Connect collects, uses, and protects your personal information',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> October 15, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Customer Information</h3>
              <p className="text-gray-600 mb-4">
                When you request a delivery, we collect:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Sender and receiver names, phone numbers, and addresses</li>
                <li>Package details (type, size, description)</li>
                <li>Delivery preferences and special instructions</li>
                <li>Email address (optional)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Courier Information</h3>
              <p className="text-gray-600 mb-4">
                When you register as a courier, we collect:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Full name, email address, and phone number</li>
                <li>Vehicle information (type, license plate, insurance)</li>
                <li>ID verification documents</li>
                <li>City and service area</li>
                <li>Earnings and delivery statistics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Facilitate delivery services between customers and couriers</li>
                <li>Process and track deliveries</li>
                <li>Communicate updates about deliveries</li>
                <li>Verify courier identities and credentials</li>
                <li>Process payments and maintain financial records</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We share your information only as necessary:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>With Couriers:</strong> Customer names, phone numbers, and addresses for delivery purposes</li>
                <li><strong>With Customers:</strong> Courier names and contact information after delivery acceptance</li>
                <li><strong>Service Providers:</strong> Payment processors, SMS/email services (under strict confidentiality agreements)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
              </ul>
              <p className="text-gray-600 mb-4">
                We <strong>never</strong> sell your personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Password hashing using bcrypt</li>
                <li>Secure authentication with JWT tokens</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and monitoring</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights (GDPR)</h2>
              <p className="text-gray-600 mb-4">
                Under GDPR, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-600 mb-4">
                To exercise these rights, contact us at <a href="mailto:privacy@hostilian.org" className="text-blue-600 hover:text-blue-800">privacy@hostilian.org</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your data for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Delivery Records:</strong> 7 years (for financial and legal compliance)</li>
                <li><strong>Courier Accounts:</strong> Active until account deletion</li>
                <li><strong>Tracking Data:</strong> 90 days after delivery completion</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
              <p className="text-gray-600 mb-4">
                We use essential cookies only:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Authentication tokens (for courier login)</li>
                <li>Language preferences</li>
                <li>Session management</li>
              </ul>
              <p className="text-gray-600 mb-4">
                We do not use tracking or advertising cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our services are not intended for users under 18 years old. We do not knowingly collect information from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this policy periodically. We will notify you of significant changes via email or platform notification.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                For privacy-related questions or requests:
              </p>
              <ul className="list-none text-gray-600">
                <li className="mb-2"><strong>Email:</strong> <a href="mailto:privacy@hostilian.org" className="text-blue-600 hover:text-blue-800">privacy@hostilian.org</a></li>
                <li className="mb-2"><strong>Data Protection Officer:</strong> <a href="mailto:dpo@hostilian.org" className="text-blue-600 hover:text-blue-800">dpo@hostilian.org</a></li>
                <li className="mb-2"><strong>Address:</strong> Courier Connect, hostilian.org</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
