export const metadata = {
  title: 'Terms of Service | Courier Connect',
  description: 'Read our terms of service for using Courier Connect delivery platform',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> October 15, 2025
            </p>
            <p className="text-gray-600 mb-8">
              By using Courier Connect, you agree to these terms. Please read carefully.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Service Description</h2>
              <p className="text-gray-600 mb-4">
                Courier Connect is a platform connecting customers who need delivery services with independent couriers. We facilitate the connection but do not employ couriers or directly provide delivery services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Customers</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>No account required to request or track deliveries</li>
                <li>You must provide accurate pickup and delivery information</li>
                <li>You are responsible for package contents</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Couriers</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Must be 18+ years old</li>
                <li>Must provide valid ID and vehicle documentation</li>
                <li>Must maintain valid insurance</li>
                <li>Account subject to verification and approval</li>
                <li>You are an independent contractor, not an employee</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Prohibited Items</h2>
              <p className="text-gray-600 mb-4">
                The following items are strictly prohibited:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Illegal substances or contraband</li>
                <li>Weapons, ammunition, or explosives</li>
                <li>Hazardous materials</li>
                <li>Live animals</li>
                <li>Perishable items without proper packaging</li>
                <li>Stolen goods</li>
                <li>Items requiring special permits</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Pricing and Payments</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Service Fees</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Standard delivery: $5</li>
                <li>Express delivery: $10</li>
                <li>Urgent delivery: $20</li>
                <li>Prices may vary by location and distance</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Courier Earnings</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Couriers receive 85% of delivery fee</li>
                <li>Platform retains 15% service fee</li>
                <li>Payments processed weekly</li>
                <li>Couriers responsible for own taxes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cancellation Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Customer Cancellations</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Free cancellation before courier acceptance</li>
                <li>50% fee if cancelled after acceptance but before pickup</li>
                <li>Full charge if cancelled after pickup</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Courier Cancellations</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Excessive cancellations may result in account suspension</li>
                <li>Valid reasons (safety, prohibited items) will not count against record</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Liability and Insurance</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Platform Liability</h3>
              <p className="text-gray-600 mb-4">
                Courier Connect is a marketplace platform. We are not liable for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Lost, damaged, or stolen items during delivery</li>
                <li>Courier actions or negligence</li>
                <li>Delays or failed deliveries</li>
                <li>Disputes between customers and couriers</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Courier Insurance</h3>
              <p className="text-gray-600 mb-4">
                Couriers must maintain their own liability and vehicle insurance. Basic package protection included up to $100 per delivery.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Dispute Resolution</h2>
              <p className="text-gray-600 mb-4">
                For disputes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Contact support within 24 hours of delivery</li>
                <li>Provide tracking ID and evidence (photos, messages)</li>
                <li>We will mediate and attempt fair resolution</li>
                <li>Decision is final and binding</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Account Termination</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to suspend or terminate accounts for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Violation of these terms</li>
                <li>Fraudulent activity</li>
                <li>Consistent poor ratings or complaints</li>
                <li>Prohibited item transport</li>
                <li>Abusive behavior</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                All platform content, including logo, design, and code, is owned by Courier Connect. Unauthorized use is prohibited.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy</h2>
              <p className="text-gray-600 mb-4">
                Your privacy is important. See our <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a> for details on data collection and use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We may update these terms at any time. Continued use after changes constitutes acceptance. Major changes will be communicated via email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These terms are governed by applicable laws. Disputes will be resolved through arbitration.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact</h2>
              <p className="text-gray-600 mb-4">
                For questions about these terms:
              </p>
              <ul className="list-none text-gray-600">
                <li className="mb-2"><strong>Email:</strong> <a href="mailto:legal@hostilian.org" className="text-blue-600 hover:text-blue-800">legal@hostilian.org</a></li>
                <li className="mb-2"><strong>Support:</strong> <a href="mailto:support@hostilian.org" className="text-blue-600 hover:text-blue-800">support@hostilian.org</a></li>
                <li className="mb-2"><strong>Website:</strong> <a href="https://hostilian.org" className="text-blue-600 hover:text-blue-800">hostilian.org</a></li>
              </ul>
            </section>

            <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong>Acceptance:</strong> By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
