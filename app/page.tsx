'use client'

import CTA from '@/components/CTA'
import FeatureCard from '@/components/FeatureCard'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Stats from '@/components/Stats'
import Testimonials from '@/components/Testimonials'
import {
    Clock,
    MapPin,
    Package,
    Shield,
    Smartphone,
    Star,
    Users
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Courier Connect</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How it Works
              </Link>
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/courier/login" className="btn-ghost">
                Courier Login
              </Link>
              <Link href="/courier/register" className="btn-primary">
                Become a Courier
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <Stats />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Courier Connect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fast, reliable, and affordable local delivery service that connects you with trusted couriers in your area.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-blue-600" />}
              title="Same-Day Delivery"
              description="Get your packages delivered within hours, not days. Perfect for urgent deliveries."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-600" />}
              title="Secure & Insured"
              description="All deliveries are tracked and insured. Your packages are safe with our verified couriers."
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-blue-600" />}
              title="Real-time Tracking"
              description="Track your delivery in real-time from pickup to dropoff with GPS tracking."
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8 text-blue-600" />}
              title="Mobile Optimized"
              description="Perfect mobile experience. Request deliveries on the go with our responsive design."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-blue-600" />}
              title="Trusted Couriers"
              description="All couriers are background-checked and rated by the community for your peace of mind."
            />
            <FeatureCard
              icon={<Star className="w-8 h-8 text-blue-600" />}
              title="5-Star Service"
              description="Join thousands of satisfied customers who rate our service 5 stars consistently."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Courier Connect</span>
              </div>
              <p className="text-gray-400">
                Fast, reliable local delivery service connecting customers with trusted couriers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/request" className="hover:text-white transition-colors">Request Delivery</Link></li>
                <li><Link href="/track" className="hover:text-white transition-colors">Track Package</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Couriers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courier/register" className="hover:text-white transition-colors">Become a Courier</Link></li>
                <li><Link href="/courier/login" className="hover:text-white transition-colors">Courier Login</Link></li>
                <li><Link href="/courier/earnings" className="hover:text-white transition-colors">Earnings</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/safety" className="hover:text-white transition-colors">Safety</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Courier Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}