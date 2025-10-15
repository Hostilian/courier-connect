'use client';

let mapsPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps(apiKey?: string): Promise<typeof google> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Maps can only load in browser'));
  if ((window as any).google && (window as any).google.maps) {
    return Promise.resolve((window as any).google);
  }
  if (!apiKey) apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  if (!apiKey) return Promise.reject(new Error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'));

  if (!mapsPromise) {
    mapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve((window as any).google);
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
  }
  return mapsPromise;
}
