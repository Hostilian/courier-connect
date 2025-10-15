import { NextRequest, NextResponse } from 'next/server';

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

// Basic in-memory cache and rate limiting (best-effort; resets on server restart)
const cache = new Map<string, { data: any; expiresAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 30; // max requests per IP per minute
const ipHits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  // Vercel/Next may provide x-forwarded-for
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  // Fallback to remote address if available
  // @ts-ignore
  return (req as any).ip || 'unknown';
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const hit = ipHits.get(ip);
  if (!hit || now > hit.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (hit.count >= RATE_LIMIT_MAX) return false;
  hit.count += 1;
  return true;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and longitude are required.' }, { status: 400 });
  }

  // Validate numeric range
  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum) || Math.abs(latNum) > 90 || Math.abs(lngNum) > 180) {
    return NextResponse.json({ error: 'Invalid latitude or longitude.' }, { status: 400 });
  }

  // Rate limit per IP
  const ip = getClientIp(request);
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please try again shortly.' }, { status: 429 });
  }

  // Cache lookup
  const cacheKey = `${latNum.toFixed(4)},${lngNum.toFixed(4)}`; //  ~11m precision, good enough for city-level
  const cached = cache.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return NextResponse.json(cached.data, { status: 200, headers: { 'X-Cache': 'HIT' } });
  }

  try {
    const query = new URLSearchParams({
      lat: String(latNum),
      lon: String(lngNum),
      format: 'json',
      addressdetails: '1',
    });

    const response = await fetch(`${NOMINATIM_ENDPOINT}?${query.toString()}`, {
      headers: {
        'User-Agent': 'CourierConnect/1.0 (https://hostilian.org)',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Reverse geocoding failed.' }, { status: response.status });
    }

    const data = await response.json();
    const address = data?.address ?? {};
    const payload = {
      countryCode: address.country_code?.toUpperCase(),
      city: address.city || address.town || address.village || address.municipality,
      raw: data,
    };

    // Cache store (5 minutes)
    cache.set(cacheKey, { data: payload, expiresAt: now + 5 * 60_000 });
    return NextResponse.json(payload, { headers: { 'X-Cache': 'MISS' } });
  } catch (error: any) {
    console.error('Reverse geocoding error:', error);
    return NextResponse.json({ error: 'Unable to resolve location.' }, { status: 500 });
  }
}
