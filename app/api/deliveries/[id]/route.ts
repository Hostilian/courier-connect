import { getAuth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import DeliveryRequest from '@/models/DeliveryRequest'
import { NextRequest, NextResponse } from 'next/server'

// PATCH - Update a delivery (e.g., accept a delivery)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const auth = await getAuth(request)
    if (!auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    const delivery = await DeliveryRequest.findById(id)

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 })
    }

    if (body.status === 'accepted') {
      if (delivery.status !== 'pending') {
        return NextResponse.json({ error: 'Delivery already accepted' }, { status: 400 })
      }
      delivery.status = 'accepted'
      delivery.courierId = auth.user.userId
      delivery.courierAssignedAt = new Date()
      delivery.timeline.push({
        status: 'accepted',
        message: `Delivery accepted by courier.`,
        timestamp: new Date(),
      })
    } else {
        // Handle other status updates if necessary
        return NextResponse.json({ error: 'Invalid status update' }, { status: 400 });
    }

    await delivery.save()

    return NextResponse.json({
      success: true,
      delivery,
      message: 'Delivery accepted successfully',
    })
  } catch (error) {
    console.error('Error updating delivery:', error)
    return NextResponse.json(
      { error: 'Failed to update delivery' },
      { status: 500 }
    )
  }
}
