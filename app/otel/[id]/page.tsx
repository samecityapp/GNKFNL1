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

  // Fetch all tags to match with hotel's tag slugs
  const allTags = await db.tags.getAll();
  const hotelTagsWithIcons = hotel.tags
    ?.map(tagSlug => allTags.find(t => t.slug === tagSlug))
    .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined) || [];

  const rating = {
    score: hotel.gnkScore || 0,
    reviewCount: 0,
    text: 'İyi',
  };

  // YENİ EKLENEN YAPISAL VERİ (JSON-LD)
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
      <div className="container mx-auto px-6 py-8">
        <BackButton />
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Otel / {hotel.location} / {hotel.name}</p>
            <h1 className="text-4xl font-bold text-gray-900">{hotel.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin size={16} className="mr-2" />
              <span>{hotel.location}</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center bg-blue-600 text-white p-4 rounded-xl text-center">
            <div>
              <p className="font-bold text-2xl">{rating.score}</p>
              <p className="text-xs">{rating.text}</p>
              <p className="text-xs mt-1">{rating.reviewCount} yorum</p>
            </div>
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
