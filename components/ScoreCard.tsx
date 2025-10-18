import { Star } from 'lucide-react';

type ScoreCardProps = {
  rating: number;
  reviewCount: number;
  ratingText: string;
};

export function ScoreCard({ rating, reviewCount, ratingText }: ScoreCardProps) {
  return (
    <div className="p-6 border border-gray-200 rounded-xl bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-4xl font-bold text-gray-900">{rating.toFixed(1)}</span>
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-sm text-gray-600">{ratingText}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500">{reviewCount} değerlendirme</p>
    </div>
  );
}
