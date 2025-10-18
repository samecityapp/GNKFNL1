import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { db } from '@/lib/db';
import { ImageGallery } from '@/components/ImageGallery';
import { HotelDetails } from '@/components/HotelDetails';
import { BackButton } from '@/components/BackButton';
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

  const allTags = await db.tags.getAll();
  const hotelTagsWithIcons = hotel.tags
    ?.map(tagSlug => allTags.find(t => t.slug === tagSlug))
    .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined) || [];

  const rating = {
    score: hotel.gnkScore || 0,
    reviewCount: 0,
    text: 'İyi',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.about || '',
    image: hotel.galleryImages && hotel.galleryImages.length > 0 ? hotel.galleryImages[0] : hotel.coverImageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.location,
      addressLocality: hotel.location.split(',')[1]?.trim() || hotel.location,
      addressCountry: 'TR',
    },
    geo: hotel.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: hotel.coordinates.lat,
      longitude: hotel.coordinates.lng,
    } : undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.score,
      reviewCount: rating.reviewCount,
      bestRating: 10,
    },
    priceRange: '₺₺₺',
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <BackButton />
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="w-full sm:flex-1">
            <p className="text-xs sm:text-sm text-gray-500 mb-2">Otel / {hotel.location} / {hotel.name}</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{hotel.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin size={16} className="mr-2" />
              <span className="text-sm sm:text-base">{hotel.location}</span>
            </div>
          </div>
          <div className="flex-shrink-0 bg-blue-600 text-white px-6 py-4 rounded-xl shadow-lg">
            <div className="text-center">
              <p className="text-xs font-medium mb-1 opacity-90">GNK Puan</p>
              <p className="font-bold text-4xl">{rating.score}</p>
            </div>
          </div>
        </div>

        <ImageGallery
          images={hotel.galleryImages || (hotel.coverImageUrl ? [hotel.coverImageUrl] : [])}
          videoUrl={hotel.video_url}
          videoThumbnailUrl={hotel.video_thumbnail_url}
        />

        <div className="my-6 sm:my-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-green-700 font-medium mb-1">Gecelik Başlangıç Fiyatı</p>
              <p className="text-3xl sm:text-4xl font-bold text-green-900">{hotel.price.toLocaleString('tr-TR')} ₺</p>
            </div>
            {hotel.website_url && (
              <a
                href={hotel.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Rezervasyon Yap
              </a>
            )}
          </div>
        </div>

        <HotelDetails
          features={hotel.amenities || []}
          tabs={{ about: hotel.about || '', rules: hotel.rules || '' }}
          mapImageUrl={''}
          location={hotel.location}
          websiteUrl={hotel.website_url}
          instagramUrl={hotel.instagram_url}
          googleMapsUrl={hotel.google_maps_url}
          tags={hotelTagsWithIcons}
          coordinates={hotel.coordinates}
        />

        <RelatedArticles location={hotel.location.split(',')[0].trim()} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
