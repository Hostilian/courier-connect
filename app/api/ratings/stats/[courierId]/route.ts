import dbConnect from '@/lib/mongodb';
import Rating from '@/models/Rating';
import mongoose from 'mongoose';
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

    // Make sure courierId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courierId)) {
      return NextResponse.json(
        { error: 'Invalid courier ID format' },
        { status: 400 }
      );
    }
    
    // Aggregate to calculate rating stats
    const results = await Rating.aggregate([
      { 
        $match: { 
          courierId: new mongoose.Types.ObjectId(courierId) 
        } 
      },
      { 
        $group: { 
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          fiveStarCount: { 
            $sum: { 
              $cond: [{ $eq: ['$rating', 5] }, 1, 0] 
            } 
          },
          fourStarCount: { 
            $sum: { 
              $cond: [{ $eq: ['$rating', 4] }, 1, 0] 
            } 
          },
          threeStarCount: { 
            $sum: { 
              $cond: [{ $eq: ['$rating', 3] }, 1, 0] 
            } 
          },
          twoStarCount: { 
            $sum: { 
              $cond: [{ $eq: ['$rating', 2] }, 1, 0] 
            } 
          },
          oneStarCount: { 
            $sum: { 
              $cond: [{ $eq: ['$rating', 1] }, 1, 0] 
            } 
          }
        } 
      }
    ]);
    
    // If no ratings, return default values
    if (results.length === 0) {
      return NextResponse.json({
        averageRating: 0,
        totalRatings: 0,
        distribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        }
      });
    }
    
    // Format the response
    const stats = results[0];
    
    return NextResponse.json({
      averageRating: parseFloat(stats.averageRating.toFixed(1)),
      totalRatings: stats.totalRatings,
      distribution: {
        5: stats.fiveStarCount,
        4: stats.fourStarCount,
        3: stats.threeStarCount,
        2: stats.twoStarCount,
        1: stats.oneStarCount
      }
    });
  } catch (error) {
    console.error('Error fetching rating stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rating statistics' },
      { status: 500 }
    );
  }
}