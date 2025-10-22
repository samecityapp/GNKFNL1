import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, ExternalLink } from 'lucide-react';
import { db } from '@/lib/db';
import { ImageGallery } from '@/components/ImageGallery';
import { HotelDetails } from '@/components/HotelDetails';
import { BackButton } from '@/components/BackButton';
import { RelatedArticles } from '@/components/RelatedArticles';
import { MapPreview } from '@/components/MapPreview';

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
      {/* Hero Section with Gallery and Overlay Back Button */}
      <div className="relative w-full">
        <BackButton variant="overlay" />

        <div className="container mx-auto px-4 sm:px-6">
          <ImageGallery
            images={hotel.galleryImages || (hotel.coverImageUrl ? [hotel.coverImageUrl] : [])}
            videoUrl={hotel.video_url}
            videoThumbnailUrl={hotel.video_thumbnail_url}
          />
        </div>

        {/* Curved Transition Section */}
        <div className="relative -mt-16 bg-white rounded-t-[3rem] pt-12 pb-8 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Hotel Name - Centered */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
              {hotel.name}
            </h1>

            {/* Price - Centered */}
            <div className="text-center mb-8">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {hotel.price.toLocaleString('tr-TR')} ₺ <span className="text-lg font-normal text-gray-600">/ Gece</span>
              </p>
            </div>

            {/* Three Column Grid - Location, Map, Rating */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
              {/* Left Column - Location */}
              <div className="flex flex-col items-center justify-center bg-white border-2 border-gray-200 rounded-2xl p-6 h-[180px]">
                <MapPin className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-base font-semibold text-gray-900 text-center leading-tight">
                  {hotel.location}
                </p>
              </div>

              {/* Center Column - Google Maps Preview */}
              <MapPreview googleMapsUrl={hotel.google_maps_url} />

              {/* Right Column - Rating */}
              <div className="flex flex-col items-center justify-center bg-white border-2 border-blue-600 rounded-2xl p-6 h-[180px]">
                <p className="text-sm font-semibold text-gray-600 mb-2">GNK Puan</p>
                <p className="text-5xl font-bold text-blue-600">{rating.score}</p>
              </div>
            </div>

            {/* Social Links Section */}
            {(hotel.website_url || hotel.instagram_url) && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                {hotel.website_url && (
                  <a
                    href={hotel.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white font-semibold py-3 px-8 rounded-xl transition-colors whitespace-nowrap w-full sm:w-auto"
                  >
                    <span>Otele Git</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {hotel.instagram_url && (
                  <a
                    href={hotel.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white font-semibold py-3 px-8 rounded-xl transition-colors whitespace-nowrap w-full sm:w-auto"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hotel Details and Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
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
