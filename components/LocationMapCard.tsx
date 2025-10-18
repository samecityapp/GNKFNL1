import { MapPin } from 'lucide-react';

type LocationMapCardProps = {
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  directions?: string | null;
};

export function LocationMapCard({ location, latitude, longitude, googleMapsUrl, directions }: LocationMapCardProps) {
  const mapLink = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const mapImageUrl = `https://placehold.co/400x200/e2e8f0/64748b?text=Harita`;

  return (
    <div className="p-4 border border-gray-200 rounded-xl">
      <a href={mapLink} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden group mb-3">
        <img src={mapImageUrl} alt={`${location} haritası`} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"/>
      </a>

      <p className="flex items-center text-sm text-gray-600 mb-4">
        <MapPin size={14} className="mr-1.5 flex-shrink-0" />
        <span className="truncate">{location}</span>
      </p>

      {directions && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-bold text-gray-800 mb-2">Buraya nasıl giderim?</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{directions}</p>
        </div>
      )}
    </div>
  );
}
