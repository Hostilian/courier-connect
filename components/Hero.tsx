// The Hero section. Named after heroes, presumably. Though moving boxes doesn't seem that heroic.
// But hey, who am I to judge? Maybe in ancient Greece, they had a god of package delivery. Hermes, probably.
'use client'

import { motion } from 'framer-motion'; // Wiggle library strikes again
import { ArrowRight, MapPin, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// This is the hero. The big banner. The first thing people see. No pressure.
export default function TheGrandShowoffSection() {
  return (
    <section className="relative pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Background decoration. Because plain backgrounds are for quitters. */}
      <div className="absolute inset-0 opacity-5">
        {/* Using Next.js Image for optimized background pattern */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/hero-pattern.svg"
            alt="Background Pattern"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content that fades in. Because everything needs to fade in now. It's the law. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} // Starts low and invisible. Drama.
            animate={{ opacity: 1, y: 0 }}  // Floats up and appears. Magic.
            transition={{ duration: 0.6 }} // Takes 0.6 seconds. Not 0.5, not 0.7. 0.6. Very specific.
            className="mb-8"
          >
            {/* Badge. Makes things look official. */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Package className="w-4 h-4" />
              <span>Fast Local Delivery Service</span> {/* Translation: "We move your junk" */}
            </div>
            
            {/* The headline. Big. Bold. Impossible to miss. Just like your ex at the grocery store. */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 text-balance">
              Local Couriers,{' '}
              <span className="text-blue-600">Local Deliveries</span> {/* Blue text. Very creative. */}
            </h1>
            
            {/* The subtitle. Explaining what we just said, but with more words. */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with local couriers for fast, reliable delivery. 
              Send packages, gifts, or marketplace items—no account needed to get started.
              {/* "No account needed" - the most revolutionary concept since sliced bread. */}
            </p>
          </motion.div>

          {/* Call to action buttons. The "DO SOMETHING" section. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }} // Delayed slightly. Building suspense.
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            {/* Primary button. The main attraction. The big kahuna. */}
            <Link href="/request" className="btn-primary text-lg px-8 py-4 group">
              Request Delivery Now {/* Translation: "Give us your money" */}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              {/* Arrow moves when you hover. Real cutting-edge stuff from the year 2010. */}
            </Link>
            
            {/* Secondary button. For people who already made a mistake and want to check on it. */}
            <Link href="/track" className="btn-secondary text-lg px-8 py-4 group">
              <MapPin className="w-5 h-5 mr-2" />
              Track Your Package {/* "Where's my stuff?" - The eternal question. */}
            </Link>
          </motion.div>

          {/* Quick features - Three bullet points. The magic number. Not two, not four. Three. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }} // Even MORE delayed. We're really stretching this out.
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {/* Feature 1: Speed. Because waiting is for suckers. */}
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full" /> {/* Green dot. Means "good." Universal truth. */}
              <span className="font-medium">Same-day delivery</span>
            </div>
            {/* Feature 2: Tracking. So you can obsessively refresh the page. */}
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-medium">Real-time tracking</span>
            </div>
            {/* Feature 3: Security. Allegedly. */}
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-medium">Secure & insured</span> {/* Fine print not included */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}