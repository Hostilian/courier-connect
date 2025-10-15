import { NextRequest, NextResponse } from 'next/server';

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and longitude are required.' }, { status: 400 });
  }

  try {
    const query = new URLSearchParams({
      lat,
      lon: lng,
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

    return NextResponse.json({
      countryCode: address.country_code?.toUpperCase(),
      city: address.city || address.town || address.village || address.municipality,
      raw: data,
    });
  } catch (error: any) {
    console.error('Reverse geocoding error:', error);
    return NextResponse.json({ error: 'Unable to resolve location.' }, { status: 500 });
  }
}
