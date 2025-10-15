'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Package, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-blue-800 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '30px 30px',
          opacity: 0.1
        }} />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Join thousands of customers and couriers who trust Courier Connect for fast, reliable local delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Need Something Delivered?</h3>
              <p className="text-blue-100 mb-4">No registration required</p>
              <Link href="/request" className="btn-secondary text-lg px-8 py-4 inline-flex items-center bg-white text-blue-600 hover:bg-gray-50">
                <Package className="w-5 h-5 mr-2" />
                Request Delivery
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            <div className="hidden sm:block w-px h-24 bg-blue-400" />

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Want to Earn Money?</h3>
              <p className="text-blue-100 mb-4">Become a courier today</p>
              <Link href="/courier/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center bg-blue-800 hover:bg-blue-900">
                <Smartphone className="w-5 h-5 mr-2" />
                Join as Courier
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-200">Free</div>
                <div className="text-sm text-blue-100">Customer registration</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-200">24/7</div>
                <div className="text-sm text-blue-100">Customer support</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-200">Instant</div>
                <div className="text-sm text-blue-100">Courier matching</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}