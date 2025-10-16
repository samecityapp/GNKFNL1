'use client';

import { MapPin, ExternalLink, Instagram, Map } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { NearbyPlacesTab } from './nearby-places/NearbyPlacesTab';

type HotelDetailsProps = {
  features: string[];
  tabs: {
    about: string;
    rules: string;
  };
  mapImageUrl: string;
  location: string;
  websiteUrl?: string;
  instagramUrl?: string;
  googleMapsUrl?: string;
  tags?: Array<{ name: string; slug: string; icon?: string }>;
};

export function HotelDetails({ features, tabs, mapImageUrl, location, websiteUrl, instagramUrl, googleMapsUrl, tags }: HotelDetailsProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Otel Özellikleri</h2>
              {tags && tags.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {tags.map((tag, index) => {
                    const IconComponent = (LucideIcons as any)[tag.icon || 'Tag'] || LucideIcons.Tag;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl hover:shadow-md transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-blue-900 font-semibold text-sm">{tag.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 font-medium">Otel özellikleri henüz eklenmemiş.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Neden Bu Otel</h2>
              {tabs.about ? (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {tabs.about}
                  </p>
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 font-medium">Bu bölüm henüz doldurulmamış.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Yakında Ne Yenir</h2>
              <NearbyPlacesTab location={location} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-6 rounded-2xl transition-colors shadow-lg hover:shadow-xl group"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg">Otele Git</span>
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          )}

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold py-6 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl group"
            >
              <div className="flex items-center justify-center gap-3">
                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Instagram</span>
              </div>
            </a>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Konum
          </h3>
          <p className="text-gray-600 text-base mb-6">{location}</p>
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-md hover:shadow-lg group"
            >
              <Map className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Haritada Gör</span>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
