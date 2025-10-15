'use client'

import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      rating: 5,
      text: "I needed urgent documents delivered to a client and was in a panic. The courier was so understanding and made it happen in under 2 hours. Truly a lifesaver!",
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'Happy Customer',
      rating: 5,
      text: "Bought a guitar from someone online but couldn't pick it up. My courier treated it like it was their own and delivered it perfectly. Such peace of mind!",
      avatar: '🎸'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Busy Parent',
      rating: 5,
      text: "Between work and kids, I had no time to get a birthday gift. Courier Connect came through and made my daughter's friend so happy. Thank you!",
      avatar: '👩‍👧'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Stories From Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real people sharing how Courier Connect helped them out when they needed it most.
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
              Based on 5,000+ customer reviews
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}