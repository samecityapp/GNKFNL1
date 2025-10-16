'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
    >
      <ChevronLeft className="h-5 w-5 mr-1" />
      Geri Dön
    </button>
  );
}
