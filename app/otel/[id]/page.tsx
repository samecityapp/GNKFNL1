import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, Star } from 'lucide-react';
import { db } from '@/lib/db';
import { ImageGallery } from '@/components/ImageGallery';
import { HotelDetails } from '@/components/HotelDetails';
import { BackButton } from '@/components/BackButton';
import { RelatedArticles } from '@/components/RelatedArticles';
import { MapPreview } from '@/components/MapPreview';
import Image from 'next/image';

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
      {/* Mobile View - New Airbnb-style Design */}
      <div className="md:hidden">
        <div className="relative w-full">
          <BackButton variant="overlay" />

          <div className="px-4">
            <ImageGallery
              images={hotel.galleryImages || (hotel.coverImageUrl ? [hotel.coverImageUrl] : [])}
              videoUrl={hotel.video_url}
              videoThumbnailUrl={hotel.video_thumbnail_url}
            />
          </div>

          <div className="relative -mt-12 bg-white rounded-t-[2rem] pt-6 pb-6 shadow-lg">
            <div className="px-5">
              <h1 className="text-2xl font-normal text-gray-900 mb-2 leading-tight">
                {hotel.name}
              </h1>

              <p className="text-xl font-medium text-gray-700 mb-4">
                {hotel.price.toLocaleString('tr-TR')} ₺ <span className="text-sm font-normal text-gray-600">/ Gece</span>
              </p>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-3 h-[100px]">
                  <p className="text-2xl font-bold text-gray-900 mb-1">{rating.score}</p>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-gray-900 text-gray-900" />
                    ))}
                  </div>
                </div>

                <div
                  className="relative flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-2 h-[100px] overflow-hidden cursor-pointer"
                  onClick={() => hotel.google_maps_url && window.open(hotel.google_maps_url, '_blank')}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="https://maps.gstatic.com/mapfiles/api-3/images/google_white5.png"
                      alt="Google Maps"
                      fill
                      className="object-contain opacity-20"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 4C15.178 4 8 11.178 8 20C8 30 24 44 24 44C24 44 40 30 40 20C40 11.178 32.822 4 24 4Z" fill="#EA4335"/>
                        <circle cx="24" cy="20" r="6" fill="#FBBC04"/>
                        <path d="M24 14C20.686 14 18 16.686 18 20C18 23.314 20.686 26 24 26C27.314 26 30 23.314 30 20C30 16.686 27.314 14 24 14Z" fill="#34A853"/>
                        <path d="M24 17C22.343 17 21 18.343 21 20C21 21.657 22.343 23 24 23C25.657 23 27 21.657 27 20C27 18.343 25.657 17 24 17Z" fill="#4285F4"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-3 h-[100px]">
                  <MapPin className="w-5 h-5 text-gray-700 mb-2" />
                  <p className="text-xs font-medium text-gray-900 text-center leading-tight line-clamp-2">
                    {hotel.location}
                  </p>
                </div>
              </div>

              {(hotel.website_url || hotel.instagram_url) && (
                <div className="flex flex-col gap-2 mb-6">
                  {hotel.website_url && (
                    <a
                      href={hotel.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-white border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      <span>Otele Git</span>
                    </a>
                  )}
                  {hotel.instagram_url && (
                    <a
                      href={hotel.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-white border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors"
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

        <div className="px-4 py-6">
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
      </div>

      {/* Desktop View - Original Design */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <BackButton />

          <div className="flex flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Otel / {hotel.location} / {hotel.name}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{hotel.name}</h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin size={16} className="mr-2" />
                <span className="text-base">{hotel.location}</span>
              </div>
            </div>
            <div className="flex-shrink-0 border-2 border-blue-600 bg-white px-6 py-4 rounded-xl shadow-sm">
              <div className="text-center">
                <p className="text-xs font-medium mb-1 text-gray-600">GNK Puan</p>
                <p className="font-bold text-4xl text-blue-600">{rating.score}</p>
              </div>
            </div>
          </div>

          <ImageGallery
            images={hotel.galleryImages || (hotel.coverImageUrl ? [hotel.coverImageUrl] : [])}
            videoUrl={hotel.video_url}
            videoThumbnailUrl={hotel.video_thumbnail_url}
          />

          <div className="my-6 sm:my-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Gecelik Başlangıç Fiyatı</p>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">{hotel.price.toLocaleString('tr-TR')} ₺</p>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                {hotel.website_url && (
                  <a
                    href={hotel.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <span>Otele Git</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                )}
                {hotel.instagram_url && (
                  <a
                    href={hotel.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    <span>Instagram</span>
                  </a>
                )}
              </div>
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
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
