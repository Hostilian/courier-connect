import { getAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import type { IDeliveryRequest } from '@/models/DeliveryRequest';
import DeliveryRequest from '@/models/DeliveryRequest';
import type { IRating } from '@/models/Rating';
import Rating from '@/models/Rating';
import type { IUser } from '@/models/User';
import User from '@/models/User';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RatingBucket = { rating: number; count: number };

type BadgeContext = {
  rating: number;
  totalReviews: number;
  completedDeliveries: number;
  onTimePercentage: number | null;
  repeatCustomers: number;
  safetyIncidents: number;
};

function toTitleCase(value: string): string {
  return value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function buildBadges(context: BadgeContext): string[] {
  const badges: string[] = [];

  if (context.rating >= 4.8 && context.totalReviews >= 25) {
    badges.push('Top Rated Courier');
  }

  if (context.completedDeliveries >= 200) {
    badges.push('Delivery Champion');
  }

  if ((context.onTimePercentage ?? 0) >= 95) {
    badges.push('Always On Time');
  }

  if (context.repeatCustomers >= 10) {
    badges.push('Customer Favorite');
  }

  if (context.safetyIncidents === 0) {
    badges.push('Zero Incident Streak');
  }

  return badges;
}

function clampScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(5, Number(value.toFixed(1))));
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await getAuth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

  const courier = await User.findById(user.userId).lean<IUser & { _id: Types.ObjectId }>();

    if (!courier) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 });
    }

    const courierId = new Types.ObjectId(user.userId);

    const ratingBucketsAgg = await Rating.aggregate<{ _id: number; count: number }>([
      { $match: { courierId } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);

    const recentRatings = await Rating.find({ courierId })
      .sort({ createdAt: -1 })
      .limit(25)
      .lean<IRating[]>();

    const recentDeliveries = await DeliveryRequest.find({
      courierId,
      status: { $in: ['delivered', 'in_transit', 'picked_up', 'accepted'] },
    })
      .sort({ createdAt: -1 })
      .limit(200)
      .select(
        'serviceCity serviceCountry courierEarnings deliveredAt deliveryDateTime senderEmail urgency packageType status createdAt'
      )
      .lean<IDeliveryRequest[]>();

    const deliveriesForReviews = recentRatings.length
      ? await DeliveryRequest.find({ _id: { $in: recentRatings.map((rating) => rating.deliveryId) } })
          .select('urgency serviceCity status deliveredAt deliveryDateTime')
          .lean<IDeliveryRequest[]>()
      : [];

    const distributionMap = new Map<number, number>();
    ratingBucketsAgg.forEach((bucket: { _id: number; count: number }) => {
      distributionMap.set(bucket._id, bucket.count);
    });

    const ratingDistribution: RatingBucket[] = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: distributionMap.get(rating) ?? 0,
    }));

    const totalReviews = ratingDistribution.reduce((sum, bucket) => sum + bucket.count, 0);
    const averageRating = courier.rating ?? (totalReviews > 0 ? ratingDistribution.reduce((acc, bucket) => acc + bucket.rating * bucket.count, 0) / totalReviews : 5);

    const deliveredDeliveries = recentDeliveries.filter((delivery) => delivery.status === 'delivered');
    const totalDelivered = deliveredDeliveries.length;

    const onTimeCount = deliveredDeliveries.filter((delivery) => {
      if (!delivery.deliveryDateTime || !delivery.deliveredAt) {
        return false;
      }
      return delivery.deliveredAt.getTime() <= delivery.deliveryDateTime.getTime();
    }).length;

    const onTimePercentage = totalDelivered > 0 ? Math.round((onTimeCount / totalDelivered) * 100) : null;

    const earningsTotal = deliveredDeliveries.reduce((sum, delivery) => sum + (delivery.courierEarnings || 0), 0);

    const completionRate = (courier.totalDeliveries ?? 0) > 0
      ? Math.round(((courier.completedDeliveries ?? 0) / courier.totalDeliveries) * 100)
      : totalDelivered > 0
      ? Math.round((totalDelivered / Math.max(totalDelivered, recentDeliveries.length)) * 100)
      : 0;

    const repeatCustomerMap = new Map<string, number>();
    deliveredDeliveries.forEach((delivery) => {
      if (!delivery.senderEmail) return;
      const email = delivery.senderEmail.toLowerCase();
      repeatCustomerMap.set(email, (repeatCustomerMap.get(email) ?? 0) + 1);
    });

    const repeatCustomers = Array.from(repeatCustomerMap.values()).filter((count) => count > 1).length;

    const serviceAreasSet = new Set<string>(Array.isArray(courier.serviceAreas) ? courier.serviceAreas : []);
    recentDeliveries.forEach((delivery) => {
      if (delivery.serviceCity) {
        serviceAreasSet.add(delivery.serviceCity);
      }
    });

    const specialtiesSet = new Set<string>(Array.isArray(courier.specialties) ? courier.specialties : []);
    recentDeliveries.forEach((delivery) => {
      switch (delivery.urgency) {
        case 'urgent':
          specialtiesSet.add('Emergency drop-offs');
          break;
        case 'express':
          specialtiesSet.add('Express deliveries');
          break;
        case 'scheduled':
          specialtiesSet.add('Scheduled routes');
          break;
        default:
          break;
      }
      if (delivery.packageType === 'fragile') {
        specialtiesSet.add('Fragile handling');
      }
    });

    const deliveryMap = new Map<string, (typeof deliveriesForReviews)[number]>();
    deliveriesForReviews.forEach((delivery) => {
      deliveryMap.set(String(delivery._id), delivery);
    });

    const reviews = recentRatings.map((rating) => {
      const delivery = deliveryMap.get(String(rating.deliveryId));
      const baseName = rating.customerEmail ? toTitleCase(rating.customerEmail.split('@')[0]) : 'Customer';

      return {
        id: String(rating._id),
        customerName: baseName || 'Customer',
        rating: rating.rating,
        comment: rating.comment || '',
        createdAt: rating.createdAt?.toISOString() || new Date().toISOString(),
        deliveryType: delivery?.urgency || 'standard',
        city: delivery?.serviceCity || courier.city,
        verified: delivery?.status === 'delivered',
      };
    });

    const metrics = {
      reliability: clampScore(completionRate / 20),
      communication: clampScore(averageRating),
      timeliness: clampScore((onTimePercentage ?? 90) / 20),
      care: clampScore(averageRating + 0.1),
    };

    const profile = {
      id: String(courier._id),
      name: courier.name,
      email: courier.email,
      phone: courier.phone,
      address: courier.city,
      vehicle: courier.vehicleDetails || courier.vehicleType,
      licensePlate: courier.licensePlate || '',
      rating: Number(averageRating.toFixed(1)),
      totalDeliveries: courier.totalDeliveries ?? recentDeliveries.length,
      totalEarnings: Number((courier.earnings ?? earningsTotal).toFixed(2)),
      joinDate: courier.createdAt?.toISOString() || new Date().toISOString(),
      insuranceExpiry: courier.insuranceExpiry?.toISOString() || null,
      verified: courier.isVerified,
      ratingSummary: {
        average: Number(averageRating.toFixed(2)),
        totalReviews,
        completionRate,
        onTimePercentage,
        repeatCustomers,
        averageResponseTime: '—',
        metrics,
        distribution: ratingDistribution,
      },
      badges: buildBadges({
        rating: averageRating,
        totalReviews,
        completedDeliveries: courier.completedDeliveries ?? totalDelivered,
        onTimePercentage,
        repeatCustomers,
        safetyIncidents: courier.safetyIncidents ?? 0,
      }),
      serviceAreas: Array.from(serviceAreasSet).slice(0, 24),
      specialties: Array.from(specialtiesSet).slice(0, 12),
      safetyIncidents: courier.safetyIncidents ?? 0,
      reviews,
      languages: Array.isArray(courier.languages) && courier.languages.length > 0 ? courier.languages : ['English'],
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Failed to fetch courier profile:', error);
    return NextResponse.json({ error: 'Failed to load courier profile' }, { status: 500 });
  }
}
