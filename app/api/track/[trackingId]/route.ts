import dbConnect from '@/lib/mongodb'
import { DeliveryRequest } from '@/models/DeliveryRequest'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    await dbConnect()
    
    const { trackingId } = params
    
    if (!trackingId) {
      return NextResponse.json(
        { error: 'Tracking ID is required' },
        { status: 400 }
      )
    }
    
    const delivery = await DeliveryRequest
      .findOne({ trackingId: trackingId.toUpperCase() })
      .populate('courierId', 'firstName lastName rating vehicleType phone')
      .lean() as any
    
    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 }
      )
    }
    
    // Format response for client
    const response = {
      id: delivery.trackingId,
      status: delivery.status,
      customer: {
        name: delivery.customerName,
        phone: delivery.customerPhone
      },
      courier: delivery.courierId ? {
        name: `${delivery.courierId.firstName} ${delivery.courierId.lastName}`,
        phone: delivery.courierId.phone,
        rating: delivery.courierId.rating,
        vehicle: delivery.courierId.vehicleType
      } : null,
      pickup: {
        address: delivery.pickupAddress,
        time: delivery.actualPickupTime
      },
      delivery: {
        address: delivery.deliveryAddress,
        estimatedTime: delivery.estimatedDeliveryTime,
        actualTime: delivery.actualDeliveryTime
      },
      item: {
        description: delivery.itemDescription,
        instructions: delivery.specialInstructions
      },
      timeline: delivery.timeline,
      price: delivery.totalPrice,
      createdAt: delivery.createdAt,
      estimatedDelivery: delivery.estimatedDeliveryTime
    }
    
    return NextResponse.json({
      success: true,
      delivery: response
    })
    
  } catch (error) {
    console.error('Error fetching delivery:', error)
    return NextResponse.json(
      { error: 'Failed to fetch delivery information' },
      { status: 500 }
    )
  }
}