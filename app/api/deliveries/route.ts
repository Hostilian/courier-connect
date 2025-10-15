import dbConnect from '@/lib/mongodb'
import { DeliveryRequest } from '@/models/DeliveryRequest'
import { NextRequest, NextResponse } from 'next/server'

// POST - Create a new delivery request
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = [
      'customerName', 
      'customerPhone', 
      'pickupAddress', 
      'deliveryAddress', 
      'itemDescription'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }
    
    // Calculate pricing based on urgency
    const basePrices = {
      'standard': 5,
      'express': 7.50,
      'same-day': 10
    }
    
    const basePrice = basePrices[body.urgency as keyof typeof basePrices] || basePrices.standard
    const totalPrice = basePrice // Add any additional fees here
    
    // Create delivery request
    const deliveryRequest = new DeliveryRequest({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      pickupAddress: body.pickupAddress,
      deliveryAddress: body.deliveryAddress,
      itemDescription: body.itemDescription,
      itemCategory: body.itemCategory,
      requiresPurchase: body.requiresPurchase,
      purchaseAmount: body.purchaseAmount,
      specialInstructions: body.specialInstructions,
      urgency: body.urgency || 'standard',
      basePrice,
      totalPrice,
      requestedPickupTime: body.pickupTime ? new Date(body.pickupTime) : undefined,
      timeline: [{
        status: 'pending',
        message: 'Delivery request created',
        timestamp: new Date()
      }]
    })
    
    await deliveryRequest.save()
    
    // TODO: Notify available couriers in the area
    
    return NextResponse.json({
      success: true,
      trackingId: deliveryRequest.trackingId,
      message: 'Delivery request created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating delivery request:', error)
    return NextResponse.json(
      { error: 'Failed to create delivery request' },
      { status: 500 }
    )
  }
}

// GET - Get delivery requests (for couriers)
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const courierId = searchParams.get('courierId')
    const area = searchParams.get('area') // for location-based filtering
    
    let query: any = {}
    
    if (status) {
      query.status = status
    }
    
    if (courierId) {
      query.courierId = courierId
    }
    
    // If looking for available jobs, exclude assigned ones
    if (status === 'pending') {
      query.courierId = { $exists: false }
    }
    
    const deliveries = await DeliveryRequest
      .find(query)
      .populate('courierId', 'firstName lastName rating vehicleType')
      .sort({ createdAt: -1 })
      .limit(50)
    
    return NextResponse.json({
      success: true,
      deliveries
    })
    
  } catch (error) {
    console.error('Error fetching delivery requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch delivery requests' },
      { status: 500 }
    )
  }
}