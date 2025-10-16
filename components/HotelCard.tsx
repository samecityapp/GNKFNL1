'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Play } from 'lucide-react';
import { Hotel } from '@/lib/types';

const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  loading: () => <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"><p className="text-white">Video Oynatıcı Yükleniyor...</p></div>
});

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const formattedPrice = new Intl.NumberFormat('tr-TR').format(hotel.price);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVideoOpen(true);
  };

  return (
    <>
      <Link href={`/otel/${hotel.id}`} className="block group">
        <div className="w-full rounded-2xl overflow-hidden bg-gray-200 relative shadow-lg">
          {hotel.video_url ? (
            <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
              {hotel.video_thumbnail_url ? (
                <Image
                  src={hotel.video_thumbnail_url}
                  alt={hotel.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="absolute inset-0 w-full h-full object-cover"
                  priority={false}
                  loading="lazy"
                  quality={75}
                />
              ) : hotel.coverImageUrl ? (
                <Image
                  src={hotel.coverImageUrl}
                  alt={hotel.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="absolute inset-0 w-full h-full object-cover"
                  priority={false}
                  loading="lazy"
                  quality={75}
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">Video Kapak</span>
                </div>
              )}
              <div
                onClick={handleVideoClick}
                className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
          ) : hotel.coverImageUrl ? (
            <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
              <Image
                src={hotel.coverImageUrl}
                alt={hotel.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority={false}
              />
            </div>
          ) : (
            <div className="w-full aspect-[3/4] flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">Resim Yok</span>
            </div>
          )}

        {hotel.price > 0 && (
          <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full p-4">
            <p className="text-white font-bold text-xl">
              {formattedPrice}
              <span className="text-sm font-normal"> TL / Gece</span>
            </p>
          </div>
        )}

        {hotel.gnkScore > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm">
            <Star className="w-4 h-4 fill-current" />
            <span>{hotel.gnkScore.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="font-bold text-gray-900 text-lg truncate">{hotel.name}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <p className="truncate">{hotel.location}</p>
        </div>
      </div>
      </Link>

      {hotel.video_url && (
        <VideoPlayer
          videoUrl={hotel.video_url}
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
        />
      )}
    </>
  );
}