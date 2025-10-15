'use client'

import { motion } from 'framer-motion'
import {
    ArrowLeft,
    CreditCard,
    DollarSign,
    MapPin,
    Package,
    User
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface DeliveryRequest {
  pickupAddress: string
  deliveryAddress: string
  pickupTime: string
  itemDescription: string
  specialInstructions: string
  customerName: string
  customerPhone: string
  urgency: 'standard' | 'express' | 'same-day'
}

export default function RequestPage() {
  const [step, setStep] = useState(1)
  const [request, setRequest] = useState<DeliveryRequest>({
    pickupAddress: '',
    deliveryAddress: '',
    pickupTime: '',
    itemDescription: '',
    specialInstructions: '',
    customerName: '',
    customerPhone: '',
    urgency: 'standard'
  })

  const totalSteps = 4

  const updateRequest = (field: keyof DeliveryRequest, value: string) => {
    setRequest(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const calculatePrice = () => {
    const basePrice = 5
    const urgencyMultiplier = {
      'standard': 1,
      'express': 1.5,
      'same-day': 2
    }
    return basePrice * urgencyMultiplier[request.urgency]
  }

  const submitRequest = () => {
    // Here you would submit to your API
    console.log('Submitting request:', request)
    // Redirect to tracking page or show success
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
              <Package className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Request Delivery</span>
            </div>
            
            <div className="text-sm text-gray-500">
              Step {step} of {totalSteps}
            </div>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 ${
                  index + 1 <= step ? 'bg-blue-600' : 'bg-gray-200'
                } ${index > 0 ? 'ml-1' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Addresses */}
            {step === 1 && (
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Pickup & Delivery</h2>
                    <p className="text-gray-600">Where should we pick up and deliver your item?</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Address *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter pickup address (e.g., 123 Main St, City, ZIP)"
                      value={request.pickupAddress}
                      onChange={(e) => updateRequest('pickupAddress', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter delivery address (e.g., 456 Oak Ave, City, ZIP)"
                      value={request.deliveryAddress}
                      onChange={(e) => updateRequest('deliveryAddress', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Pickup Time
                    </label>
                    <select
                      className="input-field"
                      value={request.pickupTime}
                      onChange={(e) => updateRequest('pickupTime', e.target.value)}
                    >
                      <option value="">Select pickup time</option>
                      <option value="asap">As soon as possible</option>
                      <option value="within-1hr">Within 1 hour</option>
                      <option value="within-2hr">Within 2 hours</option>
                      <option value="today">Today (anytime)</option>
                      <option value="tomorrow">Tomorrow</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={nextStep}
                    disabled={!request.pickupAddress || !request.deliveryAddress}
                    className="btn-primary disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Item Details */}
            {step === 2 && (
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Item Details</h2>
                    <p className="text-gray-600">Tell us about the item you need delivered</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Description *
                    </label>
                    <textarea
                      className="input-field h-24 resize-none"
                      placeholder="Describe the item (e.g., envelope, small package, birthday gift, Facebook Marketplace purchase)"
                      value={request.itemDescription}
                      onChange={(e) => updateRequest('itemDescription', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Priority
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: 'standard', label: 'Standard', time: '2-4 hours', price: '$5' },
                        { value: 'express', label: 'Express', time: '1-2 hours', price: '$7.50' },
                        { value: 'same-day', label: 'Same Day', time: 'Within 30 min', price: '$10' }
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${
                            request.urgency === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="urgency"
                            value={option.value}
                            checked={request.urgency === option.value}
                            onChange={(e) => updateRequest('urgency', e.target.value as any)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.time}</div>
                            <div className="text-lg font-bold text-blue-600 mt-1">{option.price}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      className="input-field h-20 resize-none"
                      placeholder="Any special handling instructions or notes for the courier"
                      value={request.specialInstructions}
                      onChange={(e) => updateRequest('specialInstructions', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!request.itemDescription}
                    className="btn-primary disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact Info */}
            {step === 3 && (
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                    <p className="text-gray-600">How can we reach you about this delivery?</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter your full name"
                      value={request.customerName}
                      onChange={(e) => updateRequest('customerName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="Enter your phone number"
                      value={request.customerPhone}
                      onChange={(e) => updateRequest('customerPhone', e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      We'll use this to send you updates about your delivery
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!request.customerName || !request.customerPhone}
                    className="btn-primary disabled:opacity-50"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Review Your Request</h2>
                    <p className="text-gray-600">Please review your delivery details</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Route Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Route
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="text-gray-500 w-16">From:</span>
                        <span className="text-gray-900">{request.pickupAddress}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-16">To:</span>
                        <span className="text-gray-900">{request.deliveryAddress}</span>
                      </div>
                      {request.pickupTime && (
                        <div className="flex">
                          <span className="text-gray-500 w-16">When:</span>
                          <span className="text-gray-900">{request.pickupTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Item & Service
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="text-gray-500 w-20">Item:</span>
                        <span className="text-gray-900">{request.itemDescription}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-20">Priority:</span>
                        <span className="text-gray-900 capitalize">{request.urgency}</span>
                      </div>
                      {request.specialInstructions && (
                        <div className="flex">
                          <span className="text-gray-500 w-20">Notes:</span>
                          <span className="text-gray-900">{request.specialInstructions}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Contact
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="text-gray-500 w-16">Name:</span>
                        <span className="text-gray-900">{request.customerName}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-16">Phone:</span>
                        <span className="text-gray-900">{request.customerPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Price
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delivery fee</span>
                      <span className="text-2xl font-bold text-blue-600">${calculatePrice()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Payment will be processed after delivery confirmation
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button
                    onClick={submitRequest}
                    className="btn-primary bg-green-600 hover:bg-green-700"
                  >
                    Confirm & Submit Request
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}