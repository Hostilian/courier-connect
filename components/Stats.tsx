'use client'

import { motion } from 'framer-motion'

export default function Stats() {
  const stats = [
    {
      number: 'Fast',
      label: 'Same-Day Delivery',
      description: 'Most items delivered within hours'
    },
    {
      number: 'Safe',
      label: 'Verified Couriers',
      description: 'Background-checked helpers'
    },
    {
      number: '4.9★',
      label: 'Customer Rating',
      description: 'Highly rated service'
    },
    {
      number: '< 2hrs',
      label: 'Average Time',
      description: 'From pickup to delivery'
    }
  ]

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}