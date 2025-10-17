import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Courier ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch courier data
    const courier = await User.findById(id)
      .select('name email phone city country profileImage transportType completedDeliveries activeDeliveries rating createdAt');
      
    if (!courier) {
      return NextResponse.json(
        { error: 'Courier not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(courier);
  } catch (error) {
    console.error('Error fetching courier:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courier data' },
      { status: 500 }
    );
  }
}