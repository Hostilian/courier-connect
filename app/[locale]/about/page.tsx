import { Globe, Heart, Shield, Target, Users, Zap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  
  return {
    title: 'About Us | Courier Connect',
    description: 'Learn about Courier Connect - our mission, values, and commitment to connecting communities through reliable delivery services.',
  };
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Courier Connect
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Connecting communities through reliable, affordable, and accessible delivery services worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center justify-center mb-8">
            <Target className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
            To revolutionize local delivery by creating a transparent, community-driven marketplace 
            that empowers independent couriers while providing customers with fast, reliable, and 
            affordable delivery services across the globe.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Courier Connect was born from a simple observation: traditional delivery services 
                  were often slow, expensive, and lacked transparency. We believed there had to be 
                  a better way.
                </p>
                <p>
                  In 2024, we set out to build a platform that would democratize delivery services. 
                  By connecting customers directly with independent couriers in their community, we 
                  created a win-win solution: customers get faster, more affordable delivery, while 
                  couriers earn fair compensation for their work.
                </p>
                <p>
                  Today, we operate in 180+ countries, support 14 languages, and facilitate thousands 
                  of deliveries every day. But we're just getting started.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
              <div className="space-y-6">
                <div>
                  <div className="text-5xl font-bold text-blue-600 mb-2">180+</div>
                  <div className="text-gray-700">Countries Served</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-purple-600 mb-2">14</div>
                  <div className="text-gray-700">Languages Supported</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-green-600 mb-2">85%</div>
                  <div className="text-gray-700">Revenue to Couriers</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-gray-700">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Community First</h3>
            <p className="text-gray-700 leading-relaxed">
              We believe in empowering local communities. 85% of every delivery fee goes directly 
              to couriers, ensuring fair compensation and economic opportunity.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trust & Safety</h3>
            <p className="text-gray-700 leading-relaxed">
              Security is paramount. We use encryption, background checks, insurance requirements, 
              and real-time tracking to ensure safe, reliable deliveries every time.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Globe className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Accessibility</h3>
            <p className="text-gray-700 leading-relaxed">
              Delivery services should be accessible to everyone, everywhere. We support 14 languages 
              and operate worldwide, breaking down barriers to global commerce.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Speed & Efficiency</h3>
            <p className="text-gray-700 leading-relaxed">
              Time matters. From our Urgent 2-4 hour delivery to real-time tracking, we're obsessed 
              with getting packages to their destination quickly and efficiently.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Transparency</h3>
            <p className="text-gray-700 leading-relaxed">
              No hidden fees, no surprises. Clear pricing, real-time tracking, and open communication 
              at every step. You always know where your package is and what you're paying.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Obsession</h3>
            <p className="text-gray-700 leading-relaxed">
              Our customers are at the heart of everything we do. 24/7 support, easy-to-use platform, 
              and constant innovation to make delivery better for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
            Built by a Global Team
          </h2>
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-12">
            Our diverse team of engineers, designers, and logistics experts spans multiple continents, 
            working together to build the future of delivery services.
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-700 leading-relaxed mb-6">
              We're always looking for talented individuals who share our passion for innovation and 
              community empowerment. Whether you're a developer, designer, operations specialist, or 
              courier, there's a place for you at Courier Connect.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Better Delivery?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of customers and couriers who trust Courier Connect for fast, 
            reliable, and affordable delivery services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-lg"
            >
              Request a Delivery
            </Link>
            <Link
              href="/courier/register"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition text-lg"
            >
              Become a Courier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
