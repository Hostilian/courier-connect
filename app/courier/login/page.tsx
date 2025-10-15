'use client'

import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Car,
    Clock,
    DollarSign,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Shield,
    Truck
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CourierLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const { token } = await response.json()
        localStorage.setItem('token', token)
        // Redirect to courier dashboard
        window.location.href = '/courier/dashboard'
      } else {
        const errorData = await response.json()
        alert(`Login failed: ${errorData.message}`)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('An error occurred during login.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
            
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Courier Login</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600">
              Sign in to your courier account to start earning
            </p>
          </div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field pl-10"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              
              <Link href="/courier/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full btn-primary py-3 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </motion.form>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/courier/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Apply to become a courier
              </Link>
            </p>
          </div>

          {/* Help */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help?{' '}
              <Link href="/support" className="text-blue-600 hover:text-blue-700 hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Benefits & Features */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-blue-700 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.1
          }} />
        </div>

        <div className="relative flex flex-col justify-center p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <h2 className="text-4xl font-bold mb-6">
              Start Earning Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of couriers who are earning flexible income with Courier Connect.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Competitive Earnings</h3>
                  <p className="text-blue-100">Earn $15-30/hour with flexible schedules</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Work Your Hours</h3>
                  <p className="text-blue-100">Set your own schedule and work when you want</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Easy Deliveries</h3>
                  <p className="text-blue-100">Simple local deliveries with GPS navigation</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Full Support</h3>
                  <p className="text-blue-100">24/7 support and insurance coverage included</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-700/50 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-100">500+</div>
                <div className="text-sm text-blue-200">Active couriers earning daily</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}