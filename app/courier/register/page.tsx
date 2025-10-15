'use client'

import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Car,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    EyeOff,
    Upload,
    User
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface CourierRegistration {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  vehicleType: string
  licenseNumber: string
  hasInsurance: boolean
  availableHours: string[]
  emergencyContact: string
  emergencyPhone: string
  agreeToTerms: boolean
}

export default function CourierRegisterPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registration, setRegistration] = useState<CourierRegistration>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleType: '',
    licenseNumber: '',
    hasInsurance: false,
    availableHours: [],
    emergencyContact: '',
    emergencyPhone: '',
    agreeToTerms: false
  })

  const totalSteps = 4

  const updateRegistration = (field: keyof CourierRegistration, value: any) => {
    setRegistration(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const submitRegistration = async () => {
    // Here you would submit to your API
    console.log('Submitting registration:', registration)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registration)
      })

      if (response.ok) {
        nextStep()
      } else {
        const errorData = await response.json()
        alert(`Registration failed: ${errorData.message}`)
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('An error occurred during registration.')
    }
  }

  const toggleAvailableHour = (hour: string) => {
    const hours = registration.availableHours
    if (hours.includes(hour)) {
      updateRegistration('availableHours', hours.filter(h => h !== hour))
    } else {
      updateRegistration('availableHours', [...hours, hour])
    }
  }

  const vehicleTypes = [
    { value: 'bicycle', label: 'Bicycle', icon: '🚲' },
    { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
    { value: 'car', label: 'Car', icon: '🚗' },
    { value: 'van', label: 'Van', icon: '🚐' }
  ]

  const timeSlots = [
    { value: 'morning', label: 'Morning (6AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
    { value: 'evening', label: 'Evening (6PM - 12AM)' },
    { value: 'night', label: 'Night (12AM - 6AM)' }
  ]

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
              <Car className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Become a Courier</span>
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
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                    <p className="text-gray-600">Tell us about yourself</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter your first name"
                      value={registration.firstName}
                      onChange={(e) => updateRegistration('firstName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter your last name"
                      value={registration.lastName}
                      onChange={(e) => updateRegistration('lastName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="Enter your email address"
                      value={registration.email}
                      onChange={(e) => updateRegistration('email', e.target.value)}
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
                      value={registration.phone}
                      onChange={(e) => updateRegistration('phone', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="input-field pr-10"
                        placeholder="Create a strong password"
                        value={registration.password}
                        onChange={(e) => updateRegistration('password', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="input-field pr-10"
                        placeholder="Confirm your password"
                        value={registration.confirmPassword}
                        onChange={(e) => updateRegistration('confirmPassword', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {registration.password && registration.confirmPassword && registration.password !== registration.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={nextStep}
                    disabled={!registration.firstName || !registration.lastName || !registration.email || !registration.phone || !registration.password || registration.password !== registration.confirmPassword}
                    className="btn-primary disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Information */}
            {step === 2 && (
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Vehicle Information</h2>
                    <p className="text-gray-600">What will you use for deliveries?</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Vehicle Type *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {vehicleTypes.map((vehicle) => (
                        <label
                          key={vehicle.value}
                          className={`relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                            registration.vehicleType === vehicle.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="vehicleType"
                            value={vehicle.value}
                            checked={registration.vehicleType === vehicle.value}
                            onChange={(e) => updateRegistration('vehicleType', e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-3xl mb-2">{vehicle.icon}</div>
                          <div className="text-sm font-medium text-center">{vehicle.label}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver's License Number *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter your license number"
                      value={registration.licenseNumber}
                      onChange={(e) => updateRegistration('licenseNumber', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="hasInsurance"
                      checked={registration.hasInsurance}
                      onChange={(e) => updateRegistration('hasInsurance', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="hasInsurance" className="text-sm text-gray-700">
                      I have valid vehicle insurance *
                    </label>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900 mb-1">Document Upload</h3>
                        <p className="text-sm text-blue-700 mb-3">
                          You'll need to upload these documents after registration:
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Driver's license (front and back)</li>
                          <li>• Vehicle insurance certificate</li>
                          <li>• Vehicle registration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!registration.vehicleType || !registration.licenseNumber || !registration.hasInsurance}
                    className="btn-primary disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Availability */}
            {step === 3 && (
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
                    <p className="text-gray-600">When are you available to work?</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Time Slots *
                    </label>
                    <div className="space-y-3">
                      {timeSlots.map((slot) => (
                        <label
                          key={slot.value}
                          className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={registration.availableHours.includes(slot.value)}
                            onChange={() => toggleAvailableHour(slot.value)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-900">{slot.label}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Select all time slots when you're available to accept delivery requests
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name *
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Full name"
                        value={registration.emergencyContact}
                        onChange={(e) => updateRegistration('emergencyContact', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Phone *
                      </label>
                      <input
                        type="tel"
                        className="input-field"
                        placeholder="Phone number"
                        value={registration.emergencyPhone}
                        onChange={(e) => updateRegistration('emergencyPhone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!registration.availableHours.length || !registration.emergencyContact || !registration.emergencyPhone}
                    className="btn-primary disabled:opacity-50"
                  >
                    Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
                    <p className="text-gray-600">Please review your information</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Personal Info Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="ml-2 text-gray-900">{registration.firstName} {registration.lastName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2 text-gray-900">{registration.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2 text-gray-900">{registration.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Info Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Vehicle Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Vehicle Type:</span>
                        <span className="ml-2 text-gray-900 capitalize">{registration.vehicleType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">License:</span>
                        <span className="ml-2 text-gray-900">{registration.licenseNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Availability Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="text-gray-500">Time Slots:</span>
                        <div className="mt-1">
                          {registration.availableHours.map(hour => {
                            const slot = timeSlots.find(s => s.value === hour)
                            return (
                              <span key={hour} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                {slot?.label}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Emergency Contact:</span>
                        <span className="ml-2 text-gray-900">{registration.emergencyContact} - {registration.emergencyPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={registration.agreeToTerms}
                        onChange={(e) => updateRegistration('agreeToTerms', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                      />
                      <div className="text-sm text-gray-700">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                        . I understand that I will need to complete a background check and upload required documents before I can start accepting deliveries.
                      </div>
                    </label>
                  </div>

                  {/* Earnings Info */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900 mb-1">Earning Potential</h3>
                        <p className="text-sm text-blue-700">
                          Earn $15-30/hour depending on demand and delivery type. You keep 80% of delivery fees, 
                          and we handle all payments and customer service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button
                    onClick={submitRegistration}
                    disabled={!registration.agreeToTerms}
                    className="btn-primary bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Already have account link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/courier/login" className="text-blue-600 hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}