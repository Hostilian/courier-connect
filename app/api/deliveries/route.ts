import dbConnect from '@/lib/mongodb';
import { DeliveryRequest } from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const deliveryRequestSchema = z.object({
  customerName: z.string().min(1, { message: "Customer name is required" }),
  customerPhone: z.string().min(1, { message: "Customer phone is required" }),
  customerEmail: z.string().email().optional(),
  pickupAddress: z.string().min(1, { message: "Pickup address is required" }),
  deliveryAddress: z.string().min(1, { message: "Delivery address is required" }),
  itemDescription: z.string().min(1, { message: "Item description is required" }),
  itemCategory: z.string().optional(),
  requiresPurchase: z.boolean().optional(),
  purchaseAmount: z.number().optional(),
  specialInstructions: z.string().optional(),
  urgency: z.enum(['standard', 'express', 'same-day']).default('standard'),
  pickupTime: z.string().optional(),
});

// POST - Create a new delivery request
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const validation = deliveryRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      pickupAddress,
      deliveryAddress,
      itemDescription,
      itemCategory,
      requiresPurchase,
      purchaseAmount,
      specialInstructions,
      urgency,
      pickupTime,
    } = validation.data;
    
    // Calculate pricing based on urgency
    const basePrices = {
      'standard': 5,
      'express': 7.50,
      'same-day': 10
    }
    
    const basePrice = basePrices[urgency] || basePrices.standard
    const totalPrice = basePrice // Add any additional fees here
    
    // Create delivery request
    const deliveryRequest = new DeliveryRequest({
      customerName,
      customerPhone,
      customerEmail,
      pickupAddress,
      deliveryAddress,
      itemDescription,
      itemCategory,
      requiresPurchase,
      purchaseAmount,
      specialInstructions,
      urgency,
      basePrice,
      totalPrice,
      requestedPickupTime: pickupTime ? new Date(pickupTime) : undefined,
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
      .populate('courierId', 'name rating vehicleType')
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