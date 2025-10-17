'use client'

import { motion } from 'framer-motion'
import { CheckCircle, MapPin, Package, Truck } from 'lucide-react'
import Image from 'next/image'

export default function HowItWorks() {
  const steps = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Enter Pickup & Delivery',
      description: 'Provide pickup and delivery addresses. Add any special instructions for the courier.'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Describe Your Package',
      description: 'Tell us what needs delivering—documents, gifts, or marketplace purchases.'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Courier Accepts',
      description: 'Verified couriers in your area see the request and accept the delivery.'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Track & Receive',
      description: 'Follow delivery progress in real-time and receive your package safely.'
    }
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Request a delivery in four simple steps.
          </p>
        </div>

        {/* Optimized Illustration */}
        <div className="relative w-full max-w-lg mx-auto mb-16 h-40">
          <Image 
            src="/images/delivery-process.svg"
            alt="Delivery Process"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Step connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gray-300 transform -translate-y-1/2 z-0" />
                )}

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-soft">
                    {step.icon}
                  </div>
                  
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <a href="/request" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                Start Your First Delivery
                <Package className="w-5 h-5 ml-2" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}