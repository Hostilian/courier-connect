'use client';

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import Image from 'next/image';

export default function ImageOptimizationDemo() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Image Optimization Demo</h2>
            <p className="text-gray-600">
              This page uses Next.js Image component for optimized delivery, automatic WebP conversion,
              and responsive sizing - enhancing performance and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/images/courier-bike.svg"
                  alt="Courier on bike"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">SVG Optimization</h3>
              <p className="text-gray-600 text-sm">
                SVGs are optimized and properly sized while maintaining crisp quality at any scale.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/images/avatar-business.svg"
                  alt="Business avatar"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Responsive Sizing</h3>
              <p className="text-gray-600 text-sm">
                Images adjust to container size, loading appropriate resolutions for each device.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/images/delivery-clock.svg"
                  alt="Delivery timer"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Lazy Loading</h3>
              <p className="text-gray-600 text-sm">
                Images load only when scrolled into view, improving initial page load speed.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-blue-100 border border-blue-200 rounded-lg p-4 mt-8 flex items-start"
          >
            <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Performance Optimization:</p>
              <p>
                Using Next.js Image over standard HTML img tags provides automatic:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>WebP/AVIF conversion when browser supported</li>
                  <li>Responsive size generation</li>
                  <li>Lazy loading and blur placeholders</li>
                  <li>Proper dimensioning to prevent layout shift</li>
                </ul>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}