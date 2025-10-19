import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import type { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface DirectoryCourierResponse {
  id: string;
  name: string;
  city: string;
  country?: string;
  rating: number;
  totalReviews: number;
  completedDeliveries: number;
  vehicle: string;
  languages: string[];
  specialties: string[];
  isTopPerformer: boolean;
}

interface DirectoryCourierDoc {
  _id: Types.ObjectId;
  name: string;
  city: string;
  country?: string;
  rating?: number;
  ratingCount?: number;
  completedDeliveries?: number;
  vehicleType: string;
  vehicleDetails?: string;
  languages?: string[];
  specialties?: string[];
}

function buildSearchQuery(search: string) {
  const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  return [
    { name: regex },
    { city: regex },
    { country: regex },
    { languages: regex },
    { specialties: regex },
  ];
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const minRating = Number(url.searchParams.get('minRating') || '0');
    const limit = Math.min(Number(url.searchParams.get('limit') || '18'), 50);
    const city = url.searchParams.get('city');
    const country = url.searchParams.get('country');
    const search = url.searchParams.get('q');

    const query: Record<string, unknown> = {
      role: 'courier',
      isVerified: true,
    };

    if (!Number.isNaN(minRating) && minRating > 0) {
      query.rating = { $gte: minRating };
    }

    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };
    }

    if (country) {
      query.country = { $regex: new RegExp(country, 'i') };
    }

    if (search) {
      query.$or = buildSearchQuery(search);
    }

    const couriers = (await User.find(query)
      .sort({ rating: -1, completedDeliveries: -1 })
      .limit(limit)
      .select(
        'name city country rating ratingCount completedDeliveries vehicleType vehicleDetails languages specialties'
      )
      .lean()) as unknown as DirectoryCourierDoc[];

    const payload: DirectoryCourierResponse[] = couriers.map((courier) => {
      const completed = courier.completedDeliveries ?? 0;
      const rating = courier.rating ?? 0;
      const ratingCount = courier.ratingCount ?? 0;
      const languages = Array.isArray(courier.languages) ? courier.languages : [];
      const specialties = Array.isArray(courier.specialties) ? courier.specialties : [];
      const vehicle = courier.vehicleDetails?.trim() || courier.vehicleType;

      return {
        id: courier._id.toString(),
        name: courier.name,
        city: courier.city,
        country: courier.country,
        rating,
        totalReviews: ratingCount,
        completedDeliveries: completed,
        vehicle,
        languages,
        specialties,
        isTopPerformer: rating >= 4.8 && completed >= 150,
      };
    });

    return NextResponse.json({ couriers: payload });
  } catch (error) {
    console.error('Failed to fetch couriers directory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch couriers' },
      { status: 500 }
    );
  }
}
