import { db } from '@/lib/db';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export async function RelatedArticles({ location }: { location: string }) {
  const articles = await db.articles.getAllByLocation(location);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
      <div className="flex items-center mb-6">
        <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
        <h3 className="text-2xl font-bold text-gray-900">
          {location} Hakkında Rehberler
        </h3>
      </div>

      <div className="space-y-4">
        {articles.map((article: any) => (
          <Link
            href={`/rehber/${article.slug}`}
            key={article.id}
            className="block p-5 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
          >
            <h4 className="font-semibold text-blue-700 mb-2 text-lg">
              {article.title}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {article.meta_description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
