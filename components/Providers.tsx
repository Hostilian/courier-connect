'use client';

import { LocationProvider } from '@/components/LocationProvider';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <LocationProvider>{children}</LocationProvider>;
}