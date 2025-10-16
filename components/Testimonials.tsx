'use client'

import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      rating: 5,
    },
    {
      rating: 5,
      avatar: '🎸'
    },
    {
      rating: 5,
      text: "Between work and kids, I had no time to get a birthday gift. Courier Connect came through and made my daughter's friend so happy. Thank you!",
      avatar: '👩‍👧'
      text: "Needed a gift delivered for a birthday party. Fast, reliable, and the courier was so friendly. Will definitely use again!",
      avatar: '🎁'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real people sharing how Courier Connect helped them out when they needed it most.
            See how Courier Connect helps people get deliveries done.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card relative"
            >
              <div className="absolute top-4 right-4 text-blue-100">
                <Quote className="w-8 h-8" />
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">4.9/5</span>
            </div>
            <div className="text-gray-600">
              Trusted by thousands of customers
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}