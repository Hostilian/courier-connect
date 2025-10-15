'use client'

import { motion } from 'framer-motion'
import { CheckCircle, MapPin, Package, Truck } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Set Pickup & Delivery',
      description: 'Enter pickup and delivery locations with detailed instructions. No account needed!'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Describe Your Item',
      description: 'Tell us what needs to be delivered - envelope, package, or marketplace purchase.'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Courier Accepts',
      description: 'Available couriers in your area will see your request and accept the job.'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Track & Receive',
      description: 'Track your delivery in real-time and receive confirmation when completed.'
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
            Getting your items delivered is simple and straightforward. Follow these easy steps.
          </p>
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