'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
      <Toaster />
    </ErrorBoundary>
  );
}
