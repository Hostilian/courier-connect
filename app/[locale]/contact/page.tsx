import { getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  
  return {
    title: 'Contact Us | Courier Connect',
    description: 'Get in touch with Courier Connect support team. We\'re available 24/7 to help with your delivery needs.',
  };
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            We're here to help! Reach out to our support team anytime.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="">Select a topic...</option>
                      <option value="delivery">Delivery Inquiry</option>
                      <option value="tracking">Tracking Issue</option>
                      <option value="courier">Courier Application</option>
                      <option value="payment">Payment Issue</option>
                      <option value="technical">Technical Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking ID (if applicable)
                  </label>
                  <input
                    type="text"
                    id="trackingId"
                    name="trackingId"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="CC-XXXXXX"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder="Please describe your inquiry in detail..."
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> and 
                    consent to being contacted regarding my inquiry.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Send Message
                </button>

                <p className="text-sm text-gray-600 text-center">
                  We typically respond within 2 hours during business hours
                </p>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <a href="mailto:support@hostilian.org" className="text-blue-600 hover:underline text-sm">
                      support@hostilian.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <a href="tel:+18005551234" className="text-blue-600 hover:underline text-sm">
                      +1 (800) 555-1234
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Live Chat</div>
                    <button className="text-blue-600 hover:underline text-sm">
                      Start chat →
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Hours</div>
                    <div className="text-sm text-gray-600">24/7 Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Emails */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Department Contacts
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium text-gray-900">General Support</div>
                  <a href="mailto:support@hostilian.org" className="text-blue-600 hover:underline">
                    support@hostilian.org
                  </a>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Courier Applications</div>
                  <a href="mailto:courier@hostilian.org" className="text-blue-600 hover:underline">
                    courier@hostilian.org
                  </a>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Legal & Compliance</div>
                  <a href="mailto:legal@hostilian.org" className="text-blue-600 hover:underline">
                    legal@hostilian.org
                  </a>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Privacy & Data</div>
                  <a href="mailto:privacy@hostilian.org" className="text-blue-600 hover:underline">
                    privacy@hostilian.org
                  </a>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Partnerships</div>
                  <a href="mailto:partnerships@hostilian.org" className="text-blue-600 hover:underline">
                    partnerships@hostilian.org
                  </a>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Press & Media</div>
                  <a href="mailto:press@hostilian.org" className="text-blue-600 hover:underline">
                    press@hostilian.org
                  </a>
                </div>
              </div>
            </div>

            {/* Office Location */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-start mb-4">
                <MapPin className="w-6 h-6 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Headquarters</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Courier Connect HQ<br />
                    123 Delivery Street<br />
                    San Francisco, CA 94102<br />
                    United States
                  </p>
                </div>
              </div>
              <div className="text-sm text-blue-100 mt-4 pt-4 border-t border-blue-400">
                <strong>Note:</strong> We operate globally with team members across 50+ countries. 
                This address is for official correspondence only.
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Looking for quick answers?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Check our FAQ page for instant answers to common questions.
              </p>
              <a
                href="/help"
                className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition text-sm"
              >
                Visit FAQ →
              </a>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Connect With Us
          </h3>
          <p className="text-gray-600 mb-6">
            Follow us on social media for updates, tips, and community stories
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="https://twitter.com/courierconnect" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium">
              Twitter / X
            </a>
            <a href="https://facebook.com/courierconnect" className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-medium">
              Facebook
            </a>
            <a href="https://instagram.com/courierconnect" className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition font-medium">
              Instagram
            </a>
            <a href="https://linkedin.com/company/courierconnect" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
