import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { db } from '@/lib/db';
import { ImageGallery } from '@/components/ImageGallery';
import { HotelDetails } from '@/components/HotelDetails';
import { BackButton } from '@/components/BackButton';
import { ScoreCard } from '@/components/ScoreCard';
import { LocationMapCard } from '@/components/LocationMapCard';
import { RelatedArticles } from '@/components/RelatedArticles';

export const revalidate = 1800;

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hotel = await db.hotels.getById(params.id);

  if (!hotel) {
    return {
      title: 'Otel Bulunamadı | GNK',
      description: 'Aradığınız otel sistemimizde mevcut değil.',
    };
  }

  return {
    title: `GNK | ${hotel.name} - ${hotel.location}`,
    description: `${hotel.name} hakkında detaylı bilgi. ${(hotel.about || '').substring(0, 120)}...`,
  };
}

export default async function HotelDetailPage({ params }: Props) {
  const hotel = await db.hotels.getById(params.id);

  if (!hotel) {
    notFound();
  }

  const rating = {
    score: hotel.gnkScore || 0,
    reviewCount: 0,
    text: hotel.gnkScore && hotel.gnkScore >= 8 ? 'İyi' : 'Orta',
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">

        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900">{hotel.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin size={16} className="mr-2" />
              <span>{hotel.location}</span>
            </div>
          </div>

          <ImageGallery
            images={hotel.galleryImages || (hotel.coverImageUrl ? [hotel.coverImageUrl] : [])}
            videoUrl={hotel.video_url}
            videoThumbnailUrl={hotel.video_thumbnail_url}
          />
          <HotelDetails
            features={hotel.amenities || []}
            tabs={{ about: hotel.about || '', rules: hotel.rules || '' }}
            location={hotel.location}
          />
          <RelatedArticles location={hotel.location.split(',')[0]} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <ScoreCard
            rating={rating.score}
            reviewCount={rating.reviewCount}
            ratingText={rating.text}
          />
          <LocationMapCard
            location={hotel.location}
            latitude={hotel.coordinates?.lat}
            longitude={hotel.coordinates?.lng}
            googleMapsUrl={hotel.google_maps_url}
            directions={hotel.how_to_get_there}
          />
        </div>
      </div>
    </div>
  );
}
