import dbConnect from '@/lib/mongodb';
import Rating from '@/models/Rating';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: {
    courierId: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { courierId } = params;
    
    if (!courierId) {
      return NextResponse.json(
        { error: 'Courier ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch ratings for this courier, sorted by most recent first
    const ratings = await Rating.find({ courierId })
      .sort({ createdAt: -1 })
      .limit(20);
      
    return NextResponse.json({ ratings });
  } catch (error) {
    console.error('Error fetching courier ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}