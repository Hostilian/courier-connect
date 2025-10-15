'use client'

import withAuth from '@/components/withAuth'
import { useEffect, useState } from 'react'

interface Delivery {
  _id: string
  pickupAddress: string
  deliveryAddress: string
  status: string
  totalPrice: number
}

function CourierDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDeliveries() {
      try {
        const response = await fetch('/api/deliveries?status=pending')
        if (response.ok) {
          const data = await response.json()
          setDeliveries(data.deliveries)
        }
      } catch (error) {
        console.error('Failed to fetch deliveries:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeliveries()
  }, [])

  const acceptDelivery = async (id: string) => {
    // Implement accept delivery logic
    console.log(`Accepted delivery ${id}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Deliveries</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : deliveries.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deliveries.map(delivery => (
            <div key={delivery._id} className="border p-4 rounded-lg shadow">
              <h2 className="font-bold">{delivery.pickupAddress} to {delivery.deliveryAddress}</h2>
              <p>Status: {delivery.status}</p>
              <p>Price: ${delivery.totalPrice}</p>
              <button
                onClick={() => acceptDelivery(delivery._id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No available deliveries at the moment.</p>
      )}
    </div>
  )
}

export default withAuth(CourierDashboard)
