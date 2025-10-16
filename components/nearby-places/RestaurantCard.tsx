import { Restaurant } from '@/lib/types';
import { Info, Star } from 'lucide-react';

type RestaurantCardProps = {
  restaurant: Restaurant;
  onViewDetails: () => void;
};

export function RestaurantCard({ restaurant, onViewDetails }: RestaurantCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={restaurant.image_url}
        alt={restaurant.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{restaurant.description}</p>
        <div className="flex justify-between items-center">
          <button
            onClick={onViewDetails}
            className="flex items-center text-blue-600 hover:underline text-sm font-medium"
          >
            <Info size={16} className="mr-1" />
            Detayları Gör
          </button>
          <div className="flex items-center text-sm">
            <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-bold">{restaurant.google_rating}</span>
            <span className="text-gray-500 ml-1">({restaurant.review_count})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
