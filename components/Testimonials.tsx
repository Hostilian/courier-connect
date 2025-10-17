'use client'

import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import Image from 'next/image'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Business Owner',
      role: 'Prague',
      rating: 5,
      text: "Urgent documents delivered across the city in under 2 hours. The courier was professional and kept me updated throughout. Exactly what we needed!",
      avatar: '/images/avatar-business.svg'
    },
    {
      name: 'Online Seller',
      role: 'Istanbul',
      rating: 5,
      text: "Sold a guitar online but couldn't deliver it myself. The courier handled it with care and the buyer was very happy. Great service!",
      avatar: '/images/avatar-seller.svg'
    },
    {
      name: 'Customer',
      role: 'Kyiv',
      rating: 5,
      text: "Needed a gift delivered for a birthday party. Fast, reliable, and the courier was so friendly. Will definitely use again!",
      avatar: '/images/avatar-customer.svg'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real Deliveries, Real People
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                <div className="relative w-12 h-12">
                  <Image
                    src={testimonial.avatar}
                    alt={`${testimonial.name} avatar`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
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