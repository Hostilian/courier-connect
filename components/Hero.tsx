'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Package } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(156, 163, 175) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Package className="w-4 h-4" />
              <span>Supporting Your Local Community</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 text-balance">
              Helping Your Community,{' '}
              <span className="text-blue-600">One Delivery at a Time</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with trusted neighbors who can help deliver your packages, gifts, or marketplace finds. 
              Simple, friendly, and local—no account needed to get started!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link href="/request" className="btn-primary text-lg px-8 py-4 group">
              Request Delivery Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link href="/track" className="btn-secondary text-lg px-8 py-4 group">
              <MapPin className="w-5 h-5 mr-2" />
              Track Your Package
            </Link>
          </motion.div>

          {/* Quick features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-medium">Same-day delivery</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-medium">Real-time tracking</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-medium">Secure & insured</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}