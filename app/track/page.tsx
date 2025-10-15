'use client'

import { motion } from 'framer-motion'
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    MapPin,
    MessageSquare,
    Navigation,
    Package,
    Phone,
    Star,
    Truck
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface DeliveryStatus {
  id: string
  status: 'pending' | 'accepted' | 'pickup' | 'in-transit' | 'delivered'
  customer: {
    name: string
    phone: string
  }
  courier: {
    name: string
    phone: string
    rating: number
    vehicle: string
    photo?: string
  } | null
  pickup: {
    address: string
    time?: string
  }
  delivery: {
    address: string
    estimatedTime?: string
  }
  item: {
    description: string
    instructions?: string
  }
  timeline: Array<{
    status: string
    timestamp: string
    message: string
  }>
  price: number
  createdAt: string
  estimatedDelivery?: string
}

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('')
  const [delivery, setDelivery] = useState<DeliveryStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')


  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingId.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/track/${trackingId.trim()}`)
      const data = await res.json()
      if (res.ok && data.success && data.delivery) {
        setDelivery(data.delivery)
      } else {
        setError(data.error || 'Tracking ID not found. Please check your ID and try again.')
      }
    } catch (err) {
      setError('Failed to fetch tracking information. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'pickup':
        return <Package className="w-5 h-5 text-orange-500" />
      case 'in-transit':
        return <Truck className="w-5 h-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-blue-100 text-blue-800'
      case 'pickup': return 'bg-orange-100 text-orange-800'
      case 'in-transit': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Looking for courier'
      case 'accepted': return 'Courier assigned'
      case 'pickup': return 'Item picked up'
      case 'in-transit': return 'On the way'
      case 'delivered': return 'Delivered'
      default: return 'Unknown status'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Track Delivery</span>
            </div>
            
            <div />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!delivery ? (
          /* Tracking Input */
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Track Your Delivery
              </h1>
              <p className="text-gray-600 mb-8">
                Enter your tracking ID to see real-time updates on your delivery
              </p>

              <form onSubmit={handleTrack} className="space-y-4">
                <div>
                  <input
                    type="text"
                    className="input-field text-center text-lg"
                    placeholder="Enter tracking ID (e.g., DC123456)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  />
                </div>
                
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !trackingId.trim()}
                  className="w-full btn-primary py-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    'Track Delivery'
                  )}
                </button>
              </form>

              <div className="mt-6 text-sm text-gray-500">
                <p>
                  Don't have a tracking ID?{' '}
                  <Link href="/request" className="text-blue-600 hover:underline">
                    Create a new delivery request
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Delivery Tracking Details */
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Status Header */}
              <div className="card">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Delivery #{delivery.id}
                    </h1>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                      {getStatusIcon(delivery.status)}
                      <span className="ml-2">{getStatusText(delivery.status)}</span>
                    </div>
                  </div>
                  
                  <div className="text-right mt-4 md:mt-0">
                    <div className="text-sm text-gray-500">Estimated delivery</div>
                    <div className="text-lg font-semibold text-gray-900">{delivery.estimatedDelivery}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      <div>
                        <div className="text-sm text-gray-500">Pickup</div>
                        <div className="font-medium text-gray-900">{delivery.pickup.address}</div>
                        {delivery.pickup.time && (
                          <div className="text-sm text-gray-600">Picked up at {delivery.pickup.time}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                      <div>
                        <div className="text-sm text-gray-500">Delivery</div>
                        <div className="font-medium text-gray-900">{delivery.delivery.address}</div>
                        {delivery.delivery.estimatedTime && (
                          <div className="text-sm text-gray-600">ETA: {delivery.delivery.estimatedTime}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Item Description</div>
                    <div className="font-medium text-gray-900 mb-2">{delivery.item.description}</div>
                    {delivery.item.instructions && (
                      <>
                        <div className="text-sm text-gray-500 mb-1">Special Instructions</div>
                        <div className="text-gray-700">{delivery.item.instructions}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Courier Info */}
              {delivery.courier && (
                <div className="card">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Courier</h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">
                        {delivery.courier.photo || '👤'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{delivery.courier.name}</div>
                        <div className="text-sm text-gray-600">{delivery.courier.vehicle}</div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{delivery.courier.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <a
                        href={`tel:${delivery.courier.phone}`}
                        className="btn-secondary p-3"
                        title="Call courier"
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                      <a
                        href={`sms:${delivery.courier.phone}`}
                        className="btn-secondary p-3"
                        title="Message courier"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Map Placeholder */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Tracking</h2>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Navigation className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Interactive map would be here</p>
                    <p className="text-sm">Showing real-time courier location</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Timeline</h2>
                <div className="space-y-4">
                  {delivery.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900">{event.message}</div>
                          <div className="text-sm text-gray-500">{event.timestamp}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Summary */}
              <div className="card">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">Total Cost</h3>
                    <p className="text-sm text-gray-600">Payment processed after delivery</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${delivery.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/request" className="btn-primary flex-1 text-center">
                  Create New Delivery
                </Link>
                <button
                  onClick={() => {
                    setDelivery(null)
                    setTrackingId('')
                    setError('')
                  }}
                  className="btn-secondary flex-1"
                >
                  Track Another Package
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}