'use client';

import { Map, ExternalLink } from 'lucide-react';

type MapPreviewProps = {
  googleMapsUrl?: string;
};

export function MapPreview({ googleMapsUrl }: MapPreviewProps) {
  const handleClick = () => {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 h-[180px] cursor-pointer group overflow-hidden hover:shadow-lg transition-all"
      onClick={handleClick}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
        <Map className="w-32 h-32 text-green-600" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <Map className="w-10 h-10 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
        <p className="text-sm font-bold text-green-900 text-center mb-1">Haritada Gör</p>
        <ExternalLink className="w-4 h-4 text-green-700 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>

      <div className="absolute inset-0 bg-green-100 opacity-0 group-hover:opacity-30 transition-opacity" />
    </div>
  );
}
