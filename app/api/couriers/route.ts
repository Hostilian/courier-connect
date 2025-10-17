import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = { role: 'courier' };
    
    if (city) query.city = city;
    if (country) query.country = country;
    if (minRating > 0) query.rating = { $gte: minRating };
    
    // Execute query
    const couriers = await User.find(query)
      .select('name city country profileImage transportType rating completedDeliveries')
      .sort({ rating: -1, completedDeliveries: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await User.countDocuments(query);
    
    return NextResponse.json({
      couriers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching couriers:', error);
    return NextResponse.json(
      { error: 'Failed to search couriers' },
      { status: 500 }
    );
  }
}