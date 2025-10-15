'use client'

import withAuth from '@/components/withAuth'
import { Clock, MapPin, Package, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Delivery {
  _id: string
  pickupAddress: string
  deliveryAddress: string
  status: string
  totalPrice: number
  itemDescription: string
  urgency: string
  createdAt: string
}

function CourierDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/deliveries?status=pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setDeliveries(data.deliveries)
      }
    } catch (error) {
      console.error('Failed to fetch deliveries:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const acceptDelivery = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/deliveries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'accepted' })
      })

      if (response.ok) {
        setDeliveries(prev => prev.filter(d => d._id !== id))
        alert('Delivery accepted successfully!')
      } else {
        const errorData = await response.json()
        alert(`Failed to accept delivery: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error accepting delivery:', error)
      alert('An error occurred while accepting the delivery.')
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchDeliveries()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Courier Dashboard</h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-ghost flex items-center space-x-2"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading deliveries...</span>
          </div>
        ) : deliveries.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              {deliveries.length} available delivery{deliveries.length !== 1 ? 'ies' : ''}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {deliveries.map(delivery => (
                <div key={delivery._id} className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {delivery.urgency === 'express' ? 'Express' : delivery.urgency === 'same-day' ? 'Same Day' : 'Standard'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{delivery.itemDescription}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">${delivery.totalPrice}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Pickup</div>
                        <div className="text-sm text-gray-900">{delivery.pickupAddress}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Delivery</div>
                        <div className="text-sm text-gray-900">{delivery.deliveryAddress}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(delivery.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <button
                      onClick={() => acceptDelivery(delivery._id)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Accept Delivery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries available</h3>
            <p className="text-gray-600 mb-6">Check back later for new delivery requests in your area.</p>
            <button
              onClick={handleRefresh}
              className="btn-primary"
            >
              Check for New Deliveries
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(CourierDashboard)